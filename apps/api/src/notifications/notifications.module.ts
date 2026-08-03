import { Module } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { PrismaModule } from "../prisma/prisma.module";
import { NotificationPreferencesController } from "./controllers/notification-preferences.controller";
import { NotificationsController } from "./controllers/notifications.controller";
import { NotificationGateway } from "./gateways/notification.gateway";
import { DomainEventPublisher } from "./services/domain-event.publisher";
import { NotificationDispatcherService } from "./services/notification-dispatcher.service";
import { NotificationPreferencesService } from "./services/notification-preferences.service";
import { NotificationsService } from "./services/notifications.service";
import { PreferenceResolverService } from "./services/preference-resolver.service";
import { RecipientResolverService } from "./services/recipient-resolver.service";

@Module({
  imports: [PrismaModule, AuthenticationModule],
  controllers: [NotificationsController, NotificationPreferencesController],
  providers: [
    DomainEventPublisher,
    RecipientResolverService,
    PreferenceResolverService,
    NotificationPreferencesService,
    NotificationsService,
    NotificationDispatcherService,
    NotificationGateway,
  ],
  exports: [
    DomainEventPublisher,
    RecipientResolverService,
    NotificationsService,
  ],
})
export class NotificationsModule {}
