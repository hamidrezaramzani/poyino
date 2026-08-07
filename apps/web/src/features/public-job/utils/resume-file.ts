import {
  RESUME_MIME_TYPES,
  type ResumeMimeType,
} from "@poyino/contracts";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const EXTENSION_TO_MIME: Record<string, ResumeMimeType> = {
  pdf: "application/pdf",
  docx: DOCX_MIME,
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

export const RESUME_FILE_ACCEPT = [
  "application/pdf",
  DOCX_MIME,
  "image/jpeg",
  "image/png",
  ".pdf",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
].join(",");

export function resolveResumeMimeType(file: File): ResumeMimeType | null {
  const mime = file.type.trim().toLowerCase();
  if ((RESUME_MIME_TYPES as readonly string[]).includes(mime)) {
    return mime as ResumeMimeType;
  }
  if (mime === "image/jpg") {
    return "image/jpeg";
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension) {
    return null;
  }
  return EXTENSION_TO_MIME[extension] ?? null;
}

export function isSupportedResumeFile(file: File): boolean {
  return resolveResumeMimeType(file) != null;
}
