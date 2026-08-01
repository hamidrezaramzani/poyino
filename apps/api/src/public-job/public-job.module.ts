import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { PrismaModule } from "../prisma/prisma.module";
import { PublicJobController } from "./controllers/public-job.controller";
import { PublicJobService } from "./services/public-job.service";

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [PublicJobController],
  providers: [PublicJobService],
})
export class PublicJobModule {}
