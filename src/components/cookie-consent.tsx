import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "bas-cookie-consent-v1";
const OPEN_EVENT = "bas:open-cookie-prefs";

type Consent = {
  essential: true;
  analytics: boolean;
  preferences: boolean;
  decidedAt: string;
};

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

function writeConsent(c: Consent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {
    /* ignore */
  }
}

export function openCookiePreferences() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  }
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    setMounted(true);
    const existing = readConsent();
    if (!existing) setShow(true);
    else {
      setAnalytics(existing.analytics);
      setPreferences(existing.preferences);
    }
    const open = () => {
      const c = readConsent();
      if (c) {
        setAnalytics(c.analytics);
        setPreferences(c.preferences);
      }
      setManage(true);
      setShow(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (!mounted || !show) return null;

  const save = (a: boolean, p: boolean) => {
    writeConsent({
      essential: true,
      analytics: a,
      preferences: p,
      decidedAt: new Date().toISOString(),
    });
    setShow(false);
    setManage(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-2 bottom-2 z-[100] sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md"
    >
      <div className="rounded-2xl border border-border/60 bg-card/95 p-4 shadow-elegant backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <Cookie className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 id="cookie-consent-title" className="font-display text-sm font-semibold">
                {manage ? "Cookie preferences" : "We use cookies"}
              </h2>
              <button
                type="button"
                aria-label="Close cookie banner"
                onClick={() => setShow(false)}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              We use essential cookies to run the site and optional cookies for analytics and
              preferences. Read our{" "}
              <Link to="/cookies" className="text-primary hover:underline">
                Cookie Policy
              </Link>
              .
            </p>

            {manage && (
              <div className="mt-3 space-y-2 rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
                <Row label="Essential" desc="Required for sign-in and security." checked disabled />
                <Row
                  label="Analytics"
                  desc="Helps us improve the platform."
                  checked={analytics}
                  onChange={setAnalytics}
                />
                <Row
                  label="Preferences"
                  desc="Remember language, theme and settings."
                  checked={preferences}
                  onChange={setPreferences}
                />
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-2">
              {!manage && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setManage(true)}
                  aria-label="Manage cookie preferences"
                >
                  Manage
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => save(false, false)}
                aria-label="Reject non-essential cookies"
              >
                Reject
              </Button>
              {manage ? (
                <Button size="sm" onClick={() => save(analytics, preferences)} aria-label="Save cookie preferences">
                  Save preferences
                </Button>
              ) : (
                <Button size="sm" onClick={() => save(true, true)} aria-label="Accept all cookies">
                  Accept
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-2">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-primary"
        aria-label={label}
      />
      <span className="flex-1">
        <span className="block font-medium text-foreground">{label}</span>
        <span className="block text-muted-foreground">{desc}</span>
      </span>
    </label>
  );
}
