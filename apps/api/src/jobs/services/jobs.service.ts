import { Inject, Injectable } from "@nestjs/common";
import type {
  CreateJobInput,
  GenerateJobContentInput,
} from "@poyino/contracts";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JobsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  async create(organizationId: string, input: CreateJobInput) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { defaultCurrency: true },
    });

    const currency = input.currency ?? organization?.defaultCurrency ?? "IRR";
    const skillNames = normalizeSkillNames(input.skills ?? []);

    const job = await this.prisma.$transaction(async (tx) => {
      const skillRecords = await Promise.all(
        skillNames.map((name) =>
          tx.skill.upsert({
            where: {
              organizationId_name: {
                organizationId,
                name,
              },
            },
            create: {
              organizationId,
              name,
            },
            update: {},
            select: { id: true },
          }),
        ),
      );

      return tx.job.create({
        data: {
          organizationId,
          title: input.title,
          department: input.department,
          employmentType: input.employmentType,
          workplaceType: input.workplaceType,
          location: input.location,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          currency,
          salaryVisible: input.salaryVisible,
          description: input.description,
          responsibilities: input.responsibilities,
          requirements: input.requirements,
          benefits: input.benefits,
          positions: input.positions,
          expirationDate: input.expirationDate
            ? new Date(`${input.expirationDate}T00:00:00.000Z`)
            : null,
          status: "DRAFT",
          skills: {
            create: skillRecords.map((skill) => ({
              skillId: skill.id,
            })),
          },
        },
        select: {
          id: true,
          status: true,
        },
      });
    });

    return {
      success: true as const,
      id: job.id,
      status: "DRAFT" as const,
    };
  }

  async listTemplates(organizationId: string) {
    const templates = await this.prisma.jobTemplate.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true as const,
      templates: templates.map((template) => ({
        id: template.id,
        name: template.name,
        title: template.title,
        department: template.department,
        employmentType: template.employmentType,
        workplaceType: template.workplaceType,
        location: template.location,
        salaryMin: template.salaryMin,
        salaryMax: template.salaryMax,
        currency: template.currency,
        salaryVisible: template.salaryVisible,
        description: template.description,
        responsibilities: template.responsibilities,
        requirements: template.requirements,
        benefits: template.benefits,
        skills: template.skills,
        positions: template.positions,
      })),
    };
  }

  generateContent(input: GenerateJobContentInput) {
    const prompt = input.prompt.trim();
    const title = deriveTitle(prompt);

    return {
      success: true as const,
      content: {
        title,
        description: [
          `<p>${escapeHtml(prompt)}</p>`,
          `<p>We are hiring a ${escapeHtml(title)} to join our team and help us deliver high-quality work.</p>`,
          "<p>You will collaborate with cross-functional partners, take ownership of meaningful outcomes, and contribute to a culture of continuous improvement.</p>",
        ].join(""),
        responsibilities: [
          "<ul>",
          `<li>Own key deliverables related to ${escapeHtml(title)} responsibilities.</li>`,
          "<li>Collaborate with teammates to plan, execute, and improve day-to-day work.</li>",
          "<li>Communicate progress clearly and proactively surface risks or blockers.</li>",
          "<li>Contribute to documentation, mentoring, and team best practices.</li>",
          "</ul>",
        ].join(""),
        requirements: [
          "<ul>",
          `<li>Proven experience relevant to ${escapeHtml(title)}.</li>`,
          "<li>Strong communication and problem-solving skills.</li>",
          "<li>Ability to work independently and as part of a team.</li>",
          "<li>Comfortable adapting to changing priorities in a growing organization.</li>",
          "</ul>",
        ].join(""),
        benefits: [
          "<ul>",
          "<li>Competitive compensation package.</li>",
          "<li>Flexible working arrangements where possible.</li>",
          "<li>Opportunities for professional growth and learning.</li>",
          "<li>Supportive and collaborative team environment.</li>",
          "</ul>",
        ].join(""),
      },
    };
  }
}

function normalizeSkillNames(skills: string[]) {
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const skill of skills) {
    const name = skill.trim().replace(/\s+/g, " ");
    if (!name) {
      continue;
    }
    const key = name.toLocaleLowerCase("en");
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    normalized.push(name);
  }

  return normalized;
}

function deriveTitle(prompt: string) {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  const lookingForMatch = cleaned.match(
    /(?:looking for|hiring|need|seeking)\s+(?:an?\s+|a\s+)?(.+?)(?:\s+with|\s+who|\.|$)/i,
  );
  const candidate = (lookingForMatch?.[1] ?? cleaned)
    .replace(/^(an?|the)\s+/i, "")
    .trim();

  if (candidate.length >= 3 && candidate.length <= 100) {
    return toTitleCase(candidate);
  }

  return toTitleCase(cleaned.slice(0, 100));
}

function toTitleCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
