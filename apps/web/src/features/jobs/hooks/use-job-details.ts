import { JobErrorCode, type JobDetails } from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  deleteJob,
  fetchJob,
  publishJob,
  unpublishJob,
} from "../services/jobs.service";

type ActionKind = "publish" | "unpublish" | "delete" | null;

export function useJobDetails() {
  const { t } = useI18n();
  const { push } = useToast();
  const navigate = useNavigate();
  const { jobId = "" } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [notFound, setNotFound] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionKind>(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  const requestAction = useCallback((action: Exclude<ActionKind, null>) => {
    setPendingAction(action);
  }, []);

  const cancelAction = useCallback(() => {
    if (actionLoading) {
      return;
    }
    setPendingAction(null);
  }, [actionLoading]);

  const confirmAction = useCallback(async () => {
    if (!jobId || !pendingAction) {
      return;
    }

    setActionLoading(true);
    try {
      if (pendingAction === "publish") {
        const response = await publishJob(jobId);
        setJob((current) =>
          current
            ? {
                ...current,
                status: response.status,
                publicUrl: response.publicUrl,
                publishedAt: current.publishedAt ?? new Date().toISOString(),
                isExpired: false,
              }
            : current,
        );
        push(t.jobs.details.publish.successToast, "success");
      } else if (pendingAction === "unpublish") {
        const response = await unpublishJob(jobId);
        setJob((current) =>
          current
            ? {
                ...current,
                status: response.status,
                publicUrl: null,
                isExpired: false,
              }
            : current,
        );
        push(t.jobs.details.unpublish.successToast, "success");
      } else {
        await deleteJob(jobId);
        push(t.jobs.details.delete.successToast, "success");
        navigate("/jobs");
        return;
      }
      setPendingAction(null);
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        error.code === JobErrorCode.JOB_HAS_CANDIDATES
      ) {
        push(t.jobs.details.delete.hasCandidates, "error");
      } else if (
        error instanceof ApiRequestError &&
        error.code === JobErrorCode.JOB_NOT_PUBLISHABLE
      ) {
        push(t.jobs.details.publish.notPublishable, "error");
      } else {
        push(
          error instanceof ApiRequestError
            ? error.message || t.jobs.details.errors.unexpected
            : t.jobs.details.errors.unexpected,
          "error",
        );
      }
    } finally {
      setActionLoading(false);
    }
  }, [
    jobId,
    navigate,
    pendingAction,
    push,
    t.jobs.details.delete.hasCandidates,
    t.jobs.details.delete.successToast,
    t.jobs.details.errors.unexpected,
    t.jobs.details.publish.notPublishable,
    t.jobs.details.publish.successToast,
    t.jobs.details.unpublish.successToast,
  ]);

  return {
    jobId,
    job,
    status,
    notFound,
    retry: load,
    pendingAction,
    actionLoading,
    requestAction,
    cancelAction,
    confirmAction,
  };
}
