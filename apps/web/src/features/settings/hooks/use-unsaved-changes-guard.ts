import { useCallback, useEffect, useState } from "react";
import { useBlocker } from "react-router-dom";

export function useUnsavedChangesGuard(isDirty: boolean) {
  const blocker = useBlocker(isDirty);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setDialogOpen(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const confirmLeave = useCallback(() => {
    setDialogOpen(false);
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  }, [blocker]);

  const cancelLeave = useCallback(() => {
    setDialogOpen(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker]);

  return {
    dialogOpen,
    confirmLeave,
    cancelLeave,
  };
}

export function areValuesEqual<T extends Record<string, unknown>>(
  left: T,
  right: T,
) {
  return JSON.stringify(left) === JSON.stringify(right);
}
