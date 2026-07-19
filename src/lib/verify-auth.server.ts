// Server-only helper: verify a Supabase bearer token from a raw Request.
// Used by server routes under src/routes/api/* to require a signed-in user.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type VerifiedAuth = {
  userId: string;
  token: string;
  claims: Record<string, unknown>;
};

function unauthorized(msg: string): Response {
  return new Response(JSON.stringify({ error: msg }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function isNewSupabaseApiKey(v: string) {
  return v.startsWith("sb_publishable_") || v.startsWith("sb_secret_");
}

export async function verifyBearer(
  request: Request,
): Promise<{ ok: true; auth: VerifiedAuth } | { ok: false; response: Response }> {
  const authHeader = request.headers.get("authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) {
    return { ok: false, response: unauthorized("Sign-in required") };
  }
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token || token.split(".").length !== 3) {
    return { ok: false, response: unauthorized("Invalid token") };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  const supabase = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (isNewSupabaseApiKey(key) && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) {
    return { ok: false, response: unauthorized("Invalid or expired session") };
  }

  return {
    ok: true,
    auth: {
      userId: String(data.claims.sub),
      token,
      claims: data.claims as Record<string, unknown>,
    },
  };
}
