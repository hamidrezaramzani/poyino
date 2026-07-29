import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { SettingsController } from "./controllers/settings.controller";
import { SettingsService } from "./services/settings.service";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
