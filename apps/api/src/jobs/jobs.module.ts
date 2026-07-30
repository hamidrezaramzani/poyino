import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { JobsController } from "./controllers/jobs.controller";
import { JobsService } from "./services/jobs.service";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
