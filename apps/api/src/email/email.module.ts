import { Module } from "@nestjs/common";
import { ConsoleEmailService } from "./console-email.service";
import { EMAIL_SERVICE } from "./email.interface";

@Module({
  providers: [
    {
      provide: EMAIL_SERVICE,
      useClass: ConsoleEmailService,
    },
  ],
  exports: [EMAIL_SERVICE],
})
export class EmailModule {}
