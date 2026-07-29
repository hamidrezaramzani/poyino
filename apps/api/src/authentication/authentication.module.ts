import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthenticationController } from "./controllers/authentication.controller";
import { SessionAuthGuard } from "./guards/session-auth.guard";
import { AuthenticationService } from "./services/authentication.service";

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, SessionAuthGuard],
  exports: [AuthenticationService, SessionAuthGuard],
})
export class AuthenticationModule {}
