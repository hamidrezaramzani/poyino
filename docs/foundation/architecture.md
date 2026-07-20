# Architecture

## Purpose

Poyino follows a modular, feature-oriented architecture designed for long-term maintainability, scalability, and AI-assisted development.

The architecture prioritizes clear separation of responsibilities, reusable components, and specification-driven implementation.

---

# Architecture Principles

The project follows these architectural principles:

- Feature-Based Architecture
- Spec-Driven Development
- Component-Driven UI
- Separation of Concerns
- Reusability First
- Single Responsibility Principle
- Shared Contracts
- AI-Friendly Codebase
- Incremental Development

---

# High-Level Architecture

The system is divided into independent domains.

```text
                    +----------------+
                    |   React Web    |
                    +-------+--------+
                            |
                            |
                    REST API
                            |
                    +-------v--------+
                    |    NestJS API  |
                    +-------+--------+
                            |
          +-----------------+-----------------+
          |                 |                 |
     PostgreSQL        File Storage      AI Providers
```

Each layer is responsible for a single concern.

---

# Feature-Based Architecture

Both frontend and backend are organized by feature rather than technical layer.

Example:

```text
authentication/
jobs/
candidates/
dashboard/
settings/
```

Each feature owns its:

- UI
- Business Logic
- Validation
- Services
- Specifications

This minimizes coupling between unrelated modules.

---

# Specification-Driven Development

Every feature begins with a specification.

Development order:

Specification

↓

Sketch

↓

Storybook Components

↓

Implementation

↓

Review

No implementation should begin without an approved specification.

---

# Component-Driven Development

Reusable UI components are developed independently.

Every component must:

- Be reusable
- Be documented
- Have Storybook stories
- Be accessible
- Support Dark Mode

Business logic must never exist inside UI components.

---

# Shared Contracts

Frontend and Backend communicate through shared contracts.

Contracts define:

- Request Models
- Response Models
- Validation Rules
- Shared Types

The contract is the single source of truth.

---

# Separation of Responsibilities

Frontend

Responsible for:

- User Experience
- State Management
- Routing
- Forms
- Visualization

Backend

Responsible for:

- Business Rules
- Authentication
- Authorization
- AI Integration
- Database Access
- File Processing

---

# External Services

External services must always be accessed through dedicated providers.

Examples:

- AI Provider
- Email Provider
- Storage Provider

Business logic must never directly call third-party services.

---

# Scalability

The architecture should support future expansion without major restructuring.

Examples:

- Mobile applications
- Public APIs
- Multiple AI providers
- Payment systems
- Multi-workspace organizations
- Additional recruitment modules

---

# Architecture Rules

The following rules are mandatory:

- Every feature must have a specification.
- Every UI component must have Storybook documentation.
- Features should remain independent whenever possible.
- Shared contracts must be used between frontend and backend.
- Business logic must remain outside UI components.
- Third-party services must be abstracted behind providers.
- New features should not require modifications to unrelated modules.

---

# Future Evolution

The MVP intentionally focuses on a simple architecture while preserving clear extension points.

Future versions may introduce:

- Event-driven communication
- Background job processing
- Distributed services
- Multi-region deployment
- Dedicated AI workers

The current architecture should not prevent these future improvements.