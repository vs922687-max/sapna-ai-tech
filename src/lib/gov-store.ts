// Generic localStorage-backed store hook — used by profile, applications,
// downloads, reminders, form drafts. No backend schema changes needed.
import { useCallback, useEffect, useState } from "react";

const PREFIX = "bas:gov:v1:";

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`bas:store:${key}`));
  } catch {
    /* quota / private mode */
  }
}

export function useGovStore<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    setValue(safeGet<T>(key, initial));
    const sync = () => setValue(safeGet<T>(key, initial));
    window.addEventListener(`bas:store:${key}`, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(`bas:store:${key}`, sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        safeSet(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}

export function readGovStore<T>(key: string, fallback: T): T {
  return safeGet(key, fallback);
}
export function writeGovStore<T>(key: string, value: T) {
  safeSet(key, value);
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
