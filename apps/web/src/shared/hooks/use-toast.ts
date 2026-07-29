import { useCallback } from "react";
import { toast } from "sonner";

type ToastVariant = "success" | "error" | "info";

export function useToast() {
  const push = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      if (variant === "success") {
        toast.success(message);
        return;
      }

      if (variant === "error") {
        toast.error(message);
        return;
      }

      toast(message);
    },
    [],
  );

  return { push };
}
