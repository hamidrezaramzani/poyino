import { Inject, Injectable } from "@nestjs/common";
import type { NotificationCategory } from "@poyino/contracts";
import { PrismaService } from "../../prisma/prisma.service";

const DEFAULT_PREFERENCES: Record<
  NotificationCategory,
  { inAppEnabled: boolean; emailEnabled: boolean }
> = {
  CANDIDATES: { inAppEnabled: true, emailEnabled: true },
  INTERVIEWS: { inAppEnabled: true, emailEnabled: true },
  JOBS: { inAppEnabled: true, emailEnabled: false },
  ORGANIZATION: { inAppEnabled: true, emailEnabled: true },
  SYSTEM: { inAppEnabled: true, emailEnabled: true },
  AI: { inAppEnabled: true, emailEnabled: false },
};

const MANDATORY_CATEGORIES = new Set<NotificationCategory>(["SYSTEM"]);

@Injectable()
export class PreferenceResolverService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  getDefaults() {
    return DEFAULT_PREFERENCES;
  }

  isMandatoryCategory(category: NotificationCategory) {
    return MANDATORY_CATEGORIES.has(category);
  }

  async ensureDefaults(userId: string) {
    const existing = await this.prisma.notificationPreference.findMany({
      where: { userId },
      select: { category: true },
    });
    const existingCategories = new Set(existing.map((item) => item.category));
    const missing = (
      Object.keys(DEFAULT_PREFERENCES) as NotificationCategory[]
    ).filter((category) => !existingCategories.has(category));

    if (missing.length === 0) {
      return;
    }

    await this.prisma.notificationPreference.createMany({
      data: missing.map((category) => ({
        userId,
        category,
        inAppEnabled: DEFAULT_PREFERENCES[category].inAppEnabled,
        emailEnabled: DEFAULT_PREFERENCES[category].emailEnabled,
      })),
      skipDuplicates: true,
    });
  }

  async resolveChannels(
    userId: string,
    category: NotificationCategory,
    mandatory: boolean,
  ): Promise<{ inApp: boolean; email: boolean }> {
    if (mandatory || this.isMandatoryCategory(category)) {
      return { inApp: true, email: true };
    }

    await this.ensureDefaults(userId);

    const preference = await this.prisma.notificationPreference.findUnique({
      where: {
        userId_category: { userId, category },
      },
    });

    const defaults = DEFAULT_PREFERENCES[category];
    return {
      inApp: preference?.inAppEnabled ?? defaults.inAppEnabled,
      email: preference?.emailEnabled ?? defaults.emailEnabled,
    };
  }
}
