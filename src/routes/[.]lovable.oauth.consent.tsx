import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

// The @supabase/supabase-js auth.oauth namespace is beta; type it locally.
type AuthorizationDetails = {
  client?: { name?: string; client_id?: string; redirect_uris?: string[] } | null;
  redirect_url?: string;
  redirect_to?: string;
  scopes?: string[];
};
type OAuthResult = { data: AuthorizationDetails | null; error: { message: string } | null };
type SupabaseAuthOAuth = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};
const authOAuth = (supabase.auth as unknown as { oauth: SupabaseAuthOAuth }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await authOAuth.getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="mx-auto max-w-md p-8 text-center">
      <h1 className="mb-2 text-xl font-semibold">Could not load this authorization request</h1>
      <p className="text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await authOAuth.approveAuthorization(authorization_id)
      : await authOAuth.denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("No redirect returned by the authorization server."); return; }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.76_0.17_55)] via-white to-[oklch(0.66_0.16_155)]">
        <Sparkles className="h-5 w-5 text-[oklch(0.18_0.03_60)]" />
      </div>
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">
          Connect {clientName} to Bharat AI Sathi
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This lets {clientName} use Bharat AI Sathi tools as you while you are signed in.
        </p>
      </div>
      {details?.scopes && details.scopes.length > 0 && (
        <div className="w-full rounded-lg border p-4 text-sm">
          <div className="mb-2 font-medium">Requested access</div>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            {details.scopes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">{error}</p>
      )}
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Button disabled={busy} onClick={() => decide(true)} className="flex-1">
          Approve
        </Button>
        <Button disabled={busy} variant="outline" onClick={() => decide(false)} className="flex-1">
          Deny
        </Button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Bharat AI Sathi's own permissions still apply. You can revoke access at any time from your dashboard.
      </p>
    </main>
  );
}
