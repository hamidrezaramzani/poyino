import { createHash, randomBytes } from "node:crypto";
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import {
  ApplyErrorCode,
  MAX_RESUME_UPLOAD_BYTES,
  PublicJobErrorCode,
  TrackingErrorCode,
  type AnalyzeResumeInput,
  type AnalyzeResumeSoftFailure,
  type AnalyzeResumeSuccess,
  type ResumeAnalysis,
  type SubmitApplicationInput,
  type UploadResumeInput,
} from "@poyino/contracts";
import { PDFParse } from "pdf-parse";
import { AiService } from "../../ai/ai.service";
import {
  EMAIL_SERVICE,
  type EmailService,
} from "../../email/email.interface";
import {
  formatDateOnly,
  isJobExpired,
} from "../../jobs/utils/job-expiration";
import { PrismaService } from "../../prisma/prisma.service";
import {
  StorageObjectNotFoundException,
  StorageService,
  StorageValidationException,
} from "../../storage";
import {
  buildResumeAnalysisPrompt,
  normalizeResumeAnalysis,
  resumeAnalysisSchemaHint,
  resumeAnalysisSystemPrompt,
  resumeAnalysisZodSchema,
} from "../ai/analyze-resume";
import {
  buildJobMatchPrompt,
  jobMatchAnalysisZodSchema,
  jobMatchSchemaHint,
  jobMatchSystemPrompt,
  normalizeJobMatchAnalysis,
} from "../ai/evaluate-job-match";

const RESUME_MIME_TYPES = ["application/pdf"] as const;

@Injectable()
export class PublicJobService {
  private readonly logger = new Logger(PublicJobService.name);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AiService) private readonly aiService: AiService,
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) {}

  async getPublicJob(orgSlug: string, jobId: string) {
    const job = await this.findPublishedJob(orgSlug, jobId);

    if (!job) {
      throw jobNotFound();
    }

    const isExpired = isJobExpired(
      job.expirationDate,
      job.organization.timezone,
    );

    return {
      success: true as const,
      job: {
        id: job.id,
        title: job.title,
        department: job.department,
        employmentType: job.employmentType,
        workplaceType: job.workplaceType,
        location: job.location,
        description: job.description,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        benefits: job.benefits,
        positions: job.positions,
        publishedAt: job.publishedAt?.toISOString() ?? null,
        expirationDate: formatDateOnly(job.expirationDate),
        acceptingApplications: !isExpired,
        isExpired,
        organization: {
          name: job.organization.name,
          displayName: job.organization.displayName,
          description: job.organization.description,
          logoUrl: job.organization.logoId
            ? `/public/${job.organization.slug}/logo`
            : null,
          primaryColor: job.organization.primaryColor,
          secondaryColor: job.organization.secondaryColor,
          language: job.organization.language,
          timezone: job.organization.timezone,
        },
      },
    };
  }

  async getOrganizationLogo(orgSlug: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { slug: orgSlug },
      select: {
        logoId: true,
      },
    });

    if (!organization?.logoId) {
      throw new NotFoundException({
        success: false,
        error: {
          code: PublicJobErrorCode.JOB_NOT_FOUND,
          message: "Logo not found.",
        },
      });
    }

    try {
      return await this.storageService.download(organization.logoId);
    } catch (error) {
      if (error instanceof StorageObjectNotFoundException) {
        throw new NotFoundException({
          success: false,
          error: {
            code: PublicJobErrorCode.JOB_NOT_FOUND,
            message: "Logo not found.",
          },
        });
      }
      throw error;
    }
  }

  async uploadResume(
    orgSlug: string,
    jobId: string,
    input: UploadResumeInput,
  ) {
    const job = await this.requireAcceptingJob(orgSlug, jobId);

    if (input.mimeType !== "application/pdf") {
      throw new BadRequestException({
        success: false,
        error: {
          code: ApplyErrorCode.FILE_INVALID_TYPE,
          message: "Only PDF files are supported.",
        },
      });
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(input.contentBase64, "base64");
    } catch {
      throw new BadRequestException({
        success: false,
        error: {
          code: ApplyErrorCode.FILE_INVALID_TYPE,
          message: "Unable to upload your resume.",
        },
      });
    }

    if (buffer.byteLength === 0 || buffer.byteLength > MAX_RESUME_UPLOAD_BYTES) {
      throw new BadRequestException({
        success: false,
        error: {
          code: ApplyErrorCode.FILE_TOO_LARGE,
          message: "File size exceeds the maximum allowed limit.",
        },
      });
    }

    try {
      const file = await this.storageService.upload({
        organizationId: job.organizationId,
        folder: "resumes",
        scope: job.organizationId,
        buffer,
        originalName: input.fileName,
        mimeType: input.mimeType,
        maxBytes: MAX_RESUME_UPLOAD_BYTES,
        allowedMimeTypes: RESUME_MIME_TYPES,
      });

      return {
        success: true as const,
        fileId: file.id,
        fileName: file.originalName,
        sizeBytes: file.sizeBytes,
      };
    } catch (error) {
      if (error instanceof StorageValidationException) {
        throw new BadRequestException({
          success: false,
          error: {
            code: ApplyErrorCode.FILE_INVALID_TYPE,
            message: "Unable to upload your resume.",
          },
        });
      }
      throw error;
    }
  }

  async analyzeResume(
    orgSlug: string,
    jobId: string,
    input: AnalyzeResumeInput,
  ): Promise<AnalyzeResumeSuccess | AnalyzeResumeSoftFailure> {
    const job = await this.requireAcceptingJob(orgSlug, jobId);
    const file = await this.requireOwnedResumeFile(
      job.organizationId,
      input.fileId,
    );

    let extractedText = "";
    try {
      extractedText = await this.extractPdfText(file.id);
    } catch (error) {
      this.logger.warn(
        `PDF extraction failed for file ${input.fileId}: ${String(error)}`,
      );
      return {
        success: true as const,
        analysis: null,
        extractedTextLength: 0,
        warningCode: "EXTRACTION_FAILED",
      };
    }

    if (!extractedText.trim()) {
      return {
        success: true as const,
        analysis: null,
        extractedTextLength: 0,
        warningCode: "EXTRACTION_FAILED",
      };
    }

    try {
      const result = await this.aiService.generateStructured({
        prompt: buildResumeAnalysisPrompt(extractedText),
        schema: resumeAnalysisZodSchema,
        schemaName: "ResumeAnalysis",
        schemaHint: resumeAnalysisSchemaHint,
        normalize: normalizeResumeAnalysis,
        system: resumeAnalysisSystemPrompt,
        temperature: 0.2,
        maxTokens: 2_000,
      });

      return {
        success: true as const,
        analysis: result.data,
        extractedTextLength: extractedText.length,
      };
    } catch (error) {
      this.logger.warn(
        `Resume analysis failed for file ${input.fileId}: ${String(error)}`,
      );
      return {
        success: true as const,
        analysis: null,
        extractedTextLength: extractedText.length,
        warningCode: "ANALYSIS_FAILED",
      };
    }
  }

  async submitApplication(
    orgSlug: string,
    jobId: string,
    input: SubmitApplicationInput,
  ) {
    const job = await this.requireAcceptingJob(orgSlug, jobId);
    const resumeFile = await this.requireOwnedResumeFile(
      job.organizationId,
      input.fileId,
    );

    let extractedText = input.extractedText?.trim() || null;
    if (!extractedText) {
      try {
        extractedText =
          (await this.extractPdfText(resumeFile.id)).trim() || null;
      } catch {
        extractedText = null;
      }
    }

    const email = input.email.trim().toLowerCase();
    const existingCandidate = await this.prisma.candidate.findUnique({
      where: {
        organizationId_email: {
          organizationId: job.organizationId,
          email,
        },
      },
      select: { id: true },
    });

    if (existingCandidate) {
      const duplicate = await this.prisma.application.findUnique({
        where: {
          jobId_candidateId: {
            jobId: job.id,
            candidateId: existingCandidate.id,
          },
        },
        select: { id: true },
      });

      if (duplicate) {
        throw new ConflictException({
          success: false,
          error: {
            code: ApplyErrorCode.DUPLICATE_APPLICATION,
            message: "You have already applied for this job.",
          },
        });
      }
    }

    const rawToken = randomBytes(32).toString("hex");
    const trackingTokenHash = hashToken(rawToken);
    const skills = input.skills ?? [];
    const aiAnalysis = (input.aiAnalysis ?? null) as ResumeAnalysis | null;
    const now = new Date();

    const application = await this.prisma.$transaction(async (tx) => {
      const candidate = existingCandidate
        ? await tx.candidate.update({
            where: { id: existingCandidate.id },
            data: {
              fullName: input.fullName,
              phone: input.phone,
              currentPosition: input.currentPosition,
              skills,
              experience: input.experience,
              education: input.education,
              linkedin: input.linkedin,
              portfolio: input.portfolio,
              website: input.website,
              status: "APPLIED",
              jobId: job.id,
              appliedAt: now,
            },
          })
        : await tx.candidate.create({
            data: {
              fullName: input.fullName,
              email,
              phone: input.phone,
              currentPosition: input.currentPosition,
              skills,
              experience: input.experience,
              education: input.education,
              linkedin: input.linkedin,
              portfolio: input.portfolio,
              website: input.website,
              status: "APPLIED",
              jobId: job.id,
              organizationId: job.organizationId,
              appliedAt: now,
            },
          });

      const created = await tx.application.create({
        data: {
          status: "APPLIED",
          trackingTokenHash,
          extractedText,
          aiAnalysis: aiAnalysis ?? undefined,
          resumeFileId: input.fileId,
          candidateId: candidate.id,
          jobId: job.id,
          organizationId: job.organizationId,
          appliedAt: now,
          statusEvents: {
            create: {
              status: "APPLIED",
              createdAt: now,
            },
          },
          activityEvents: {
            create: [
              {
                organizationId: job.organizationId,
                type: "APPLICATION_SUBMITTED",
                description: "Application submitted",
                createdAt: now,
              },
              ...(extractedText
                ? [
                    {
                      organizationId: job.organizationId,
                      type: "RESUME_PROCESSED" as const,
                      description: "Resume processed",
                      createdAt: now,
                    },
                  ]
                : []),
            ],
          },
        },
      });

      return { application: created, candidateId: candidate.id };
    });

    try {
      const extension = resumeFile.extension || "pdf";
      await this.storageService.move(
        resumeFile.id,
        `resumes/${application.application.id}/${resumeFile.id}.${extension}`,
      );
    } catch (error) {
      this.logger.warn(
        `Failed to move resume object for application ${application.application.id}: ${String(error)}`,
      );
    }

    void this.evaluateJobMatch({
      applicationId: application.application.id,
      candidateId: application.candidateId,
      organizationId: job.organizationId,
      jobTitle: job.title,
      jobDescription: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      skills: job.skills.map((item) => item.skill.name),
      candidateFullName: input.fullName,
      candidateCurrentPosition: input.currentPosition,
      candidateSkills: skills,
      candidateExperience: input.experience,
      candidateEducation: input.education,
      extractedText,
    }).catch((error) => {
      this.logger.warn(
        `Job match evaluation failed for application ${application.application.id}: ${String(error)}`,
      );
    });

    const trackingUrl = `/tracking/${rawToken}`;
    const absoluteTrackingUrl = `${webAppBaseUrl()}${trackingUrl}`;
    const organizationName =
      job.organization.displayName?.trim() || job.organization.name;

    void this.emailService
      .sendApplicationConfirmationEmail({
        to: email,
        organizationName,
        jobTitle: job.title,
        trackingUrl: absoluteTrackingUrl,
      })
      .catch((error) => {
        this.logger.warn(
          `Failed to send application confirmation email: ${String(error)}`,
        );
      });

    return {
      success: true as const,
      applicationId: application.application.id,
      trackingToken: rawToken,
      trackingUrl,
      jobTitle: job.title,
      organizationName,
      submittedAt: application.application.appliedAt.toISOString(),
    };
  }

  private async evaluateJobMatch(input: {
    applicationId: string;
    candidateId: string;
    organizationId: string;
    jobTitle: string;
    jobDescription: string;
    responsibilities: string | null;
    requirements: string | null;
    skills: string[];
    candidateFullName: string;
    candidateCurrentPosition: string | null;
    candidateSkills: string[];
    candidateExperience: string | null;
    candidateEducation: string | null;
    extractedText: string | null;
  }) {
    const result = await this.aiService.generateStructured({
      prompt: buildJobMatchPrompt(input),
      schema: jobMatchAnalysisZodSchema,
      schemaName: "JobMatchAnalysis",
      schemaHint: jobMatchSchemaHint,
      normalize: normalizeJobMatchAnalysis,
      system: jobMatchSystemPrompt,
      temperature: 0.2,
      maxTokens: 2_500,
    });

    const analysis = result.data;
    const yearsExperience = analysis.yearsExperience ?? null;

    await this.prisma.$transaction(async (tx) => {
      await tx.application.update({
        where: { id: input.applicationId },
        data: {
          jobMatchAnalysis: analysis,
          yearsExperience,
        },
      });

      await tx.candidate.update({
        where: { id: input.candidateId },
        data: {
          aiScore: analysis.matchScore,
        },
      });

      await tx.applicationActivityEvent.create({
        data: {
          applicationId: input.applicationId,
          organizationId: input.organizationId,
          type: "AI_ANALYSIS_COMPLETED",
          description: `AI match analysis completed (${analysis.matchScore}%)`,
          metadata: { matchScore: analysis.matchScore },
        },
      });
    });
  }

  async getTracking(token: string) {
    if (!token || token.length < 32) {
      throw trackingNotFound();
    }

    const application = await this.prisma.application.findUnique({
      where: { trackingTokenHash: hashToken(token) },
      select: {
        status: true,
        appliedAt: true,
        updatedAt: true,
        organization: {
          select: {
            name: true,
            displayName: true,
            timezone: true,
          },
        },
        job: {
          select: {
            title: true,
            employmentType: true,
            workplaceType: true,
            location: true,
          },
        },
        candidate: {
          select: {
            fullName: true,
            email: true,
            phone: true,
            currentPosition: true,
          },
        },
        statusEvents: {
          orderBy: { createdAt: "asc" },
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!application) {
      throw trackingNotFound();
    }

    const organizationName =
      application.organization.displayName?.trim() ||
      application.organization.name;

    return {
      success: true as const,
      tracking: {
        status: application.status,
        submittedAt: application.appliedAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
        timezone: application.organization.timezone,
        job: {
          title: application.job.title,
          organizationName,
          employmentType: application.job.employmentType,
          workplaceType: application.job.workplaceType,
          location: application.job.location,
        },
        submitted: {
          fullName: application.candidate.fullName,
          email: application.candidate.email,
          phone: application.candidate.phone,
          currentPosition: application.candidate.currentPosition,
        },
        timeline: application.statusEvents.map((event) => ({
          status: event.status,
          createdAt: event.createdAt.toISOString(),
        })),
      },
    };
  }

  private async findPublishedJob(orgSlug: string, jobId: string) {
    return this.prisma.job.findFirst({
      where: {
        id: jobId,
        status: "PUBLISHED",
        organization: { slug: orgSlug },
      },
      select: {
        id: true,
        title: true,
        department: true,
        employmentType: true,
        workplaceType: true,
        location: true,
        description: true,
        responsibilities: true,
        requirements: true,
        benefits: true,
        positions: true,
        publishedAt: true,
        expirationDate: true,
        organizationId: true,
        skills: {
          select: {
            skill: {
              select: {
                name: true,
              },
            },
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            displayName: true,
            description: true,
            logoId: true,
            primaryColor: true,
            secondaryColor: true,
            language: true,
            timezone: true,
          },
        },
      },
    });
  }

  private async requireAcceptingJob(orgSlug: string, jobId: string) {
    const job = await this.findPublishedJob(orgSlug, jobId);

    if (!job) {
      throw jobNotFound();
    }

    if (isJobExpired(job.expirationDate, job.organization.timezone)) {
      throw new BadRequestException({
        success: false,
        error: {
          code: ApplyErrorCode.JOB_NOT_ACCEPTING,
          message: "This job is no longer accepting applications.",
        },
      });
    }

    return job;
  }

  private async requireOwnedResumeFile(
    organizationId: string,
    fileId: string,
  ) {
    try {
      const file = await this.storageService.getOwnedMetadata(
        organizationId,
        fileId,
      );

      if (file.mimeType !== "application/pdf") {
        throw new BadRequestException({
          success: false,
          error: {
            code: ApplyErrorCode.FILE_NOT_FOUND,
            message: "Please upload your resume.",
          },
        });
      }

      return file;
    } catch (error) {
      if (error instanceof StorageObjectNotFoundException) {
        throw new BadRequestException({
          success: false,
          error: {
            code: ApplyErrorCode.FILE_NOT_FOUND,
            message: "Please upload your resume.",
          },
        });
      }
      throw error;
    }
  }

  private async extractPdfText(fileId: string) {
    const { content } = await this.storageService.download(fileId);
    const parser = new PDFParse({ data: new Uint8Array(content) });
    try {
      const result = await parser.getText();
      return result.text ?? "";
    } finally {
      await parser.destroy().catch(() => undefined);
    }
  }
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function webAppBaseUrl() {
  return (process.env.WEB_APP_URL ?? "http://localhost:5173").replace(/\/$/, "");
}

function jobNotFound() {
  return new NotFoundException({
    success: false,
    error: {
      code: PublicJobErrorCode.JOB_NOT_FOUND,
      message: "Job not found.",
    },
  });
}

function trackingNotFound() {
  return new NotFoundException({
    success: false,
    error: {
      code: TrackingErrorCode.TRACKING_NOT_FOUND,
      message: "Tracking link not found.",
    },
  });
}
