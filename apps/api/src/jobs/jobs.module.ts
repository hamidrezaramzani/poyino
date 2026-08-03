import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { EmailModule } from "../email/email.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PrismaModule } from "../prisma/prisma.module";
import { JobsController } from "./controllers/jobs.controller";
import { JobExpirationScheduler } from "./services/job-expiration.scheduler";
import { JobsService } from "./services/jobs.service";

@Module({
  imports: [PrismaModule, AuthenticationModule, EmailModule, NotificationsModule],
  controllers: [JobsController],
  providers: [JobsService, JobExpirationScheduler],
})
export class JobsModule {}
