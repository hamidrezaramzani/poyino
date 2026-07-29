import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthenticationController } from "./controllers/authentication.controller";
import { AuthenticationService } from "./services/authentication.service";

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
