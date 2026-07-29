import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { DashboardController } from "./controllers/dashboard.controller";
import { DashboardService } from "./services/dashboard.service";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
