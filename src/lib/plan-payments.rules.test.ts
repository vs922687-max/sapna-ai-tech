// Database rules for Pricing-page UPI plan payments, run against every project
// migration replayed into an in-memory Postgres (see src/test/migrated-db.ts).
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { PGlite } from "@electric-sql/pglite";
import { asUser, createMigratedDb } from "../test/migrated-db";

const USER = "11111111-1111-1111-1111-111111111111";
const OTHER = "22222222-2222-2222-2222-222222222222";
const ADMIN = "33333333-3333-3333-3333-333333333333";

let db: PGlite;
let seq = 100000000000;
const nextUtr = () => String(++seq);

before(async () => {
  db = await createMigratedDb();
  await db.exec(`
    INSERT INTO auth.users (id, email) VALUES ('${USER}', 'user@example.com'), ('${OTHER}', 'other@example.com'), ('${ADMIN}', 'admin@example.com');
    INSERT INTO public.user_roles (user_id, role) VALUES ('${ADMIN}', 'admin');
  `);
});

async function pay(userId: string, plan: string, fields: Record<string, unknown> = {}) {
  const row = { user_id: userId, plan_name: plan, amount: 1, utr_number: nextUtr(), ...fields };
  const cols = Object.keys(row);
  return asUser(db, userId, () =>
    db.query<{ id: string; amount: string; status: string; user_email: string }>(
      `INSERT INTO public.plan_payments (${cols.join(", ")}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(", ")}) RETURNING id, amount, status, user_email`,
      Object.values(row),
    ),
  );
}

async function planOf(userId: string) {
  const r = await db.query<{ plan_name: string; status: string; expires_at: string | null }>(
    "SELECT plan_name, status, expires_at FROM public.user_plans WHERE user_id = $1", [userId]);
  return r.rows[0];
}

async function resetUser(userId: string) {
  await db.query("DELETE FROM public.user_plans WHERE user_id = $1", [userId]);
  await db.query("DELETE FROM public.plan_payments WHERE user_id = $1", [userId]);
}

describe("plan payment submission", () => {
  it("Pro is charged ₹499 whatever amount the browser sends", async () => {
    await resetUser(USER);
    const r = await pay(USER, "Pro", { amount: 1 });
    assert.equal(Number(r.rows[0]?.amount), 499);
    assert.equal(r.rows[0]?.user_email, "user@example.com");
  });

  it("Team is charged ₹1,499", async () => {
    await resetUser(USER);
    const r = await pay(USER, "Team", { amount: 5 });
    assert.equal(Number(r.rows[0]?.amount), 1499);
  });

  it("submitting a UTR does not activate the plan; it waits for verification", async () => {
    await resetUser(USER);
    await pay(USER, "Pro");
    const plan = await planOf(USER);
    assert.equal(plan?.plan_name, "Pro");
    assert.equal(plan?.status, "pending");
    assert.equal(plan?.expires_at, null);
  });

  it("requires a 12-digit UTR", async () => {
    await assert.rejects(pay(USER, "Pro", { utr_number: "12345" }));
    await assert.rejects(pay(USER, "Pro", { utr_number: "1234567890123" }));
  });

  it("rejects a UTR that was already used", async () => {
    await resetUser(USER);
    await resetUser(OTHER);
    await pay(USER, "Pro", { utr_number: "999999999999" });
    await assert.rejects(pay(OTHER, "Pro", { utr_number: "999999999999" }));
  });

  it("a user cannot submit a payment for someone else", async () => {
    await assert.rejects(asUser(db, USER, () =>
      db.query("INSERT INTO public.plan_payments (user_id, plan_name, utr_number) VALUES ($1, 'Pro', $2)", [OTHER, nextUtr()])));
  });

  it("a user cannot submit an already-approved payment", async () => {
    await assert.rejects(pay(USER, "Pro", { status: "approved" }));
  });

  it("allows at most 3 unchecked payments per user", async () => {
    await resetUser(USER);
    await pay(USER, "Pro");
    await pay(USER, "Pro");
    await pay(USER, "Pro");
    await assert.rejects(pay(USER, "Pro"));
  });

  it("only Pro and Team payments are accepted (no 'Free' or unknown plan payments)", async () => {
    await assert.rejects(pay(USER, "Free"));
    await assert.rejects(pay(USER, "Enterprise"));
  });
});

describe("who can see and review plan payments", () => {
  it("users only see their own payments and plan", async () => {
    await resetUser(USER);
    await resetUser(OTHER);
    await pay(USER, "Pro");
    await pay(OTHER, "Team");
    const seen = await asUser(db, USER, () => db.query<{ user_id: string }>("SELECT user_id FROM public.plan_payments"));
    assert.deepEqual([...new Set(seen.rows.map((r) => r.user_id))], [USER]);
    const plans = await asUser(db, USER, () => db.query<{ user_id: string }>("SELECT user_id FROM public.user_plans"));
    assert.deepEqual(plans.rows.map((r) => r.user_id), [USER]);
  });

  it("a user cannot approve or edit their own payment", async () => {
    await resetUser(USER);
    const id = (await pay(USER, "Pro")).rows[0]!.id;
    await asUser(db, USER, () => db.query("UPDATE public.plan_payments SET status = 'approved' WHERE id = $1", [id]));
    const r = await db.query<{ status: string }>("SELECT status FROM public.plan_payments WHERE id = $1", [id]);
    assert.equal(r.rows[0]?.status, "pending");
    await assert.rejects(asUser(db, USER, () => db.query("UPDATE public.plan_payments SET amount = 1 WHERE id = $1", [id])));
  });

  it("a user cannot give themselves a plan directly", async () => {
    await assert.rejects(asUser(db, USER, () =>
      db.query("INSERT INTO public.user_plans (user_id, plan_name, status) VALUES ($1, 'Team', 'active')", [USER])));
  });

  it("admin sees every payment", async () => {
    const r = await asUser(db, ADMIN, () => db.query<{ user_id: string }>("SELECT DISTINCT user_id FROM public.plan_payments"));
    assert.ok(r.rows.length >= 2);
  });

  it("admin marking received activates the plan for 30 days", async () => {
    await resetUser(USER);
    const id = (await pay(USER, "Team")).rows[0]!.id;
    await asUser(db, ADMIN, () => db.query("UPDATE public.plan_payments SET status = 'approved' WHERE id = $1", [id]));
    const plan = await planOf(USER);
    assert.equal(plan?.status, "active");
    assert.equal(plan?.plan_name, "Team");
    const days = (new Date(plan!.expires_at!).getTime() - Date.now()) / 86_400_000;
    assert.ok(days > 29.9 && days <= 30, `expected ~30 days, got ${days}`);
  });

  it("a new unverified UTR does not replace an active plan", async () => {
    await resetUser(USER);
    const id = (await pay(USER, "Pro")).rows[0]!.id;
    await asUser(db, ADMIN, () => db.query("UPDATE public.plan_payments SET status = 'approved' WHERE id = $1", [id]));
    await pay(USER, "Team");
    const plan = await planOf(USER);
    assert.equal(plan?.plan_name, "Pro");
    assert.equal(plan?.status, "active");
  });

  it("admin rejecting a fake payment switches the user back to Free", async () => {
    await resetUser(USER);
    const id = (await pay(USER, "Pro")).rows[0]!.id;
    await asUser(db, ADMIN, () => db.query("UPDATE public.plan_payments SET status = 'rejected' WHERE id = $1", [id]));
    const plan = await planOf(USER);
    assert.equal(plan?.plan_name, "Free");
    assert.equal(plan?.status, "free");
  });

  it("a reviewed payment cannot be reviewed again", async () => {
    await resetUser(USER);
    const id = (await pay(USER, "Pro")).rows[0]!.id;
    await asUser(db, ADMIN, () => db.query("UPDATE public.plan_payments SET status = 'rejected' WHERE id = $1", [id]));
    await assert.rejects(asUser(db, ADMIN, () => db.query("UPDATE public.plan_payments SET status = 'approved' WHERE id = $1", [id])));
  });
});
