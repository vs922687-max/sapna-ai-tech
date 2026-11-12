import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { onConsentChange, readChoice, saveChoices, type Purpose } from "@/lib/consent";

const OPEN_EVENT = "bas:open-cookie-prefs";
const PURPOSES: Purpose[] = ["analytics", "advertising"];

/** Opens the Cookie settings panel from anywhere (footer link, cookie policy page). */
export function openCookiePreferences() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

function hasGpc() {
  return (
    typeof navigator !== "undefined" &&
    (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true
  );
}

/** First visit (or an expired answer) shows the banner, unless the browser sends Global Privacy Control. */
function unanswered() {
  if (hasGpc()) return false;
  return PURPOSES.some((p) => readChoice(p) === null);
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState(false);
  const [gpc, setGpc] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const syncSwitches = () => {
    setAnalytics(readChoice("analytics") === "granted");
    setAdvertising(readChoice("advertising") === "granted");
  };

  useEffect(() => {
    setGpc(hasGpc());
    syncSwitches();
    if (unanswered()) setShow(true);
    const open = () => {
      setGpc(hasGpc());
      syncSwitches();
      setSettings(true);
      setShow(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    const off = onConsentChange(() => {
      syncSwitches();
      if (!unanswered()) setShow((s) => (s ? s : false));
    });
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      off();
    };
  }, []);

  useEffect(() => {
    if (show) panelRef.current?.focus();
  }, [show, settings]);

  if (!show) return null;

  const close = () => {
    setShow(false);
    setSettings(false);
  };
  const acceptAll = () => {
    saveChoices({ analytics: "granted", advertising: "granted" });
    close();
  };
  const rejectAll = () => {
    saveChoices({ analytics: "denied", advertising: "denied" });
    close();
  };
  const saveSettings = () => {
    saveChoices({
      analytics: analytics ? "granted" : "denied",
      advertising: advertising ? "granted" : "denied",
    });
    close();
  };

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="region"
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-2 bottom-2 z-[100] outline-none sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-w-md"
    >
      <div className="rounded-2xl border border-border/60 bg-card/95 p-4 shadow-elegant backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
            <Cookie className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="cookie-consent-title" className="font-display text-sm font-semibold">
              {settings ? "Cookie settings" : "Your privacy choices"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              We count visits without cookies. If you accept, we also measure clicks, and our
              advertising partner may use cookies to show and measure ads. Read our{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/cookies" className="text-primary hover:underline">
                Cookie Policy
              </Link>
              .
            </p>

            {settings && (
              <div className="mt-3 space-y-3 rounded-lg border border-border/60 bg-background/40 p-3 text-xs">
                {gpc && (
                  <p className="rounded-md bg-muted/50 p-2 text-muted-foreground">
                    Your browser's privacy signal (Global Privacy Control) is on, so analytics and
                    advertising stay off.
                  </p>
                )}
                <div>
                  <p className="font-medium text-foreground">Necessary · always on</p>
                  <p className="text-muted-foreground">Sign-in, security and remembering this choice.</p>
                </div>
                <SwitchRow
                  id="consent-analytics"
                  label="Analytics, provided by Lovable"
                  desc="Measures clicks so we can improve tools."
                  checked={!gpc && analytics}
                  disabled={gpc}
                  onChange={setAnalytics}
                />
                <SwitchRow
                  id="consent-advertising"
                  label="Advertising, provided by Google AdSense"
                  desc="Lets ads use cookies to personalise and measure ads."
                  checked={!gpc && advertising}
                  disabled={gpc}
                  onChange={setAdvertising}
                />
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" onClick={rejectAll}>
                Reject all
              </Button>
              <Button size="sm" variant="outline" onClick={acceptAll}>
                Accept all
              </Button>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              {settings ? (
                <Button size="sm" onClick={saveSettings} disabled={gpc}>
                  Save settings
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => setSettings(true)}>
                  Cookie settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwitchRow({
  id,
  label,
  desc,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <label htmlFor={id} className="flex-1">
        <span className="block font-medium text-foreground">{label}</span>
        <span className="block text-muted-foreground">{desc}</span>
      </label>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  );
}
