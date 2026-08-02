import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { InterviewsController } from "./controllers/interviews.controller";
import { InterviewsService } from "./services/interviews.service";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
