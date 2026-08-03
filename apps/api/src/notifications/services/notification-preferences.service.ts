import { Inject, Injectable } from "@nestjs/common";
import type {
  NotificationCategory,
  UpdateNotificationPreferencesInput,
} from "@poyino/contracts";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { PrismaService } from "../../prisma/prisma.service";
import { PreferenceResolverService } from "./preference-resolver.service";

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PreferenceResolverService)
    private readonly preferenceResolver: PreferenceResolverService,
  ) {}

  async get(user: AuthenticatedUser) {
    await this.preferenceResolver.ensureDefaults(user.id);
    const preferences = await this.prisma.notificationPreference.findMany({
      where: { userId: user.id },
      orderBy: { category: "asc" },
    });

    const defaults = this.preferenceResolver.getDefaults();
    const categories = Object.keys(defaults) as NotificationCategory[];

    return {
      success: true as const,
      preferences: categories.map((category) => {
        const row = preferences.find((item) => item.category === category);
        const fallback = defaults[category];
        return {
          category,
          inAppEnabled: row?.inAppEnabled ?? fallback.inAppEnabled,
          emailEnabled: row?.emailEnabled ?? fallback.emailEnabled,
          mandatory: this.preferenceResolver.isMandatoryCategory(category),
        };
      }),
    };
  }

  async update(
    user: AuthenticatedUser,
    input: UpdateNotificationPreferencesInput,
  ) {
    await this.preferenceResolver.ensureDefaults(user.id);

    for (const item of input.preferences) {
      if (this.preferenceResolver.isMandatoryCategory(item.category)) {
        continue;
      }

      await this.prisma.notificationPreference.upsert({
        where: {
          userId_category: {
            userId: user.id,
            category: item.category,
          },
        },
        create: {
          userId: user.id,
          category: item.category,
          inAppEnabled: item.inAppEnabled,
          emailEnabled: item.emailEnabled,
        },
        update: {
          inAppEnabled: item.inAppEnabled,
          emailEnabled: item.emailEnabled,
        },
      });
    }

    return this.get(user);
  }

  async reset(user: AuthenticatedUser) {
    const defaults = this.preferenceResolver.getDefaults();
    const categories = Object.keys(defaults) as NotificationCategory[];

    for (const category of categories) {
      await this.prisma.notificationPreference.upsert({
        where: {
          userId_category: { userId: user.id, category },
        },
        create: {
          userId: user.id,
          category,
          inAppEnabled: defaults[category].inAppEnabled,
          emailEnabled: defaults[category].emailEnabled,
        },
        update: {
          inAppEnabled: defaults[category].inAppEnabled,
          emailEnabled: defaults[category].emailEnabled,
        },
      });
    }

    return this.get(user);
  }
}
