import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PrismaModule } from "../prisma/prisma.module";
import { OrganizationController } from "./controllers/organization.controller";
import { OrganizationService } from "./services/organization.service";

@Module({
  imports: [PrismaModule, AuthenticationModule, NotificationsModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
