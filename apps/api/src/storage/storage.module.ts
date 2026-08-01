import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "../prisma/prisma.module";
import { STORAGE_PROVIDER } from "./constants/storage.constants";
import { StorageLogger } from "./logging/storage.logger";
import { S3StorageProvider } from "./providers/s3.provider";
import { StorageService } from "./storage.service";

@Global()
@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [
    StorageLogger,
    S3StorageProvider,
    {
      provide: STORAGE_PROVIDER,
      useExisting: S3StorageProvider,
    },
    StorageService,
  ],
  exports: [StorageService, STORAGE_PROVIDER],
})
export class StorageModule {}
