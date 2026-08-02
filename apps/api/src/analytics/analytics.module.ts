import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AnalyticsController } from "./controllers/analytics.controller";
import { AnalyticsService } from "./services/analytics.service";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
