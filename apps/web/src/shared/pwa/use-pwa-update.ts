import { useEffect, useState } from "react";
import { getPwaUpdateState, subscribeToPwaUpdate } from "./register-pwa";

export function usePwaUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(
    () => getPwaUpdateState().updateAvailable,
  );

  useEffect(() => {
    return subscribeToPwaUpdate(() => {
      setUpdateAvailable(getPwaUpdateState().updateAvailable);
    });
  }, []);

  function applyUpdate() {
    getPwaUpdateState().applyUpdate?.();
  }

  return {
    updateAvailable,
    applyUpdate,
  };
}
