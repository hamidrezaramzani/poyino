import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { FeedbackAdminController } from "./controllers/feedback-admin.controller";
import { FeedbackController } from "./controllers/feedback.controller";
import { FeedbackService } from "./services/feedback.service";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [FeedbackController, FeedbackAdminController],
  providers: [FeedbackService],
  exports: [FeedbackService],
})
export class FeedbackModule {}
