// Test-only helper: boots an in-memory Postgres (PGlite), stubs the small parts of
// the hosted auth/storage schemas the migrations reference, then replays every
// project migration in order so tests run against the real policies and triggers.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";

const ROOT = join(import.meta.dir, "..", "..");

const PLATFORM_STUBS = `
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

CREATE SCHEMA auth;
CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb DEFAULT '{}'::jsonb);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
  $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS
  $$ SELECT nullif(current_setting('request.jwt.claim.role', true), '') $$;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;

CREATE SCHEMA storage;
CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean DEFAULT false);
CREATE TABLE storage.objects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bucket_id text, name text, owner uuid);
CREATE FUNCTION storage.foldername(name text) RETURNS text[] LANGUAGE sql IMMUTABLE AS
  $$ SELECT string_to_array(name, '/') $$;
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;
`;

function migrationFiles(): string[] {
  const legacy = readdirSync(join(ROOT, "supabase/migrations")).filter((f) => f.endsWith(".sql")).sort()
    .map((f) => join(ROOT, "supabase/migrations", f));
  const current = readdirSync(join(ROOT, "drizzle/migrations")).filter((f) => f.endsWith(".sql")).sort()
    .map((f) => join(ROOT, "drizzle/migrations", f));
  return [...legacy, ...current];
}

export async function createMigratedDb(): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(PLATFORM_STUBS);
  for (const file of migrationFiles()) {
    const sql = readFileSync(file, "utf8").replace(/--> statement-breakpoint/g, "");
    try {
      await db.exec(sql);
    } catch (error) {
      throw new Error(`Migration failed: ${file}\n${(error as Error).message}`);
    }
  }
  return db;
}

/** Run `fn` as a signed-in user (RLS and auth.uid() apply), then return to the superuser. */
export async function asUser<T>(db: PGlite, userId: string, fn: () => Promise<T>): Promise<T> {
  await db.exec(`SELECT set_config('request.jwt.claim.sub', '${userId}', false);
    SELECT set_config('request.jwt.claim.role', 'authenticated', false);
    SET ROLE authenticated;`);
  try {
    return await fn();
  } finally {
    await db.exec(`RESET ROLE;
      SELECT set_config('request.jwt.claim.sub', '', false);
      SELECT set_config('request.jwt.claim.role', '', false);`);
  }
}
