# Technology Decisions

## Status

This document now separates the implemented foundation from planned technology layers.

---

## Implemented in the Foundation

### Monorepo

- Turborepo
- npm Workspaces

### Frontend Foundation

- React
- Vite
- TypeScript
- Shared local packages
- Plain CSS starter stylesheet

### Backend Foundation

- NestJS application structure
- TypeScript

### Shared Packages

- `@poyino/contracts`
- `@poyino/ui`
- `@poyino/utils`
- `@poyino/config`
- `@poyino/eslint-config`
- `@poyino/tsconfig`

### Validation

- Zod in shared contracts

### Code Quality

- Shared TypeScript presets
- Shared ESLint baseline
- Prettier planned at the workspace root

---

## Planned for the First Product Iterations

These technologies are still aligned with the product direction, but they are not fully wired into the starter scaffold yet.

### Frontend

- React Router
- Tailwind CSS
- Redux Toolkit
- TanStack Query
- Axios
- Storybook
- Dark Mode support
- i18n for Persian and English

### UI Layer

- shadcn/ui
- Radix UI
- Lucide React
- clsx
- Reusable upload/table primitives

### Backend

- Prisma
- PostgreSQL
- NestJS Zod
- `@nestjs/config`
- Pino

### Platform Services

- AWS S3 compatible object storage
- SMTP email delivery
- HttpOnly cookie authentication
- REST API conventions

---

## Decision Principles

Technology choices in Poyino should continue to follow these rules:

- Prefer technologies that support a modular monorepo
- Keep shared contracts as the source of truth
- Avoid coupling UI components to business logic
- Introduce infrastructure only when it supports a real product milestone
- Keep the foundation simple enough for fast iteration
