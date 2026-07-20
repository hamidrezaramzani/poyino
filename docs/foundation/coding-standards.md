# Coding Standards

## Purpose

This document defines the coding standards for the Poyino project.

Its purpose is to ensure consistency, readability, maintainability, and scalability across the entire codebase.

These rules apply to every package, application, and feature.

---

# General Principles

Follow these principles before writing code:

- Write readable code before clever code.
- Prefer simplicity over unnecessary abstraction.
- Keep functions small and focused.
- Avoid duplicated logic.
- Write self-documenting code.
- Optimize for maintainability rather than short-term speed.

---

# Single Responsibility

Every function, class, hook, component, and service should have only one responsibility.

Bad

A component that:

- Fetches data
- Handles business logic
- Renders UI

Good

- Service fetches data.
- Hook manages state.
- Component renders UI.

---

# Keep Files Small

Recommended limits:

- React Component ≤ 200 lines
- Hook ≤ 150 lines
- Service ≤ 200 lines
- Utility ≤ 100 lines

If a file grows too much, split it.

---

# Components

Components should:

- Be reusable.
- Be predictable.
- Receive data through props.
- Avoid business logic.
- Avoid API calls directly.

Business logic belongs in hooks or services.

---

# Hooks

Hooks should:

- Manage state.
- Encapsulate reusable logic.
- Never render UI.
- Never contain unrelated responsibilities.

---

# Services

Services are responsible for:

- HTTP requests
- Business operations
- Communication with external APIs

Services should never manipulate the UI.

---

# Repository Layer

Repositories are responsible only for database access.

Repositories must never contain business logic.

---

# Functions

Functions should:

- Do one thing.
- Have descriptive names.
- Return early whenever possible.
- Avoid deep nesting.

Maximum nesting depth:

3 levels.

---

# Comments

Write comments only when necessary.

Good comments explain "why".

Bad comments explain "what".

Example

Good

// Required because the AI provider returns inconsistent date formats.

Bad

// Increment counter

counter++;

---

# Magic Numbers

Avoid magic numbers.

Bad

timeout = 15000

Good

const EMAIL_TIMEOUT = 15000

---

# Constants

Reusable values should always be extracted into constants.

---

# Error Handling

Never ignore errors.

Every expected error should:

- Be handled.
- Return meaningful messages.
- Be logged when appropriate.

---

# Async Code

Prefer:

async / await

Avoid long promise chains.

---

# Imports

Order imports as follows:

1. External libraries
2. Internal packages
3. Relative imports

Example:

React

Third-party packages

@poyino/*

@/*

./relative

---

# TypeScript

Never use:

- any

Prefer:

- unknown
- Generics
- Inferred types

Always keep strict mode enabled.

---

# Shared Contracts

Never duplicate request or response models.

Always import shared contracts from:

packages/contracts

---

# Validation

Validation must be implemented using shared Zod schemas.

Validation logic should never be duplicated.

---

# Styling

Use Tailwind utility classes.

Avoid inline styles.

Avoid custom CSS unless necessary.

---

# State Management

Global state belongs in Redux Toolkit.

Server state belongs in TanStack Query.

Component state belongs in React.

---

# API Calls

Never call APIs directly inside components.

Always use feature services.

---

# Logging

Use structured logging.

Never leave console.log statements in production code.

---

# Security

Never expose:

- Secrets
- Tokens
- Credentials

Always validate user input.

Always sanitize uploaded files.

---

# Performance

Avoid unnecessary renders.

Lazy load when appropriate.

Memoize only when necessary.

Optimize after measuring.

---

# Documentation

Every new feature must include:

- Specification
- Storybook updates (if applicable)

---

# Code Review Checklist

Before merging:

- Feature follows its specification.
- No duplicated logic.
- Components are reusable.
- No business logic inside UI.
- Shared contracts are used.
- Imports are organized.
- ESLint passes.
- Prettier passes.
- Storybook updated if new components were added.

---

# Summary

Good code in Poyino should be:

- Simple
- Predictable
- Reusable
- Maintainable
- Type-safe
- Feature-oriented
- Specification-driven