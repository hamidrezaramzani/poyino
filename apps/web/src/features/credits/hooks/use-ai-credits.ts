import type { AiCreditsBalance, AiCreditFeature } from "@poyino/contracts";
import { AI_ACTION_COSTS, getAiActionCost } from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useCan } from "../../../shared/permissions/can";
import { fetchAiCredits } from "../services/credits.service";

type CreditsState =
  | { status: "idle" | "loading"; credits: null; error: null }
  | { status: "success"; credits: AiCreditsBalance; error: null }
  | { status: "error"; credits: null; error: string };

export function useAiCredits() {
  const canView = useCan("credits:view");
  const [state, setState] = useState<CreditsState>({
    status: canView ? "loading" : "idle",
    credits: null,
    error: null,
  });

  const load = useCallback(async () => {
    if (!canView) {
      setState({ status: "idle", credits: null, error: null });
      return;
    }
    setState({ status: "loading", credits: null, error: null });
    try {
      const response = await fetchAiCredits();
      setState({
        status: "success",
        credits: response.credits,
        error: null,
      });
    } catch (error) {
      setState({
        status: "error",
        credits: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load AI credits.",
      });
    }
  }, [canView]);

  useEffect(() => {
    void load();
  }, [load]);

  const remaining = state.credits?.remaining ?? null;
  const exhausted = remaining === 0;
  const low = state.credits?.low ?? false;

  const canAfford = useCallback(
    (feature: AiCreditFeature) => {
      if (remaining == null) {
        return true;
      }
      return remaining >= getAiActionCost(feature);
    },
    [remaining],
  );

  return {
    ...state,
    canView,
    remaining,
    exhausted,
    low,
    costs: AI_ACTION_COSTS,
    canAfford,
    refresh: load,
  };
}
