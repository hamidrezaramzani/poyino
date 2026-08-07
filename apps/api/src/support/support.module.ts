import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PrismaModule } from "../prisma/prisma.module";
import { StorageModule } from "../storage/storage.module";
import { SupportAdminController } from "./controllers/support-admin.controller";
import { SupportController } from "./controllers/support.controller";
import { SupportService } from "./services/support.service";

@Module({
  imports: [
    PrismaModule,
    AuthenticationModule,
    NotificationsModule,
    StorageModule,
  ],
  controllers: [SupportController, SupportAdminController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
