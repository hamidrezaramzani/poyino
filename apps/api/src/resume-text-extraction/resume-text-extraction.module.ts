import { Global, Module } from "@nestjs/common";
import { ResumeTextExtractionService } from "./resume-text-extraction.service";

@Global()
@Module({
  providers: [ResumeTextExtractionService],
  exports: [ResumeTextExtractionService],
})
export class ResumeTextExtractionModule {}
