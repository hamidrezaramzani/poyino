import { Inject, Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { randomUUID } from "node:crypto";
import {
  DOMAIN_NOTIFICATION_EVENT,
  type NotificationEventName,
} from "@poyino/contracts";
import type { DomainNotificationEvent } from "../types/domain-event";

@Injectable()
export class DomainEventPublisher {
  private readonly logger = new Logger(DomainEventPublisher.name);

  constructor(
    @Inject(EventEmitter2) private readonly eventEmitter: EventEmitter2,
  ) {}

  publish(
    input: Omit<DomainNotificationEvent, "eventId" | "timestamp"> & {
      eventId?: string;
      timestamp?: string;
    },
  ) {
    const payload: DomainNotificationEvent = {
      ...input,
      eventId: input.eventId ?? randomUUID(),
      timestamp: input.timestamp ?? new Date().toISOString(),
    };

    try {
      this.eventEmitter.emit(DOMAIN_NOTIFICATION_EVENT, payload);
    } catch (error) {
      this.logger.warn(
        `Failed to emit domain event ${String(input.event)}: ${String(error)}`,
      );
    }
  }

  publishNamed(
    event: NotificationEventName | string,
    input: Omit<DomainNotificationEvent, "eventId" | "timestamp" | "event"> & {
      eventId?: string;
    },
  ) {
    this.publish({ ...input, event });
  }
}
