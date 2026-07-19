import { supabase } from "@/integrations/supabase/client";

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Please sign in to use AI tools.");
  return { Authorization: `Bearer ${token}` };
}

export async function askAi(prompt: string, system?: string): Promise<string> {
  const auth = await authHeaders();
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth },
    body: JSON.stringify({ prompt, system }),
  });
  const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data.text ?? "";
}

export async function aiAuthHeaders(): Promise<Record<string, string>> {
  return authHeaders();
}
