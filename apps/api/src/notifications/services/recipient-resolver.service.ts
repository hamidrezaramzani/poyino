import { Inject, Injectable } from "@nestjs/common";
import type { UserRole } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RecipientResolverService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async resolveByRoles(
    organizationId: string,
    roles: UserRole[],
    options?: { departmentId?: string | null; excludeUserId?: string | null },
  ) {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
        role: { in: roles },
        ...(options?.departmentId
          ? {
              OR: [
                { role: { in: ["OWNER", "ADMINISTRATOR"] } },
                { departmentId: options.departmentId },
              ],
            }
          : {}),
        ...(options?.excludeUserId
          ? { id: { not: options.excludeUserId } }
          : {}),
      },
      select: { id: true },
    });

    return users.map((user) => user.id);
  }

  async resolveRecruitersAndHiringManagers(
    organizationId: string,
    options?: { departmentId?: string | null; excludeUserId?: string | null },
  ) {
    return this.resolveByRoles(
      organizationId,
      ["OWNER", "ADMINISTRATOR", "RECRUITER", "HIRING_MANAGER"],
      options,
    );
  }

  async resolveRecruiters(
    organizationId: string,
    options?: { departmentId?: string | null; excludeUserId?: string | null },
  ) {
    return this.resolveByRoles(
      organizationId,
      ["OWNER", "ADMINISTRATOR", "RECRUITER"],
      options,
    );
  }

  async resolveAdministrators(
    organizationId: string,
    options?: { excludeUserId?: string | null },
  ) {
    return this.resolveByRoles(organizationId, ["OWNER", "ADMINISTRATOR"], {
      excludeUserId: options?.excludeUserId,
    });
  }

  async resolvePlatformAdmins(options?: { excludeUserId?: string | null }) {
    const users = await this.prisma.user.findMany({
      where: {
        platformRole: "PLATFORM_ADMIN",
        status: "ACTIVE",
        ...(options?.excludeUserId
          ? { id: { not: options.excludeUserId } }
          : {}),
      },
      select: { id: true },
    });
    return users.map((user) => user.id);
  }

  async resolveOrganizationMembers(
    organizationId: string,
    options?: { excludeUserId?: string | null },
  ) {
    const users = await this.prisma.user.findMany({
      where: {
        organizationId,
        status: "ACTIVE",
        ...(options?.excludeUserId
          ? { id: { not: options.excludeUserId } }
          : {}),
      },
      select: { id: true },
    });
    return users.map((user) => user.id);
  }
}
