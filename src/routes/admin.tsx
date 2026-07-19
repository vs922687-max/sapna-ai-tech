import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/site-header";
import { Users, MessagesSquare, TrendingUp, Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Bharat AI Sathi" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://bharataisathi.com/admin" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/admin" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) { nav({ to: "/auth" }); return; }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: sess.session.user.id,
        _role: "admin",
      });
      if (error || !data) { nav({ to: "/" }); return; }
      setLoading(false);
    })();
  }, [nav]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    { label: "Total users", value: "12,483", icon: Users, delta: "+18%" },
    { label: "Conversations", value: "184,922", icon: MessagesSquare, delta: "+24%" },
    { label: "Monthly revenue", value: "₹8.4L", icon: TrendingUp, delta: "+31%" },
  ];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Admin</p>
            <h1 className="font-display text-3xl font-bold">Overview</h1>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="glass-strong rounded-2xl border border-border/60 p-6">
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-[oklch(0.72_0.16_155)]">{s.delta}</span>
              </div>
              <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 glass rounded-2xl border border-border/60 p-8 text-center text-sm text-muted-foreground">
          Full analytics, user management, and CMS coming in the next iteration.
        </div>
      </section>
    </div>
  );
}
