import { useEffect, useState, useCallback } from "react";

const KEY = "bas:gov:bookmarks:v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("bas:gov:bookmarks"));
  } catch {
    /* ignore */
  }
}

export function useGovBookmarks() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(read());
    const sync = () => setItems(read());
    window.addEventListener("bas:gov:bookmarks", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bas:gov:bookmarks", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const cur = read();
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
    write(next);
    setItems(next);
  }, []);

  const has = useCallback((slug: string) => items.includes(slug), [items]);

  return { items, toggle, has };
}
