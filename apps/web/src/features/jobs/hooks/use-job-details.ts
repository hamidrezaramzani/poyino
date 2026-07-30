import { JobErrorCode, type JobDetails } from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import { ApiRequestError, fetchJob } from "../services/jobs.service";

export function useJobDetails() {
  const { t } = useI18n();
  const { push } = useToast();
  const { jobId = "" } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!jobId) {
      setNotFound(true);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setNotFound(false);
    try {
      const response = await fetchJob(jobId);
      setJob(response.job);
      setStatus("success");
    } catch (error) {
      setJob(null);
      if (
        error instanceof ApiRequestError &&
        (error.status === 404 || error.code === JobErrorCode.JOB_NOT_FOUND)
      ) {
        setNotFound(true);
      } else {
        push(
          error instanceof ApiRequestError
            ? error.message || t.jobs.details.errors.unexpected
            : t.jobs.details.errors.unexpected,
          "error",
        );
      }
      setStatus("error");
    }
  }, [jobId, push, t.jobs.details.errors.unexpected]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    jobId,
    job,
    status,
    notFound,
    retry: load,
  };
}
