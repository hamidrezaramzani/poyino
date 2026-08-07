import { Injectable, Logger } from "@nestjs/common";
import { RESUME_MIME_TYPES, type ResumeMimeType } from "@poyino/contracts";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { createWorker } from "tesseract.js";

export type ResumeExtractionStrategy = "pdf" | "docx" | "ocr";

export type ResumeExtractionInput = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
};

export type ResumeExtractionResult = {
  text: string;
  metadata: {
    strategy: ResumeExtractionStrategy;
    mimeType: string;
    charCount: number;
  };
};

export class ResumeTextExtractionException extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ResumeTextExtractionException";
  }
}

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

@Injectable()
export class ResumeTextExtractionService {
  private readonly logger = new Logger(ResumeTextExtractionService.name);

  async extractResumeText(
    input: ResumeExtractionInput,
  ): Promise<ResumeExtractionResult> {
    const mimeType = this.resolveMimeType(input.mimeType, input.fileName);
    if (!mimeType) {
      throw new ResumeTextExtractionException(
        "Unsupported resume file type for text extraction.",
      );
    }

    const strategy = this.resolveStrategy(mimeType);

    try {
      const text = await this.extractWithStrategy(strategy, input.buffer);
      return {
        text,
        metadata: {
          strategy,
          mimeType,
          charCount: text.length,
        },
      };
    } catch (error) {
      if (error instanceof ResumeTextExtractionException) {
        throw error;
      }

      this.logger.warn(
        `Resume text extraction failed (${strategy}): ${String(error)}`,
      );
      throw new ResumeTextExtractionException(
        "Unable to extract text from the uploaded resume.",
        { cause: error },
      );
    }
  }

  private resolveStrategy(mimeType: ResumeMimeType): ResumeExtractionStrategy {
    if (mimeType === "application/pdf") {
      return "pdf";
    }
    if (mimeType === DOCX_MIME) {
      return "docx";
    }
    return "ocr";
  }

  private async extractWithStrategy(
    strategy: ResumeExtractionStrategy,
    buffer: Buffer,
  ): Promise<string> {
    switch (strategy) {
      case "pdf":
        return this.extractPdf(buffer);
      case "docx":
        return this.extractDocx(buffer);
      case "ocr":
        return this.extractOcr(buffer);
    }
  }

  private async extractPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      return result.text ?? "";
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }

  private async extractDocx(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value ?? "";
  }

  private async extractOcr(buffer: Buffer): Promise<string> {
    const worker = await createWorker("eng");
    try {
      const {
        data: { text },
      } = await worker.recognize(buffer);
      return text ?? "";
    } finally {
      await worker.terminate().catch(() => undefined);
    }
  }

  private resolveMimeType(
    mimeType: string,
    fileName?: string,
  ): ResumeMimeType | null {
    const normalizedMime = mimeType.trim().toLowerCase();
    if ((RESUME_MIME_TYPES as readonly string[]).includes(normalizedMime)) {
      return normalizedMime as ResumeMimeType;
    }

    if (normalizedMime === "image/jpg") {
      return "image/jpeg";
    }

    const extension = fileName?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "application/pdf";
      case "docx":
        return DOCX_MIME;
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      default:
        return null;
    }
  }
}
