import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthenticationController } from "./controllers/authentication.controller";
import { PermissionsGuard } from "./guards/permissions.guard";
import { PlatformAdminGuard } from "./guards/platform-admin.guard";
import { SessionAuthGuard } from "./guards/session-auth.guard";
import { AuthenticationService } from "./services/authentication.service";

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    SessionAuthGuard,
    PermissionsGuard,
    PlatformAdminGuard,
  ],
  exports: [
    AuthenticationService,
    SessionAuthGuard,
    PermissionsGuard,
    PlatformAdminGuard,
  ],
})
export class AuthenticationModule {}
