import type { PublicJob } from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { ApiRequestError } from "../../../shared/api/api-client";
import { getPublicJob } from "../services/public-job.service";

type Status = "loading" | "ready" | "not_found" | "error";

export function usePublicJob(orgSlug: string | undefined, jobId: string | undefined) {
  const [status, setStatus] = useState<Status>("loading");
  const [job, setJob] = useState<PublicJob | null>(null);

  const load = useCallback(async () => {
    if (!orgSlug || !jobId) {
      setStatus("not_found");
      setJob(null);
      return;
    }

    setStatus("loading");
    try {
      const response = await getPublicJob(orgSlug, jobId);
      setJob(response.job);
      setStatus("ready");
    } catch (error) {
      setJob(null);
      if (error instanceof ApiRequestError && error.status === 404) {
        setStatus("not_found");
        return;
      }
      setStatus("error");
    }
  }, [jobId, orgSlug]);

  useEffect(() => {
    void load();
  }, [load]);

  return { status, job, retry: load };
}
