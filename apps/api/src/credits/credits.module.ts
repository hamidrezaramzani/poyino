import { Global, Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PrismaModule } from "../prisma/prisma.module";
import { CreditsController } from "./controllers/credits.controller";
import { CreditsService } from "./services/credits.service";

@Global()
@Module({
  imports: [PrismaModule, AuthenticationModule, NotificationsModule],
  controllers: [CreditsController],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}
