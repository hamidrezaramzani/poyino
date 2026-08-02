import type {
  CompleteInterviewInput,
  CreateInterviewInput,
  Interview,
  InterviewAiPreparation,
  InterviewProcess,
  InterviewResult,
  InterviewSummary,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiRequestError } from "../../../shared/api/api-client";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  cancelInterviewStage,
  completeInterviewStage,
  createInterviewStage,
  fetchInterviewProcess,
  fetchInterviewRecruiters,
  generateInterviewAi,
  generateInterviewSummary,
  submitHiringDecision,
  updateInterviewStage,
  type RecruiterOption,
} from "../services/interviews.service";

type DialogState =
  | { mode: "create" }
  | { mode: "edit"; interview: Interview }
  | null;

export function useInterviewProcess() {
  const { t } = useI18n();
  const { push } = useToast();
  const { jobId = "", candidateId = "" } = useParams<{
    jobId: string;
    candidateId: string;
  }>();

  const [process, setProcess] = useState<InterviewProcess | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [recruiters, setRecruiters] = useState<RecruiterOption[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
  const [pendingCompleteId, setPendingCompleteId] = useState<string | null>(
    null,
  );
  const [completeResult, setCompleteResult] =
    useState<InterviewResult>("PENDING");
  const [completeNotes, setCompleteNotes] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);
  const [aiStep, setAiStep] = useState(0);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>("");
  const [preparation, setPreparation] =
    useState<InterviewAiPreparation | null>(null);
  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const applyStageAi = useCallback((stage: Interview | undefined) => {
    if (!stage) {
      setPreparation(null);
      setAiPrompt("");
      return;
    }
    setPreparation(stage.aiPreparation ?? null);
    setAiPrompt(stage.aiPrompt ?? "");
  }, []);

  const load = useCallback(async () => {
    if (!jobId || !candidateId) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const [processResponse, recruitersResponse] = await Promise.all([
        fetchInterviewProcess(jobId, candidateId),
        fetchInterviewRecruiters(),
      ]);
      const nextProcess = processResponse.process;
      setProcess(nextProcess);
      setRecruiters(recruitersResponse.recruiters);
      setSummary(nextProcess.aiSummary ?? null);

      setSelectedInterviewId((current) => {
        const stillExists = nextProcess.stages.some(
          (stage) => stage.id === current,
        );
        const nextId = stillExists
          ? current
          : (nextProcess.stages[0]?.id ?? "");
        const stage = nextProcess.stages.find((item) => item.id === nextId);
        applyStageAi(stage);
        return nextId;
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [applyStageAi, candidateId, jobId]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectInterviewForAi = useCallback(
    (interviewId: string) => {
      setSelectedInterviewId(interviewId);
      setAiError(false);
      const stage = process?.stages.find((item) => item.id === interviewId);
      applyStageAi(stage);
    },
    [applyStageAi, process?.stages],
  );

  const saveStage = useCallback(
    async (input: CreateInterviewInput) => {
      if (!jobId || !candidateId || !dialog || saving) return;
      setSaving(true);
      try {
        if (dialog.mode === "create") {
          const response = await createInterviewStage(
            jobId,
            candidateId,
            input,
          );
          if (response.conflict) {
            push(t.candidates.interview.form.conflictWarning, "info");
          }
          push(t.candidates.interview.toasts.created, "success");
        } else {
          const response = await updateInterviewStage(
            jobId,
            candidateId,
            dialog.interview.id,
            input,
          );
          if (response.conflict) {
            push(t.candidates.interview.form.conflictWarning, "info");
          }
          push(t.candidates.interview.toasts.updated, "success");
        }
        setDialog(null);
        await load();
      } catch (error) {
        push(
          error instanceof ApiRequestError
            ? error.message || t.candidates.interview.errors.unexpected
            : t.candidates.interview.errors.unexpected,
          "error",
        );
      } finally {
        setSaving(false);
      }
    },
    [candidateId, dialog, jobId, load, push, saving, t.candidates.interview],
  );

  const confirmCancel = useCallback(async () => {
    if (!pendingCancelId || !jobId || !candidateId) return;
    setActionLoading(true);
    try {
      await cancelInterviewStage(jobId, candidateId, pendingCancelId);
      push(t.candidates.interview.toasts.cancelled, "success");
      setPendingCancelId(null);
      await load();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.interview.errors.unexpected
          : t.candidates.interview.errors.unexpected,
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  }, [
    candidateId,
    jobId,
    load,
    pendingCancelId,
    push,
    t.candidates.interview,
  ]);

  const confirmComplete = useCallback(async () => {
    if (!pendingCompleteId || !jobId || !candidateId) return;
    setActionLoading(true);
    try {
      const input: CompleteInterviewInput = {
        result: completeResult,
        internalNotes: completeNotes.trim() || null,
      };
      await completeInterviewStage(
        jobId,
        candidateId,
        pendingCompleteId,
        input,
      );
      push(t.candidates.interview.toasts.completed, "success");
      setPendingCompleteId(null);
      setCompleteNotes("");
      await load();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.interview.errors.unexpected
          : t.candidates.interview.errors.unexpected,
        "error",
      );
    } finally {
      setActionLoading(false);
    }
  }, [
    candidateId,
    completeNotes,
    completeResult,
    jobId,
    load,
    pendingCompleteId,
    push,
    t.candidates.interview,
  ]);

  const decide = useCallback(
    async (decision: "HIRE" | "REJECT") => {
      if (!jobId || !candidateId || actionLoading) return;
      setActionLoading(true);
      try {
        const response = await submitHiringDecision(jobId, candidateId, {
          decision,
        });
        setProcess(response.process);
        push(
          decision === "HIRE"
            ? t.candidates.interview.toasts.hired
            : t.candidates.interview.toasts.rejected,
          "success",
        );
      } catch (error) {
        push(
          error instanceof ApiRequestError
            ? error.message || t.candidates.interview.errors.unexpected
            : t.candidates.interview.errors.unexpected,
          "error",
        );
      } finally {
        setActionLoading(false);
      }
    },
    [actionLoading, candidateId, jobId, push, t.candidates.interview],
  );

  const runAi = useCallback(async () => {
    if (!jobId || !candidateId || !selectedInterviewId || aiLoading) return;
    setAiLoading(true);
    setAiError(false);
    setAiStep(0);
    const timers = [
      window.setTimeout(() => setAiStep(1), 800),
      window.setTimeout(() => setAiStep(2), 1600),
    ];
    try {
      const response = await generateInterviewAi(jobId, candidateId, {
        interviewId: selectedInterviewId,
        prompt: aiPrompt.trim() || undefined,
      });
      setPreparation(response.preparation);
      setAiPrompt(response.aiPrompt ?? "");
      setProcess((current) => {
        if (!current) return current;
        return {
          ...current,
          stages: current.stages.map((stage) =>
            stage.id === selectedInterviewId
              ? {
                  ...stage,
                  aiPreparation: response.preparation,
                  aiPrompt: response.aiPrompt,
                  aiGeneratedAt: response.aiGeneratedAt,
                }
              : stage,
          ),
        };
      });
    } catch {
      setAiError(true);
    } finally {
      timers.forEach((id) => window.clearTimeout(id));
      setAiLoading(false);
      setAiStep(0);
    }
  }, [aiLoading, aiPrompt, candidateId, jobId, selectedInterviewId]);

  const runSummary = useCallback(async () => {
    if (!jobId || !candidateId || summaryLoading) return;
    setSummaryLoading(true);
    setSummaryError(false);
    try {
      const response = await generateInterviewSummary(jobId, candidateId);
      setSummary(response.summary);
      setProcess((current) =>
        current
          ? {
              ...current,
              aiSummary: response.summary,
              aiSummaryGeneratedAt: response.aiSummaryGeneratedAt,
            }
          : current,
      );
    } catch (error) {
      setSummaryError(true);
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.interviewsModule.summary.failed
          : t.candidates.interviewsModule.summary.failed,
        "error",
      );
    } finally {
      setSummaryLoading(false);
    }
  }, [
    candidateId,
    jobId,
    push,
    summaryLoading,
    t.candidates.interviewsModule.summary.failed,
  ]);

  return {
    jobId,
    candidateId,
    process,
    status,
    recruiters,
    retry: load,
    dialog,
    openCreate: () => setDialog({ mode: "create" }),
    openEdit: (interview: Interview) => setDialog({ mode: "edit", interview }),
    closeDialog: () => {
      if (!saving) setDialog(null);
    },
    saveStage,
    saving,
    pendingCancelId,
    requestCancel: setPendingCancelId,
    dismissCancel: () => {
      if (!actionLoading) setPendingCancelId(null);
    },
    confirmCancel,
    pendingCompleteId,
    requestComplete: (id: string) => {
      setCompleteResult("PENDING");
      setCompleteNotes("");
      setPendingCompleteId(id);
    },
    dismissComplete: () => {
      if (!actionLoading) setPendingCompleteId(null);
    },
    confirmComplete,
    completeResult,
    setCompleteResult,
    completeNotes,
    setCompleteNotes,
    actionLoading,
    decide,
    aiPrompt,
    setAiPrompt,
    aiLoading,
    aiError,
    aiStep,
    preparation,
    selectedInterviewId,
    selectInterviewForAi,
    runAi,
    summary,
    summaryLoading,
    summaryError,
    runSummary,
  };
}
