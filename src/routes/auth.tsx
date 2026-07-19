import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Login or Sign up — Bharat AI Sathi" },
      { name: "description", content: "Sign in or create your Bharat AI Sathi account with email or Google." },
      { property: "og:url", content: "https://bharataisathi.com/auth" },
    ],
    links: [{ rel: "canonical", href: "https://bharataisathi.com/auth" }],,
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { mode: initialMode } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"login" | "signup">(initialMode ?? "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/dashboard" });
    });
  }, [nav]);

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    nav({ to: "/dashboard" });
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        nav({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: branded panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[oklch(0.2_0.05_265)] via-background to-[oklch(0.15_0.03_265)] p-10 lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.76_0.17_55)] via-white to-[oklch(0.66_0.16_155)]">
            <Sparkles className="h-4 w-4 text-[oklch(0.18_0.03_60)]" />
          </div>
          <span className="font-display text-lg font-bold">Bharat AI Sathi</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            India's premium <br /> <span className="text-gradient-tricolor">AI companion.</span>
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Chat, create images, translate Indian languages, analyze PDFs and more —
            all in one place.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Bharat AI Sathi
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="glass-strong w-full max-w-md rounded-3xl border border-border/60 p-8 shadow-elegant">
          <div className="mb-6 flex lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.76_0.17_55)] via-white to-[oklch(0.66_0.16_155)]">
                <Sparkles className="h-4 w-4 text-[oklch(0.18_0.03_60)]" />
              </div>
              <span className="font-display font-bold">Bharat AI Sathi</span>
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to continue to your AI saathi."
              : "Join thousands using AI in Hindi and English."}
          </p>

          <Button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            variant="outline"
            className="mt-6 w-full gap-2 border-border/60 bg-background/40"
          >
            <GoogleIcon /> Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.in"
                className="mt-1 bg-background/40"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-background/40"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-primary hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.3 0-6-2.75-6-6.15S8.7 5.9 12 5.9c1.87 0 3.13.8 3.85 1.49l2.62-2.52C16.9 3.35 14.7 2.4 12 2.4 6.75 2.4 2.5 6.65 2.5 12s4.25 9.6 9.5 9.6c5.48 0 9.1-3.85 9.1-9.28 0-.62-.07-1.09-.15-1.62z"/>
      <path fill="#34A853" d="M3.83 7.55l3.2 2.35C7.86 8.03 9.75 6.9 12 6.9c1.87 0 3.13.8 3.85 1.49l2.62-2.52C16.9 4.35 14.7 3.4 12 3.4 8.06 3.4 4.72 5.65 3.83 7.55z"/>
      <path fill="#FBBC05" d="M12 21.6c2.65 0 4.88-.87 6.5-2.37l-3.1-2.55c-.85.6-2 .97-3.4.97-2.6 0-4.8-1.75-5.6-4.1l-3.24 2.5C4.7 19.35 8.06 21.6 12 21.6z"/>
      <path fill="#4285F4" d="M21.1 12.32c0-.62-.07-1.09-.15-1.62H12v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1v3.9c5.48 0 9.1-3.85 9.1-9.28z"/>
    </svg>
  );
}
