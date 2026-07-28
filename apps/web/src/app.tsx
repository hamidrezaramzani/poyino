import { appMetadata, brandColors } from "@poyino/config";
import { createJobSchema } from "@poyino/contracts";
import { Button, Card } from "@poyino/ui";
import { createSlug, formatWorkspaceName } from "@poyino/utils";

const sampleJob = createJobSchema.parse({
  title: "Senior Backend Engineer",
  location: "Tehran",
  employmentType: "full-time",
  description:
    "Build the API foundation for the AI-powered recruitment platform.",
});

const organizationName = formatWorkspaceName("Poyino Labs");

export function App() {
  return (
    <main className="page-shell">
      <div className="hero">
        <span className="hero-badge">Foundation Ready</span>
        <h1>{appMetadata.name}</h1>
        <p>{appMetadata.tagline}</p>
        <p>
          Workspace slug: <strong>{createSlug(organizationName)}</strong>
        </p>
        <Button>Start Building</Button>
      </div>

      <div className="grid">
        <Card title="Architecture Baseline">
          <p>Monorepo structure, shared contracts, and starter apps are ready.</p>
        </Card>

        <Card title="Validated Sample Job">
          <p>{sampleJob.title}</p>
          <p>
            {sampleJob.location} / {sampleJob.employmentType}
          </p>
        </Card>

        <Card title="Brand Token Preview">
          <div
            className="color-swatch"
            style={{ backgroundColor: brandColors.primary }}
          />
          <p>{brandColors.primary}</p>
        </Card>
      </div>
    </main>
  );
}
