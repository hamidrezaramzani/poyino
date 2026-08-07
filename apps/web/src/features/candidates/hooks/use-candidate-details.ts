import {
  CandidateErrorCode,
  type CandidateNote,
  type CandidateProfile,
  type CompleteInterviewInput,
  type CreateInterviewInput,
  type DashboardCandidateStatus,
  type Interview,
  type UpdateInterviewInput,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  ApiRequestError,
  cancelInterview,
  completeInterview,
  createCandidateNote,
  createInterview,
  deleteCandidateNote,
  fetchCandidateProfile,
  getResumeDownloadUrl,
  rerunCandidateAiAnalysis,
  updateCandidateNote,
  updateCandidateStatus,
  updateInterview,
} from "../services/candidates.service";

type InterviewDialogState =
  | { mode: "create" }
  | { mode: "edit"; interview: Interview }
  | null;

export function useCandidateDetails() {
  const { t } = useI18n();
  const { push } = useToast();
  const { jobId = "", candidateId = "" } = useParams<{
    jobId: string;
    candidateId: string;
  }>();

  const [job, setJob] = useState<{ id: string; title: string } | null>(null);
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [notFound, setNotFound] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const [noteDraft, setNoteDraft] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteBody, setEditingNoteBody] = useState("");
  const [noteActionLoading, setNoteActionLoading] = useState(false);
  const [pendingDeleteNoteId, setPendingDeleteNoteId] = useState<string | null>(
    null,
  );

  const [interviewDialog, setInterviewDialog] =
    useState<InterviewDialogState>(null);
  const [interviewSaving, setInterviewSaving] = useState(false);
  const [pendingCancelInterviewId, setPendingCancelInterviewId] = useState<
    string | null
  >(null);
  const [pendingCompleteInterviewId, setPendingCompleteInterviewId] =
    useState<string | null>(null);
  const [completeNotes, setCompleteNotes] = useState("");
  const [interviewActionLoading, setInterviewActionLoading] = useState(false);
  const [aiRerunLoading, setAiRerunLoading] = useState(false);

  const load = useCallback(async () => {
    if (!jobId || !candidateId) {
      setNotFound(true);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setNotFound(false);
    try {
      const response = await fetchCandidateProfile(jobId, candidateId);
      setJob(response.job);
      setCandidate(response.candidate);
      setStatus("success");
    } catch (error) {
      setCandidate(null);
      if (
        error instanceof ApiRequestError &&
        (error.status === 404 ||
          error.code === CandidateErrorCode.CANDIDATE_NOT_FOUND ||
          error.code === CandidateErrorCode.JOB_NOT_FOUND)
      ) {
        setNotFound(true);
      } else {
        push(
          error instanceof ApiRequestError
            ? error.message || t.candidates.details.errors.unexpected
            : t.candidates.details.errors.unexpected,
          "error",
        );
      }
      setStatus("error");
    }
  }, [candidateId, jobId, push, t.candidates.details.errors.unexpected]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    if (!jobId || !candidateId) {
      return;
    }
    try {
      const response = await fetchCandidateProfile(jobId, candidateId);
      setJob(response.job);
      setCandidate(response.candidate);
    } catch {
      // Keep previously loaded data; the next explicit action will surface errors.
    }
  }, [candidateId, jobId]);

  // While AI ranking is still running, silently refresh until it completes.
  useEffect(() => {
    if (status !== "success" || candidate?.aiAnalysisStatus !== "PENDING") {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refresh();
    }, 4_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [candidate?.aiAnalysisStatus, refresh, status]);

  const rerunAiAnalysis = useCallback(async () => {
    if (!jobId || !candidateId || aiRerunLoading) {
      return;
    }
    setAiRerunLoading(true);
    setCandidate((current) =>
      current
        ? {
            ...current,
            aiAnalysisStatus: "PENDING",
            aiScore: null,
            jobMatchAnalysis: null,
          }
        : current,
    );
    try {
      const response = await rerunCandidateAiAnalysis(jobId, candidateId);
      setCandidate((current) =>
        current
          ? {
              ...current,
              aiScore: response.aiScore,
              yearsExperience: response.yearsExperience,
              jobMatchAnalysis: response.jobMatchAnalysis,
              aiAnalysisStatus: response.aiAnalysisStatus,
            }
          : current,
      );
      push(t.candidates.details.ai.rerunSuccess, "success");
      void refresh();
    } catch (error) {
      setCandidate((current) =>
        current
          ? {
              ...current,
              aiAnalysisStatus: "UNAVAILABLE",
            }
          : current,
      );
      if (
        error instanceof ApiRequestError &&
        error.code === CandidateErrorCode.INSUFFICIENT_CREDITS
      ) {
        push(t.credits.insufficientError, "error");
      } else {
        push(
          error instanceof ApiRequestError
            ? error.message || t.candidates.details.ai.rerunFailed
            : t.candidates.details.ai.rerunFailed,
          "error",
        );
      }
    } finally {
      setAiRerunLoading(false);
    }
  }, [
    aiRerunLoading,
    candidateId,
    jobId,
    push,
    refresh,
    t.candidates.details.ai.rerunFailed,
    t.candidates.details.ai.rerunSuccess,
    t.credits.insufficientError,
  ]);

  const changeStatus = useCallback(
    async (nextStatus: DashboardCandidateStatus) => {
      if (!jobId || !candidateId || statusUpdating) {
        return;
      }
      setStatusUpdating(true);
      try {
        const response = await updateCandidateStatus(jobId, candidateId, {
          status: nextStatus,
        });
        setCandidate((current) =>
          current ? { ...current, status: response.status } : current,
        );
        push(t.candidates.details.statusUpdated, "success");
        void refresh();
      } catch (error) {
        push(
          error instanceof ApiRequestError
            ? error.message || t.candidates.details.errors.unexpected
            : t.candidates.details.errors.unexpected,
          "error",
        );
      } finally {
        setStatusUpdating(false);
      }
    },
    [candidateId, jobId, push, refresh, statusUpdating, t.candidates.details],
  );

  // Prefer the authenticated API resume endpoint so the browser receives
  // Content-Disposition: inline and the PDF previews instead of downloading.
  // S3 signed URLs often force attachment downloads when used as iframe src.
  const resumeDownloadUrl =
    jobId && candidateId ? getResumeDownloadUrl(jobId, candidateId) : "";

  const addNote = useCallback(async () => {
    const body = noteDraft.trim();
    if (!body || !jobId || !candidateId || addingNote) {
      return;
    }
    setAddingNote(true);
    try {
      const response = await createCandidateNote(jobId, candidateId, { body });
      setCandidate((current) =>
        current
          ? { ...current, notes: [response.note, ...current.notes] }
          : current,
      );
      setNoteDraft("");
      void refresh();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.details.errors.unexpected
          : t.candidates.details.errors.unexpected,
        "error",
      );
    } finally {
      setAddingNote(false);
    }
  }, [addingNote, candidateId, jobId, noteDraft, push, refresh, t.candidates.details.errors.unexpected]);

  const startEditNote = useCallback((note: CandidateNote) => {
    setEditingNoteId(note.id);
    setEditingNoteBody(note.body);
  }, []);

  const cancelEditNote = useCallback(() => {
    setEditingNoteId(null);
    setEditingNoteBody("");
  }, []);

  const saveEditNote = useCallback(async () => {
    const body = editingNoteBody.trim();
    if (!editingNoteId || !body || !jobId || !candidateId || noteActionLoading) {
      return;
    }
    setNoteActionLoading(true);
    try {
      const response = await updateCandidateNote(
        jobId,
        candidateId,
        editingNoteId,
        { body },
      );
      setCandidate((current) =>
        current
          ? {
              ...current,
              notes: current.notes.map((note) =>
                note.id === response.note.id ? response.note : note,
              ),
            }
          : current,
      );
      setEditingNoteId(null);
      setEditingNoteBody("");
      void refresh();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.details.errors.unexpected
          : t.candidates.details.errors.unexpected,
        "error",
      );
    } finally {
      setNoteActionLoading(false);
    }
  }, [candidateId, editingNoteBody, editingNoteId, jobId, noteActionLoading, push, refresh, t.candidates.details.errors.unexpected]);

  const requestDeleteNote = useCallback((noteId: string) => {
    setPendingDeleteNoteId(noteId);
  }, []);

  const cancelDeleteNote = useCallback(() => {
    if (noteActionLoading) {
      return;
    }
    setPendingDeleteNoteId(null);
  }, [noteActionLoading]);

  const confirmDeleteNote = useCallback(async () => {
    if (!pendingDeleteNoteId || !jobId || !candidateId) {
      return;
    }
    setNoteActionLoading(true);
    try {
      await deleteCandidateNote(jobId, candidateId, pendingDeleteNoteId);
      setCandidate((current) =>
        current
          ? {
              ...current,
              notes: current.notes.filter(
                (note) => note.id !== pendingDeleteNoteId,
              ),
            }
          : current,
      );
      setPendingDeleteNoteId(null);
      void refresh();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.details.errors.unexpected
          : t.candidates.details.errors.unexpected,
        "error",
      );
    } finally {
      setNoteActionLoading(false);
    }
  }, [candidateId, jobId, pendingDeleteNoteId, push, refresh, t.candidates.details.errors.unexpected]);

  const openCreateInterview = useCallback(() => {
    setInterviewDialog({ mode: "create" });
  }, []);

  const openEditInterview = useCallback((interview: Interview) => {
    setInterviewDialog({ mode: "edit", interview });
  }, []);

  const closeInterviewDialog = useCallback(() => {
    if (interviewSaving) {
      return;
    }
    setInterviewDialog(null);
  }, [interviewSaving]);

  const saveInterview = useCallback(
    async (input: CreateInterviewInput | UpdateInterviewInput) => {
      if (!jobId || !candidateId || !interviewDialog || interviewSaving) {
        return;
      }
      setInterviewSaving(true);
      try {
        if (interviewDialog.mode === "create") {
          const response = await createInterview(jobId, candidateId, input);
          if (response.conflict) {
            push(t.candidates.interview.form.conflictWarning, "info");
          }
          setCandidate((current) =>
            current
              ? { ...current, interviews: [response.interview, ...current.interviews] }
              : current,
          );
          push(t.candidates.interview.toasts.created, "success");
        } else {
          const response = await updateInterview(
            jobId,
            candidateId,
            interviewDialog.interview.id,
            input,
          );
          if (response.conflict) {
            push(t.candidates.interview.form.conflictWarning, "info");
          }
          setCandidate((current) =>
            current
              ? {
                  ...current,
                  interviews: current.interviews.map((item) =>
                    item.id === response.interview.id ? response.interview : item,
                  ),
                }
              : current,
          );
          push(t.candidates.interview.toasts.updated, "success");
        }
        setInterviewDialog(null);
        void refresh();
      } catch (error) {
        push(
          error instanceof ApiRequestError
            ? error.message || t.candidates.interview.errors.unexpected
            : t.candidates.interview.errors.unexpected,
          "error",
        );
      } finally {
        setInterviewSaving(false);
      }
    },
    [candidateId, interviewDialog, interviewSaving, jobId, push, refresh, t.candidates.interview],
  );

  const requestCancelInterview = useCallback((interviewId: string) => {
    setPendingCancelInterviewId(interviewId);
  }, []);

  const dismissCancelInterview = useCallback(() => {
    if (interviewActionLoading) {
      return;
    }
    setPendingCancelInterviewId(null);
  }, [interviewActionLoading]);

  const confirmCancelInterview = useCallback(async () => {
    if (!pendingCancelInterviewId || !jobId || !candidateId) {
      return;
    }
    setInterviewActionLoading(true);
    try {
      const response = await cancelInterview(
        jobId,
        candidateId,
        pendingCancelInterviewId,
      );
      setCandidate((current) =>
        current
          ? {
              ...current,
              interviews: current.interviews.map((item) =>
                item.id === response.interview.id ? response.interview : item,
              ),
            }
          : current,
      );
      push(t.candidates.interview.toasts.cancelled, "success");
      setPendingCancelInterviewId(null);
      void refresh();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.interview.errors.unexpected
          : t.candidates.interview.errors.unexpected,
        "error",
      );
    } finally {
      setInterviewActionLoading(false);
    }
  }, [candidateId, jobId, pendingCancelInterviewId, push, refresh, t.candidates.interview]);

  const requestCompleteInterview = useCallback((interviewId: string) => {
    setCompleteNotes("");
    setPendingCompleteInterviewId(interviewId);
  }, []);

  const dismissCompleteInterview = useCallback(() => {
    if (interviewActionLoading) {
      return;
    }
    setPendingCompleteInterviewId(null);
  }, [interviewActionLoading]);

  const confirmCompleteInterview = useCallback(async () => {
    if (!pendingCompleteInterviewId || !jobId || !candidateId) {
      return;
    }
    setInterviewActionLoading(true);
    try {
      const input: CompleteInterviewInput = {
        internalNotes: completeNotes.trim() || null,
      };
      const response = await completeInterview(
        jobId,
        candidateId,
        pendingCompleteInterviewId,
        input,
      );
      setCandidate((current) =>
        current
          ? {
              ...current,
              interviews: current.interviews.map((item) =>
                item.id === response.interview.id ? response.interview : item,
              ),
            }
          : current,
      );
      push(t.candidates.interview.toasts.completed, "success");
      setPendingCompleteInterviewId(null);
      void refresh();
    } catch (error) {
      push(
        error instanceof ApiRequestError
          ? error.message || t.candidates.interview.errors.unexpected
          : t.candidates.interview.errors.unexpected,
        "error",
      );
    } finally {
      setInterviewActionLoading(false);
    }
  }, [candidateId, completeNotes, jobId, pendingCompleteInterviewId, push, refresh, t.candidates.interview]);

  return {
    jobId,
    candidateId,
    job,
    candidate,
    status,
    notFound,
    retry: load,
    statusUpdating,
    changeStatus,
    resumeDownloadUrl,
    noteDraft,
    setNoteDraft,
    addingNote,
    addNote,
    editingNoteId,
    editingNoteBody,
    setEditingNoteBody,
    startEditNote,
    cancelEditNote,
    saveEditNote,
    noteActionLoading,
    pendingDeleteNoteId,
    requestDeleteNote,
    cancelDeleteNote,
    confirmDeleteNote,
    interviewDialog,
    interviewSaving,
    openCreateInterview,
    openEditInterview,
    closeInterviewDialog,
    saveInterview,
    pendingCancelInterviewId,
    requestCancelInterview,
    dismissCancelInterview,
    confirmCancelInterview,
    pendingCompleteInterviewId,
    completeNotes,
    setCompleteNotes,
    requestCompleteInterview,
    dismissCompleteInterview,
    confirmCompleteInterview,
    interviewActionLoading,
    aiRerunLoading,
    rerunAiAnalysis,
  };
}
