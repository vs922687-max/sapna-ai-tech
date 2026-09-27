import { createServerFn } from "@tanstack/react-start";

/** Record only a server-generated visit row; callers cannot supply row fields. */
export const recordSiteVisit = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error } = await supabaseAdmin.from("site_visits").insert({});
  if (error) throw new Error("Could not record visit.");
  return { recorded: true };
});