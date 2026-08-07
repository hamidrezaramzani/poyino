import { Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AiModule } from "./ai/ai.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./authentication/authentication.module";
import { CandidatesModule } from "./candidates/candidates.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { InterviewsModule } from "./interviews/interviews.module";
import { JobsModule } from "./jobs/jobs.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { OrganizationModule } from "./organization/organization.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PublicJobModule } from "./public-job/public-job.module";
import { ResumeTextExtractionModule } from "./resume-text-extraction";
import { SettingsModule } from "./settings/settings.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      maxListeners: 20,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    AiModule,
    StorageModule,
    ResumeTextExtractionModule,
    PrismaModule,
    AuthenticationModule,
    NotificationsModule,
    DashboardModule,
    JobsModule,
    CandidatesModule,
    InterviewsModule,
    AnalyticsModule,
    PublicJobModule,
    SettingsModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
