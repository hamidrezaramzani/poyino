export function formatWorkspaceName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function createSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createOrganizationSlug(name: string, fallbackId: string): string {
  const slug = createSlug(name);
  if (slug.length >= 2) {
    return slug.slice(0, 120);
  }

  return `organization-${fallbackId.replace(/-/g, "").slice(0, 12)}`;
}
