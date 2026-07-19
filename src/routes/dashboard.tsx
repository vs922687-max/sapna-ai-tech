import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { AI_TOOLS, accentClass } from "@/lib/ai-tools";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Bharat AI Sathi" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://bharataisathi.com/dashboard" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/dashboard" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        nav({ to: "/auth" });
        return;
      }
      setUser(data.session.user);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav({ to: "/auth" });
      else setUser(session.user);
    });
    return () => sub.subscription.unsubscribe();
  }, [nav]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/" });
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const name = user?.email?.split("@")[0] ?? "there";

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="glass-strong flex flex-col justify-between gap-4 rounded-3xl border border-border/60 p-8 shadow-elegant sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Dashboard</p>
            <h1 className="mt-1 font-display text-3xl font-bold">
              नमस्ते, <span className="text-gradient-tricolor">{name}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold">Your AI tools</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AI_TOOLS.map((tool) => (
              <Link
                key={tool.slug}
                to={tool.to}
                className="group block rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-glow"
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ring-1 ${accentClass[tool.accent]}`}>
                  <tool.icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{tool.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
