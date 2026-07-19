import { Link, useRouterState } from "@tanstack/react-router";
import { Landmark, Menu, Sparkles, X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon?: typeof Landmark;
  hash?: string;
  children?: { to: string; label: string }[];
};


const nav: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/tools", label: "AI Tools" },
  { to: "/tools", label: "Office Tools", hash: "office-tools" },


  {
    to: "/gov",
    label: "Government",
    icon: Landmark,
    children: [
      { to: "/gov", label: "Government Services" },
      { to: "/gov/eligibility", label: "Eligibility Checker" },
      { to: "/gov/bookmarks", label: "Saved Bookmarks" },
    ],
  },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => { setOpen(false); setOpenMenu(null); }, [pathname]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass-strong border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.76_0.17_55)] via-white to-[oklch(0.66_0.16_155)] shadow-glow">
              <Sparkles className="h-4 w-4 text-[oklch(0.18_0.03_60)]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-bold tracking-tight">
                Bharat AI Sathi
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                भारत का AI साथी
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              if (item.children) {
                const isOpen = openMenu === item.to;
                return (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => { cancelClose(); setOpenMenu(item.to); }}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      to={item.to}
                      aria-haspopup="menu"
                      aria-expanded={isOpen}
                      onFocus={() => { cancelClose(); setOpenMenu(item.to); }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                      {item.label}
                      <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
                    </Link>
                    {isOpen && (
                      <div
                        role="menu"
                        aria-label={item.label}
                        className="absolute left-0 top-full min-w-[220px] pt-2"
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <div className="glass-strong overflow-hidden rounded-xl border border-border/60 p-1 shadow-glow">
                          <div className="px-3 py-2 text-[11px] leading-snug text-muted-foreground">
                            AI help for 275+ Indian govt schemes, forms & documents.
                          </div>
                          <div className="mx-1 my-1 h-px bg-border/60" />
                          {item.children.map((c) => (
                            <Link
                              key={c.to}
                              to={c.to}
                              role="menuitem"
                              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus:bg-muted/50 focus:text-foreground focus:outline-none"
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  hash={item.hash}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );

            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <Button asChild size="sm" className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-primary to-[oklch(0.68_0.2_30)] text-primary-foreground shadow-glow hover:opacity-90">
                  <Link to="/auth" search={{ mode: "signup" }}>Get started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="rounded-lg p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border/50 md:hidden">
            <div className="space-y-1 px-4 py-3">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label}>
                    <Link
                      to={item.to}
                      hash={item.hash}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    >
                      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                      {item.label}
                    </Link>

                    {item.children && (
                      <>
                        {item.to === "/gov" && (
                          <p className="px-3 pb-1 pt-0.5 text-[11px] leading-snug text-muted-foreground">
                            AI help for 275+ Indian govt schemes, forms & documents.
                          </p>
                        )}
                        <div className="ml-6 space-y-1">
                          {item.children.map((c) => (
                            <Link
                              key={c.to}
                              to={c.to}
                              className="block rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                            >
                              {c.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
              <div className="mt-2 flex gap-2 pt-2">
                {user ? (
                  <Button asChild className="flex-1">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/auth">Login</Link>
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/auth">Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
