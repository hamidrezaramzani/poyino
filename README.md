# Poyino

AI-powered recruitment platform that helps organizations discover, evaluate, and hire the best talent.

## Current State

This repository now contains the Poyino project foundation:

- Monorepo workspace with `apps/*` and `packages/*`
- Starter `web` app built around React + Vite
- Starter `api` app structured for NestJS
- Shared packages for contracts, UI, utilities, config, ESLint, and TypeScript presets
- Product and engineering foundation docs inside `docs/`

The goal of this stage is to establish a clean, scalable base before feature implementation begins.

## Workspace Layout

```text
.
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── config/
│   ├── contracts/
│   ├── eslint-config/
│   ├── tsconfig/
│   ├── ui/
│   └── utils/
├── docs/
├── package.json
├── tsconfig.json
└── turbo.json
```

## Apps

### `apps/web`

Frontend starter application for the recruiter-facing product.

Current responsibilities:

- Render the initial application shell
- Consume shared UI/config/contracts packages
- Serve as the base for future feature folders

### `apps/api`

Backend starter application for platform services.

Current responsibilities:

- Boot the NestJS application
- Expose a health endpoint
- Provide the baseline module/controller/service structure

## Shared Packages

### `packages/contracts`

Shared Zod schemas and TypeScript types that will act as the contract between frontend and backend.

### `packages/ui`

Reusable UI building blocks for the future design system.

### `packages/utils`

Framework-agnostic helpers and shared utility functions.

### `packages/config`

Shared product metadata and design tokens such as brand colors.

### `packages/eslint-config`

Shared lint configuration for all workspaces.

### `packages/tsconfig`

Shared TypeScript base, React app, and Node app presets.

## Documentation

Important docs:

- `docs/vision.md`
- `docs/principles.md`
- `docs/features.md`
- `docs/roadmap.md`
- `docs/foundation/architecture.md`
- `docs/foundation/project-structure.md`
- `docs/foundation/technology-decisions.md`
- `docs/foundation/coding-standards.md`
- `docs/foundation/naming-conventions.md`

## Next Phase

After this foundation layer, the next implementation phase should focus on:

1. Installing the selected toolchain
2. Adding shared build/lint/test scripts
3. Creating the first feature specifications in `docs/specs/`
4. Implementing authentication and organization management