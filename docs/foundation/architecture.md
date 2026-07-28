# Architecture

## Purpose

This document describes the implemented project foundation for Poyino.

At this stage, the repository focuses on a clean monorepo baseline, shared contracts, and starter application shells rather than finished product features.

---

# Foundation Goals

The current architecture is designed to:

- Keep frontend and backend development independent
- Establish shared contracts early
- Support feature-based growth
- Keep the initial codebase small and understandable
- Create extension points for AI, storage, database, and workflow modules

---

# Implemented Baseline

The repository currently contains:

- `apps/web`: React + Vite starter application
- `apps/api`: NestJS-oriented backend starter
- `packages/contracts`: shared validation contracts
- `packages/ui`: shared UI primitives
- `packages/utils`: shared utilities
- `packages/config`: shared app metadata and brand tokens
- `packages/eslint-config`: shared lint preset
- `packages/tsconfig`: shared TypeScript presets

This is the minimum foundation required to start building product features without restructuring the repository later.

---

# High-Level Architecture

```text
                    +----------------+
                    |   React Web    |
                    +-------+--------+
                            |
                         Shared
                        Contracts
                            |
                    +-------v--------+
                    |   NestJS API   |
                    +-------+--------+
                            |
          +-----------------+-----------------+
          |                 |                 |
      Database         File Storage      AI Providers
        Later             Later              Later
```

The outer integrations are planned, but the current foundation already reserves a clear place for them.

---

# Monorepo Strategy

Poyino uses a workspace-based monorepo so that applications can share code without duplication.

The monorepo is intentionally split into:

- `apps/` for deployable products
- `packages/` for reusable internal libraries
- `docs/` for product and engineering specifications

This allows contracts, design tokens, and utilities to evolve in one place.

---

# Frontend Architecture

The frontend foundation is intentionally lightweight.

Current baseline:

- Vite for development/build tooling
- React as the UI runtime
- A single app shell that consumes shared packages
- A styling entry point in `src/styles.css`

Target evolution:

- Feature folders inside `src/features/`
- Shared route structure
- Query/state layers
- Design system integration
- Storybook-backed UI package

---

# Backend Architecture

The backend foundation starts with a minimal application module, controller, and service.

Current baseline:

- NestJS application entry point
- Module-based composition
- Health endpoint for basic runtime verification

Target evolution:

- Feature modules such as `authentication`, `jobs`, and `candidates`
- Repository and database layers
- Provider abstractions for AI, email, and file storage
- Validation and DTO layers around shared contracts

---

# Shared Contracts

Shared contracts are a core architectural rule from the beginning.

The `packages/contracts` package currently demonstrates this pattern with starter Zod schemas and exported TypeScript types.

As the platform grows, all request/response contracts should be added there before implementation spreads across apps.

---

# Architectural Rules

The following rules apply to the foundation and future implementation:

- New product features should start with documentation in `docs/specs/`
- Shared domain models should live in `packages/contracts`
- Reusable UI should move into `packages/ui`
- Generic helpers should live in `packages/utils`
- App-specific business logic should stay inside the owning app/feature
- Third-party integrations should be wrapped behind providers or services

---

# Future Evolution

The current base is intentionally simple, but it is prepared to grow into:

- Full feature-based frontend modules
- Full feature-based backend modules
- Database and migration tooling
- Background job processing
- Multi-provider AI integrations
- Role-based access and organization workspaces

The foundation should reduce future rewrites, not accelerate premature complexity.