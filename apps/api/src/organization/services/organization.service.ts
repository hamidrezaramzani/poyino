import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  DepartmentErrorCode,
  MemberErrorCode,
  isOrgWideRole,
  type CreateDepartmentInput,
  type CreateMemberInput,
  type OrganizationRole,
  type UpdateMemberInput,
} from "@poyino/contracts";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import type { AuthenticatedUser } from "../../authentication/types/authenticated-user";
import { PrismaService } from "../../prisma/prisma.service";

const BCRYPT_ROUNDS = 12;

@Injectable()
export class OrganizationService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async listDepartments(user: AuthenticatedUser) {
    const where = {
      organizationId: user.organizationId,
      archivedAt: null,
      ...(isOrgWideRole(user.role as OrganizationRole)
        ? {}
        : { id: user.departmentId }),
    };

    const departments = await this.prisma.department.findMany({
      where,
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        isDefault: true,
        archivedAt: true,
      },
    });

    return {
      success: true as const,
      departments: departments.map((department) => mapDepartment(department)),
    };
  }

  async createDepartment(user: AuthenticatedUser, input: CreateDepartmentInput) {
    const name = input.name.trim();

    const existing = await this.prisma.department.findFirst({
      where: {
        organizationId: user.organizationId,
        name: { equals: name, mode: "insensitive" },
      },
    });

    if (existing) {
      throw departmentNameExistsException();
    }

    const department = await this.prisma.department.create({
      data: {
        id: randomUUID(),
        organizationId: user.organizationId,
        name,
        description: input.description ?? null,
        isDefault: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        isDefault: true,
        archivedAt: true,
      },
    });

    return {
      success: true as const,
      department: mapDepartment(department),
    };
  }

  async listMembers(user: AuthenticatedUser) {
    const members = await this.prisma.user.findMany({
      where: { organizationId: user.organizationId },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        departmentId: true,
        createdAt: true,
        lastLoginAt: true,
        department: { select: { name: true } },
      },
    });

    return {
      success: true as const,
      members: members.map((member) => mapMember(member)),
    };
  }

  async createMember(user: AuthenticatedUser, input: CreateMemberInput) {
    const email = input.email.trim().toLowerCase();

    const department = await this.prisma.department.findFirst({
      where: {
        id: input.departmentId,
        organizationId: user.organizationId,
        archivedAt: null,
      },
    });

    if (!department) {
      throw departmentNotFoundException();
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw emailAlreadyExistsException();
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

    const member = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        role: input.role,
        status: "ACTIVE",
        isEmailVerified: true,
        organizationId: user.organizationId,
        departmentId: department.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        departmentId: true,
        createdAt: true,
        lastLoginAt: true,
        department: { select: { name: true } },
      },
    });

    return {
      success: true as const,
      member: mapMember(member),
    };
  }

  async updateMember(
    user: AuthenticatedUser,
    memberId: string,
    input: UpdateMemberInput,
  ) {
    const member = await this.prisma.user.findFirst({
      where: { id: memberId, organizationId: user.organizationId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        departmentId: true,
      },
    });

    if (!member) {
      throw memberNotFoundException();
    }

    if (member.role === "OWNER") {
      throw cannotModifyOwnerException();
    }

    if (member.id === user.id && input.status === "SUSPENDED") {
      throw cannotModifySelfException();
    }

    if (input.departmentId) {
      const department = await this.prisma.department.findFirst({
        where: {
          id: input.departmentId,
          organizationId: user.organizationId,
          archivedAt: null,
        },
      });
      if (!department) {
        throw departmentNotFoundException();
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: member.id },
      data: {
        ...(input.role ? { role: input.role } : {}),
        ...(input.departmentId ? { departmentId: input.departmentId } : {}),
        ...(input.status ? { status: input.status } : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        departmentId: true,
        createdAt: true,
        lastLoginAt: true,
        department: { select: { name: true } },
      },
    });

    return {
      success: true as const,
      member: mapMember(updated),
    };
  }
}

function mapDepartment(department: {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  isDefault: boolean;
  archivedAt: Date | null;
}) {
  return {
    id: department.id,
    name: department.name,
    description: department.description,
    color: department.color,
    isDefault: department.isDefault,
    archivedAt: department.archivedAt?.toISOString() ?? null,
  };
}

function mapMember(member: {
  id: string;
  email: string;
  role: string;
  status: string;
  departmentId: string;
  createdAt: Date;
  lastLoginAt: Date | null;
  department: { name: string };
}) {
  return {
    id: member.id,
    email: member.email,
    role: member.role as OrganizationRole,
    status: member.status as "ACTIVE" | "SUSPENDED",
    departmentId: member.departmentId,
    departmentName: member.department.name,
    createdAt: member.createdAt.toISOString(),
    lastLoginAt: member.lastLoginAt?.toISOString() ?? null,
    isOwner: member.role === "OWNER",
  };
}

function emailAlreadyExistsException() {
  return new ConflictException({
    success: false,
    error: {
      code: MemberErrorCode.EMAIL_ALREADY_EXISTS,
      message: "A user with this email already exists.",
    },
  });
}

function memberNotFoundException() {
  return new NotFoundException({
    success: false,
    error: {
      code: MemberErrorCode.MEMBER_NOT_FOUND,
      message: "Member not found.",
    },
  });
}

function departmentNotFoundException() {
  return new NotFoundException({
    success: false,
    error: {
      code: MemberErrorCode.DEPARTMENT_NOT_FOUND,
      message: "Department not found.",
    },
  });
}

function departmentNameExistsException() {
  return new ConflictException({
    success: false,
    error: {
      code: DepartmentErrorCode.DEPARTMENT_NAME_EXISTS,
      message: "A department with this name already exists.",
    },
  });
}

function cannotModifyOwnerException() {
  return new ForbiddenException({
    success: false,
    error: {
      code: MemberErrorCode.CANNOT_MODIFY_OWNER,
      message: "The organization owner cannot be modified.",
    },
  });
}

function cannotModifySelfException() {
  return new ForbiddenException({
    success: false,
    error: {
      code: MemberErrorCode.CANNOT_MODIFY_SELF,
      message: "You cannot suspend your own account.",
    },
  });
}
