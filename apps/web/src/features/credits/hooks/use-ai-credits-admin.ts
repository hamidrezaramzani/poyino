import type {
  AiCreditBreakdownItem,
  AiCreditUsageItem,
  AiCreditsBalance,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import {
  fetchAiCreditBreakdown,
  fetchAiCreditHistory,
} from "../services/credits.service";

type AdminState = {
  status: "loading" | "success" | "error";
  credits: AiCreditsBalance | null;
  items: AiCreditUsageItem[];
  breakdown: AiCreditBreakdownItem[];
  page: number;
  totalPages: number;
  error: string | null;
};

export function useAiCreditsAdmin() {
  const [state, setState] = useState<AdminState>({
    status: "loading",
    credits: null,
    items: [],
    breakdown: [],
    page: 1,
    totalPages: 0,
    error: null,
  });

  const load = useCallback(async (page = 1) => {
    setState((current) => ({
      ...current,
      status: "loading",
      error: null,
      page,
    }));
    try {
      const [history, breakdown] = await Promise.all([
        fetchAiCreditHistory({ page, pageSize: 20 }),
        fetchAiCreditBreakdown(),
      ]);
      setState({
        status: "success",
        credits: history.credits,
        items: history.items,
        breakdown: breakdown.breakdown,
        page: history.pagination.page,
        totalPages: history.pagination.totalPages,
        error: null,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Failed to load AI credit history.",
      }));
    }
  }, []);

  useEffect(() => {
    void load(1);
  }, [load]);

  return {
    ...state,
    retry: () => void load(state.page || 1),
    goToPage: (page: number) => void load(page),
  };
}
