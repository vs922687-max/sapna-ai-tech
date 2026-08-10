import { useCallback, useEffect, useState } from "react";
import {
  emptyProject,
  loadActiveProject,
  setActiveProjectId,
  upsertProject,
  type CreatorProject,
} from "@/lib/creator-studio";

/**
 * Active Creator Studio project — shared brief + generated outputs across tools,
 * persisted in localStorage so the user never re-enters the same information.
 */
export function useCreatorProject() {
  const [project, setProject] = useState<CreatorProject>(() => emptyProject());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const existing = loadActiveProject();
    if (existing) setProject(existing);
    setHydrated(true);
  }, []);

  const patch = useCallback((updates: Partial<CreatorProject>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  }, []);

  const setOutput = useCallback((key: string, value: string) => {
    setProject((prev) => ({ ...prev, outputs: { ...prev.outputs, [key]: value } }));
  }, []);

  const save = useCallback(() => {
    setProject((prev) => {
      const next = { ...prev, updatedAt: Date.now() };
      upsertProject(next);
      setActiveProjectId(next.id);
      return next;
    });
  }, []);

  return { project, hydrated, patch, setOutput, save, setProject };
}
