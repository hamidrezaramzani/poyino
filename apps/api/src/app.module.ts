import { Module } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { AiModule } from "./ai/ai.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./authentication/authentication.module";
import { CandidatesModule } from "./candidates/candidates.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { JobsModule } from "./jobs/jobs.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PublicJobModule } from "./public-job/public-job.module";
import { SettingsModule } from "./settings/settings.module";
import { StorageModule } from "./storage/storage.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    AiModule,
    StorageModule,
    PrismaModule,
    AuthenticationModule,
    DashboardModule,
    JobsModule,
    CandidatesModule,
    AnalyticsModule,
    PublicJobModule,
    SettingsModule,
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
