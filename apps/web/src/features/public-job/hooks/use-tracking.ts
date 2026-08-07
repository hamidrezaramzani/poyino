import type { TrackingInfo, PublicInterview } from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { ApiRequestError } from "../../../shared/api/api-client";
import { getTracking } from "../services/public-job.service";

type Status = "loading" | "ready" | "not_found" | "error";

export function useTracking(token: string | undefined) {
  const [status, setStatus] = useState<Status>("loading");
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);

  const load = useCallback(async () => {
    if (!token) {
      setStatus("not_found");
      setTracking(null);
      return;
    }

    setStatus("loading");
    try {
      const response = await getTracking(token);
      setTracking(response.tracking);
      setStatus("ready");
    } catch (error) {
      setTracking(null);
      if (error instanceof ApiRequestError && error.status === 404) {
        setStatus("not_found");
        return;
      }
      setStatus("error");
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateInterview = useCallback((interview: PublicInterview) => {
    setTracking((current) => {
      if (!current) return current;
      return {
        ...current,
        interviews: current.interviews.map((item) =>
          item.id === interview.id ? interview : item,
        ),
      };
    });
  }, []);

  return { status, tracking, retry: load, updateInterview };
}
