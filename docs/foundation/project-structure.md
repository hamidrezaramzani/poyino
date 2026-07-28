# Project Structure

## Purpose

This document defines the directory structure of the Poyino monorepo and establishes clear rules for organizing source code.

The primary goal is to keep the codebase scalable, predictable, and easy to navigate as the project grows.

---

# Repository Structure

```text
.
├── apps/
│   ├── api/
│   └── web/
│
├── packages/
│   ├── config/
│   ├── contracts/
│   ├── eslint-config/
│   ├── tsconfig/
│   ├── ui/
│   ├── utils/
│
├── docs/
├── .gitignore
├── package.json
├── tsconfig.json
├── turbo.json
└── README.md
```

---

# Applications

## apps/web

Contains the React + Vite starter application.

Responsibilities:

- User Interface
- Shared package consumption
- Future feature modules
- Future routing/state layers

---

## apps/api

Contains the backend starter structured for NestJS.

Responsibilities:

- Application bootstrap
- Module composition
- Health checks
- Future business modules

---

# Shared Packages

## packages/contracts

Shared validation schemas and TypeScript types.

Contains:

- Zod Schemas
- Shared Types
- Request Models
- Response Models

Used by both frontend and backend.

This package is the single source of truth for data contracts.

---

## packages/ui

Reusable UI components.

Examples:

- Button
- Card
- Future form and data-display primitives

Storybook support is planned for the next UI iteration.

---

## packages/utils

Shared utility functions.

Examples:

- Formatting helpers
- Slug helpers
- Future shared utility functions

Business logic must never be placed here.

---

## packages/config

Shared configuration.

Examples:

- Brand colors
- Product metadata
- Future runtime configuration

---

## packages/eslint-config

Shared ESLint configuration.

---

## packages/tsconfig

Shared TypeScript configurations.

---

# Frontend Structure

```text
src/
├── app.tsx
├── main.tsx
└── styles.css
```

The current frontend is intentionally minimal.

The target structure for future feature work is:

```text
src/
├── features/
├── routes/
├── store/
├── shared/
└── styles/
```

---

## Feature Structure

Every feature should follow the same structure.

Example:

```text
jobs/

components/

pages/

hooks/

services/

store/

schemas/

types/
```

Responsibilities:

components/

Reusable components for the feature.

pages/

Feature pages.

hooks/

Feature-specific hooks.

services/

API communication.

store/

Redux slices.

schemas/

Zod schemas.

types/

Feature-specific types.

---

# Backend Structure

```text
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

The current backend is a bootstrap shell.

The target structure for backend feature work is:

```text
src/
├── authentication/
├── jobs/
├── candidates/
├── organization/
├── settings/
└── common/
```

---

## Backend Feature Structure

Example:

```text
jobs/

controllers/

services/

repositories/

dto/

entities/

mappers/

interfaces/
```

Responsibilities:

controllers/

HTTP endpoints.

services/

Business logic.

repositories/

Database access.

dto/

Request/Response models.

entities/

Database entities.

mappers/

Model transformations.

interfaces/

Feature interfaces.

---

# Documentation Structure

```text
docs/
├── foundation/
├── brand/
├── specs/
├── api/
├── database/
├── architecture/
└── ui-ux/
```

---

# Specification Structure

Every feature specification should be stored inside:

```text
docs/specs/
```

Example:

```text
authentication/

register.md

login.md

forgot-password.md

reset-password.md
```

---

# Assets

Frontend assets should be placed inside:

```text
assets/

images/

icons/

fonts/
```

---

# Import Rules

Always prefer absolute imports.

Example:

```ts
import { Button } from "@poyino/ui";
```

Avoid deep relative imports.

Bad:

```ts
../../../components/Button
```

Good:

```ts
@/features/jobs/components/Button
```

---

# Folder Rules

- Organize code by feature.
- Avoid generic folders containing unrelated files.
- Keep related files close together.
- Every feature owns its components.
- Shared code belongs inside packages.
- Avoid circular dependencies.

---

# Scalability

The project structure should support future additions without major restructuring.

Examples:

- Mobile applications
- Admin panel
- Public API
- AI workers
- Background jobs
- Payment system

---

# Summary

The project structure is designed around:

- Feature-Based Organization
- Shared Packages
- Predictable Folder Layout
- High Reusability
- Long-Term Scalability