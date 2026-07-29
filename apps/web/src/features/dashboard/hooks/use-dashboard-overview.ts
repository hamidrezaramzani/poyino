import type { DashboardSuccess } from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { fetchDashboardOverview } from "../services/dashboard.service";

type DashboardState =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: DashboardSuccess; error: null }
  | { status: "error"; data: null; error: string };

export function useDashboardOverview() {
  const [state, setState] = useState<DashboardState>({
    status: "loading",
    data: null,
    error: null,
  });

  const load = useCallback(async () => {
    setState({ status: "loading", data: null, error: null });
    try {
      const data = await fetchDashboardOverview();
      setState({ status: "success", data, error: null });
    } catch (error) {
      setState({
        status: "error",
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data.",
      });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    ...state,
    retry: load,
  };
}
