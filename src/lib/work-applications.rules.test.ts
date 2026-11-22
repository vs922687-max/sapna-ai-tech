// Regression tests for Work & Earn application rules, run against every project
// migration replayed into an in-memory Postgres (see src/test/migrated-db.ts).
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { PGlite } from "@electric-sql/pglite";
import { asUser, createMigratedDb } from "../test/migrated-db";

const CLIENT = "11111111-1111-1111-1111-111111111111";
const WORKER = "22222222-2222-2222-2222-222222222222";
const OTHER = "33333333-3333-3333-3333-333333333333";
const CLOSED_JOB = "aaaaaaaa-0000-0000-0000-000000000002";
const WORKER_OWN_JOB = "aaaaaaaa-0000-0000-0000-000000000003";

let db: PGlite;
let seq = 0;

before(async () => {
  db = await createMigratedDb();
  await db.exec(`
    INSERT INTO auth.users (id) VALUES ('${CLIENT}'), ('${WORKER}'), ('${OTHER}');
    INSERT INTO public.work_jobs (id, client_id, title, description, category, status) VALUES
      ('${CLOSED_JOB}', '${CLIENT}', 'Old job', 'Closed already', 'design', 'closed'),
      ('${WORKER_OWN_JOB}', '${WORKER}', 'Own job', 'Posted by worker', 'design', 'open');
  `);
});

/** A fresh open job owned by CLIENT (each worker may apply to a job only once). */
async function newOpenJob(): Promise<string> {
  const id = `cccccccc-0000-0000-0000-${String(++seq).padStart(12, "0")}`;
  await db.query(
    `INSERT INTO public.work_jobs (id, client_id, title, description, category, status)
     VALUES ($1, $2, 'Test job', 'Test job description', 'design', 'open')`,
    [id, CLIENT],
  );
  return id;
}

/** Superuser seed of an application in a given state, bypassing RLS and triggers' actor checks. */
async function seedApplication(status: string, paymentStatus = "pending"): Promise<string> {
  const id = `bbbbbbbb-0000-0000-0000-${String(++seq).padStart(12, "0")}`;
  await db.query(
    `INSERT INTO public.work_applications (id, job_id, worker_id, cover_note, status, payment_status)
     VALUES ($1, $2, $3, 'Seeded application note', $4, $5)`,
    [id, await newOpenJob(), WORKER, status, paymentStatus],
  );
  return id;
}

async function apply(userId: string, fields: Record<string, unknown>) {
  const row = { job_id: await newOpenJob(), worker_id: userId, cover_note: "I can do this job well and on time.", ...fields };
  const cols = Object.keys(row);
  return asUser(db, userId, () =>
    db.query(
      `INSERT INTO public.work_applications (${cols.join(", ")}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING status, payment_status`,
      Object.values(row),
    ),
  );
}

async function readApplication(id: string) {
  const { rows } = await db.query<{ status: string; payment_status: string; worker_id: string }>(
    "SELECT status, payment_status, worker_id FROM public.work_applications WHERE id = $1",
    [id],
  );
  return rows[0];
}

describe("new work applications", () => {
  it("a worker can apply to an open job and starts as applied / pending payment", async () => {
    const { rows } = await apply(WORKER, {});
    assert.deepEqual(rows[0], { status: "applied", payment_status: "pending" });
  });

  it("a worker cannot create an application that is already approved", async () => {
    await assert.rejects(apply(WORKER, { status: "approved" }), /row-level security/);
  });

  it("a worker cannot create an application that is already paid", async () => {
    await assert.rejects(apply(WORKER, { payment_status: "paid" }), /row-level security/);
  });

  it("a worker cannot create an application with work already submitted", async () => {
    await assert.rejects(apply(WORKER, { submission_url: "https://example.com/work.zip" }), /row-level security/);
  });

  it("a user cannot apply on behalf of another worker", async () => {
    await assert.rejects(apply(OTHER, { worker_id: WORKER }), /row-level security/);
  });

  it("nobody can apply to a closed job", async () => {
    await assert.rejects(apply(WORKER, { job_id: CLOSED_JOB }), /row-level security/);
  });

  it("a worker cannot apply to their own job", async () => {
    await assert.rejects(apply(WORKER, { job_id: WORKER_OWN_JOB }), /row-level security/);
  });
});

describe("worker updates", () => {
  it("a worker can move accepted work to submitted", async () => {
    const id = await seedApplication("accepted");
    await asUser(db, WORKER, () => db.query("UPDATE public.work_applications SET status = 'submitted' WHERE id = $1", [id]));
    assert.equal((await readApplication(id))?.status, "submitted");
  });

  it("a worker cannot approve their own work", async () => {
    const id = await seedApplication("submitted");
    await assert.rejects(
      asUser(db, WORKER, () => db.query("UPDATE public.work_applications SET status = 'approved' WHERE id = $1", [id])),
      /Invalid worker status change/,
    );
    assert.equal((await readApplication(id))?.status, "submitted");
  });

  it("a worker cannot mark their own payment as paid", async () => {
    const id = await seedApplication("approved");
    await assert.rejects(
      asUser(db, WORKER, () => db.query("UPDATE public.work_applications SET payment_status = 'paid' WHERE id = $1", [id])),
      /Workers cannot change approval or payment details/,
    );
    assert.equal((await readApplication(id))?.payment_status, "pending");
  });

  it("a worker cannot hand an application to someone else", async () => {
    const id = await seedApplication("applied");
    await assert.rejects(
      asUser(db, WORKER, () => db.query("UPDATE public.work_applications SET worker_id = $2 WHERE id = $1", [id, OTHER])),
    );
    assert.equal((await readApplication(id))?.worker_id, WORKER);
  });
});

describe("job owner updates", () => {
  it("the job owner can approve submitted work and then mark it paid", async () => {
    const id = await seedApplication("submitted");
    await asUser(db, CLIENT, async () => {
      await db.query("UPDATE public.work_applications SET status = 'approved' WHERE id = $1", [id]);
      await db.query("UPDATE public.work_applications SET payment_status = 'paid' WHERE id = $1", [id]);
    });
    assert.deepEqual(await readApplication(id), { status: "approved", payment_status: "paid", worker_id: WORKER });
  });

  it("the job owner cannot mark payment before approving the work", async () => {
    const id = await seedApplication("submitted");
    await assert.rejects(
      asUser(db, CLIENT, () => db.query("UPDATE public.work_applications SET payment_status = 'paid' WHERE id = $1", [id])),
      /Payment status can only change after work approval/,
    );
  });

  it("the job owner cannot rewrite the worker's submission", async () => {
    const id = await seedApplication("submitted");
    await assert.rejects(
      asUser(db, CLIENT, () => db.query("UPDATE public.work_applications SET submission_note = 'changed' WHERE id = $1", [id])),
      /Clients cannot change worker submission details/,
    );
  });

  it("an unrelated user cannot change someone else's application", async () => {
    const id = await seedApplication("submitted");
    const result = await asUser(db, OTHER, () =>
      db.query("UPDATE public.work_applications SET status = 'approved' WHERE id = $1", [id]),
    );
    assert.equal(result.affectedRows, 0);
    assert.equal((await readApplication(id))?.status, "submitted");
  });
});
