import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { StorageModule } from "../storage";
import { CandidatesController } from "./controllers/candidates.controller";
import { OrgCandidatesController } from "./controllers/org-candidates.controller";
import { CandidatesService } from "./services/candidates.service";

@Module({
  imports: [PrismaModule, AuthenticationModule, StorageModule],
  controllers: [CandidatesController, OrgCandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
