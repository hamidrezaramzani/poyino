import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  EMAIL_SERVICE,
  type EmailService,
} from "../../email/email.interface";
import {
  addDaysToYmd,
  formatDateOnly,
  getYmdInTimeZone,
  isJobExpired,
} from "../utils/job-expiration";

const EXPIRATION_CHECK_INTERVAL_MS = 60 * 60 * 1000;

@Injectable()
export class JobExpirationScheduler
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(JobExpirationScheduler.name);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(EMAIL_SERVICE) private readonly emailService: EmailService,
  ) {}

  onModuleInit() {
    void this.run();
    this.timer = setInterval(() => {
      void this.run();
    }, EXPIRATION_CHECK_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async run() {
    try {
      await this.processPublishedJobs();
    } catch (error) {
      this.logger.error(
        "Failed to process job expirations",
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  private async processPublishedJobs() {
    const jobs = await this.prisma.job.findMany({
      where: {
        status: "PUBLISHED",
        expirationDate: { not: null },
      },
      select: {
        id: true,
        title: true,
        expirationDate: true,
        expirationReminderSentAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            email: true,
            timezone: true,
            jobExpirationEmail: true,
            slug: true,
          },
        },
      },
    });

    const now = new Date();
    let expiredCount = 0;
    let reminderCount = 0;

    for (const job of jobs) {
      const timezone = job.organization.timezone || "Asia/Tehran";
      const expirationYmd = formatDateOnly(job.expirationDate);
      if (!expirationYmd) {
        continue;
      }

      if (isJobExpired(job.expirationDate, timezone, now)) {
        expiredCount += 1;
        continue;
      }

      if (
        !job.organization.jobExpirationEmail ||
        job.expirationReminderSentAt
      ) {
        continue;
      }

      const todayYmd = getYmdInTimeZone(now, timezone);
      const reminderYmd = addDaysToYmd(expirationYmd, -3);
      if (todayYmd !== reminderYmd) {
        continue;
      }

      await this.emailService.sendJobExpirationReminderEmail({
        to: job.organization.email,
        organizationName: job.organization.name,
        jobTitle: job.title,
        expirationDate: expirationYmd,
        jobUrl: `/${job.organization.slug}/jobs/${job.id}`,
      });

      await this.prisma.job.update({
        where: { id: job.id },
        data: { expirationReminderSentAt: now },
      });

      reminderCount += 1;
    }

    if (expiredCount > 0 || reminderCount > 0) {
      this.logger.log(
        `Job expiration pass complete: expired=${expiredCount} remindersSent=${reminderCount}`,
      );
    }
  }
}
