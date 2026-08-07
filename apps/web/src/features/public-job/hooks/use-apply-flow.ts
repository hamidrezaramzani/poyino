import {
  SubmitApplicationSchema,
  type ResumeAnalysis,
  type SubmitApplicationInput,
} from "@poyino/contracts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiRequestError } from "../../../shared/api/api-client";
import { useToast } from "../../../shared/hooks/use-toast";
import { useI18n } from "../../../shared/i18n/i18n-provider";
import {
  analyzeResume,
  fileToBase64,
  submitApplication,
  uploadResume,
} from "../services/public-job.service";
import { resolveResumeMimeType } from "../utils/resume-file";

export type ApplySuccessState = {
  trackingToken: string;
  trackingUrl: string;
  jobTitle: string;
  organizationName: string;
  submittedAt: string;
};

type Step = "upload" | "processing" | "review";
type ProcessingPhase = "extracting" | "analyzing";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  currentPosition: string;
  skillsText: string;
  experience: string;
  education: string;
  linkedin: string;
  portfolio: string;
  website: string;
};

const emptyForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  currentPosition: "",
  skillsText: "",
  experience: "",
  education: "",
  linkedin: "",
  portfolio: "",
  website: "",
};

export function useApplyFlow(orgSlug: string | undefined, jobId: string | undefined) {
  const { t } = useI18n();
  const { push } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("upload");
  const [processingPhase, setProcessingPhase] =
    useState<ProcessingPhase>("extracting");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisWarning, setAnalysisWarning] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<ResumeAnalysis | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (uploadProgress != null || step === "processing" || submitting) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [step, submitting, uploadProgress]);

  const updateField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setFieldErrors((current) => {
        if (!current[key]) {
          return current;
        }
        const next = { ...current };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const onFileSelected = (file: File) => {
    setSelectedFile(file);
    setFileId(null);
    setUploadError(null);
    setAnalysisWarning(null);
    setAiAnalysis(null);
    setStep("upload");
  };

  const onRemoveFile = () => {
    setSelectedFile(null);
    setFileId(null);
    setUploadProgress(null);
    setUploadError(null);
    setAnalysisWarning(null);
    setAiAnalysis(null);
    setStep("upload");
  };

  const startProcessing = async () => {
    if (!orgSlug || !jobId) {
      return;
    }
    if (!selectedFile) {
      setUploadError(t.publicJob.apply.errors.resumeRequired);
      return;
    }

    setUploadError(null);
    setAnalysisWarning(null);
    setUploadProgress(8);

    try {
      const mimeType = resolveResumeMimeType(selectedFile);
      if (!mimeType) {
        setUploadError(t.publicJob.apply.errors.unsupportedFile);
        return;
      }

      const contentBase64 = await fileToBase64(selectedFile);
      setUploadProgress(35);

      const uploaded = await uploadResume(orgSlug, jobId, {
        fileName: selectedFile.name,
        mimeType,
        contentBase64,
      });
      setFileId(uploaded.fileId);
      setUploadProgress(100);
      setStep("processing");
      setProcessingPhase("extracting");

      await new Promise((resolve) => window.setTimeout(resolve, 250));
      setProcessingPhase("analyzing");

      const analyzed = await analyzeResume(orgSlug, jobId, {
        fileId: uploaded.fileId,
      });

      if ("warningCode" in analyzed && analyzed.warningCode) {
        setAiAnalysis(null);
        setAnalysisWarning(
          analyzed.warningCode === "EXTRACTION_FAILED"
            ? t.publicJob.apply.errors.extractionFailed
            : t.publicJob.apply.errors.analysisFailed,
        );
        if (analyzed.warningCode === "EXTRACTION_FAILED") {
          setStep("upload");
          setUploadProgress(null);
          setUploadError(t.publicJob.apply.errors.extractionFailed);
          return;
        }
        setForm(emptyForm);
      } else if (analyzed.analysis) {
        setAiAnalysis(analyzed.analysis);
        setForm({
          fullName: analyzed.analysis.fullName ?? "",
          email: analyzed.analysis.email ?? "",
          phone: analyzed.analysis.phone ?? "",
          currentPosition: analyzed.analysis.currentPosition ?? "",
          skillsText: (analyzed.analysis.skills ?? []).join(", "),
          experience: analyzed.analysis.experience ?? "",
          education: analyzed.analysis.education ?? "",
          linkedin: analyzed.analysis.linkedin ?? "",
          portfolio: analyzed.analysis.portfolio ?? "",
          website: analyzed.analysis.website ?? "",
        });
      }

      setUploadProgress(null);
      setStep("review");
    } catch (error) {
      setUploadProgress(null);
      setStep("upload");
      if (error instanceof ApiRequestError) {
        if (error.code === "FILE_TOO_LARGE") {
          setUploadError(t.publicJob.apply.errors.fileTooLarge);
          return;
        }
        if (error.code === "FILE_INVALID_TYPE") {
          setUploadError(t.publicJob.apply.errors.unsupportedFile);
          return;
        }
        setUploadError(t.publicJob.apply.errors.uploadFailed);
        return;
      }
      setUploadError(t.publicJob.apply.errors.unexpected);
    }
  };

  const onSubmit = async () => {
    if (!orgSlug || !jobId || !fileId) {
      setUploadError(t.publicJob.apply.errors.resumeRequired);
      setStep("upload");
      return;
    }

    const skills = form.skillsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload: SubmitApplicationInput = {
      fileId,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      currentPosition: form.currentPosition || null,
      skills,
      experience: form.experience || null,
      education: form.education || null,
      linkedin: form.linkedin || null,
      portfolio: form.portfolio || null,
      website: form.website || null,
      aiAnalysis,
      extractedText: null,
    };

    const parsed = SubmitApplicationSchema.safeParse(payload);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (path === "fullName") {
          nextErrors.fullName = t.publicJob.apply.errors.fullNameRequired;
        } else if (path === "email") {
          nextErrors.email =
            issue.message === "EMAIL_INVALID"
              ? t.publicJob.apply.errors.emailInvalid
              : t.publicJob.apply.errors.emailRequired;
        } else if (path === "phone") {
          nextErrors.phone = t.publicJob.apply.errors.phoneRequired;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitApplication(orgSlug, jobId, parsed.data);
      const state: ApplySuccessState = {
        trackingToken: result.trackingToken,
        trackingUrl: result.trackingUrl,
        jobTitle: result.jobTitle,
        organizationName: result.organizationName,
        submittedAt: result.submittedAt,
      };
      navigate(`/${orgSlug}/jobs/${jobId}/apply/success`, { state, replace: true });
    } catch (error) {
      if (error instanceof ApiRequestError && error.code === "DUPLICATE_APPLICATION") {
        push(t.publicJob.apply.errors.duplicate, "error");
      } else {
        push(t.publicJob.apply.errors.unexpected, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    processingPhase,
    selectedFile,
    uploadProgress,
    uploadError,
    analysisWarning,
    form,
    fieldErrors,
    submitting,
    onFileSelected,
    onRemoveFile,
    startProcessing,
    updateField,
    onSubmit,
  };
}
