# Naming Conventions

## Purpose

This document defines the naming conventions used throughout the Poyino project.

Consistent naming improves readability, maintainability, and collaboration while reducing ambiguity across the codebase.

These conventions apply to all applications, packages, and documentation.

---

# General Principles

Follow these rules before naming anything:

- Use clear and descriptive names.
- Prefer full words over abbreviations.
- Avoid unnecessary prefixes or suffixes.
- Keep naming consistent across the project.
- A name should describe its purpose, not its implementation.

---

# Language

All code, filenames, folders, APIs, database tables, variables, and documentation must use English.

User-facing text should support internationalization (i18n).

---

# Folder Names

Use:

kebab-case

Examples

```text
authentication/
job-management/
candidate-profile/
shared-components/
```

---

# File Names

Use:

kebab-case

Examples

```text
login-form.tsx
job-card.tsx
candidate-table.tsx
create-job.service.ts
```

---

# React Components

Use:

PascalCase

Examples

```tsx
LoginForm
JobCard
CandidateTable
ResumeUploader
```

Component file:

```text
login-form.tsx
```

Component name:

```tsx
LoginForm
```

---

# Hooks

Always begin with:

use

Examples

```tsx
useLogin()
useJobs()
useCandidateSearch()
```

Files

```text
use-login.ts
use-jobs.ts
```

---

# Services

Use:

feature.service.ts

Examples

```text
authentication.service.ts
jobs.service.ts
candidates.service.ts
```

Class

```ts
AuthenticationService
```

---

# Redux

Slice

```text
authentication.slice.ts
jobs.slice.ts
```

Selectors

```ts
selectCurrentUser
selectJobs
selectCandidates
```

Actions

Use verbs.

Examples

```ts
login()

logout()

createJob()

deleteJob()
```

---

# API Endpoints

Use:

REST conventions

Plural resources

Examples

```text
POST   /auth/login

POST   /auth/register

GET    /jobs

POST   /jobs

PATCH  /jobs/:id

DELETE /jobs/:id

GET    /candidates

POST   /candidates
```

Avoid

```text
/getJobs

/createCandidate
```

---

# Database

Tables

snake_case

Examples

```text
organizations

jobs

candidates

candidate_notes

interview_sessions
```

Columns

snake_case

Examples

```text
organization_name

created_at

updated_at

is_verified
```

---

# Prisma Models

Use PascalCase.

Examples

```prisma
Organization

Job

Candidate

InterviewSession
```

---

# Variables

Use camelCase.

Examples

```ts
organizationName

currentUser

jobList

candidateScore
```

Avoid abbreviations.

Bad

```ts
usr
org
tmp
```

Good

```ts
user
organization
temporaryFile
```

---

# Constants

Use:

UPPER_SNAKE_CASE

Examples

```ts
MAX_FILE_SIZE

DEFAULT_LANGUAGE

EMAIL_TOKEN_EXPIRATION
```

---

# Enums

Use PascalCase.

Members

UPPER_SNAKE_CASE

Example

```ts
enum CandidateStatus {

PENDING,

INTERVIEW,

HIRED,

REJECTED

}
```

---

# Interfaces

Do not prefix with "I".

Bad

```ts
IUser
```

Good

```ts
User
```

---

# Types

Use PascalCase.

Examples

```ts
User

CandidateSummary

JobFilters
```

---

# Zod Schemas

Use:

FeatureSchema

Examples

```ts
RegisterSchema

CreateJobSchema

CandidateSchema
```

Files

```text
register.schema.ts

create-job.schema.ts
```

---

# DTOs

Generated using NestJS Zod.

Naming

```text
RegisterDto

LoginDto

CreateJobDto
```

---

# Storybook

Story title

```text
Forms/LoginForm

Jobs/JobCard

Candidates/CandidateTable
```

Story file

```text
login-form.stories.tsx
```

---

# Environment Variables

Use:

UPPER_SNAKE_CASE

Examples

```text
DATABASE_URL

JWT_SECRET

SMTP_HOST

SMTP_PORT

AWS_ACCESS_KEY_ID

AWS_SECRET_ACCESS_KEY

AWS_BUCKET_NAME
```

---

# Documentation

Specifications

kebab-case

Examples

```text
register.md

login.md

candidate-list.md

job-details.md
```

---

# Git Branches

Use:

feature/

fix/

refactor/

docs/

Examples

```text
feature/authentication

feature/job-management

fix/login-validation

docs/architecture
```

---

# Commit Messages

Follow Conventional Commits.

Examples

```text
feat(auth): add register endpoint

fix(jobs): resolve pagination bug

docs(spec): add candidate management

refactor(api): simplify authentication service
```

---

# Reserved Words

Avoid using framework or language reserved keywords.

Examples

Avoid

```ts
class

function

default

package
```

---

# Abbreviations

Avoid abbreviations unless they are universally accepted.

Allowed

```text
API

URL

HTTP

JWT

DTO

UI

UX

PDF

AI
```

Avoid

```text
usr

cfg

tmp

svc
```

---

# Summary

Naming should always be:

- Clear
- Consistent
- Predictable
- Descriptive
- English