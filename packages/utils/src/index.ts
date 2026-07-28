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
