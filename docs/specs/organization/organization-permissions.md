# Permissions Specification

Version: 1.0

Status: Approved

Owner: Product Team

Last Updated: 2026-08-02

---

# Dependencies

## Foundation

- architecture.md
- project-structure.md
- coding-standards.md
- naming-conventions.md
- technology-decisions.md

## Related Features

- Organization Profile
- Members
- Departments
- Roles
- Authentication
- Audit Log

---

# Overview

Permissions define **which operations a member may perform** within the organization.

Permissions are determined by two dimensions:

1. **Role** (What actions are allowed?)
2. **Department Scope** (Which data is accessible?)

Both conditions must be satisfied before granting access.

---

# Business Goal

Provide a secure, predictable and scalable authorization model across the platform.

---

# Scope

Included in MVP

- Permission Matrix
- Resource-based Permissions
- Department Scope Enforcement
- Backend Authorization
- Frontend Permission Guards

---

# Out of Scope

- Custom Permissions
- Dynamic Policies
- Attribute-Based Access Control (ABAC)
- Temporary Permissions

---

# User Story

As a system administrator,

I want permissions to be enforced consistently,

So that members only access resources they are authorized to use.

---

# Permission Model

Every authorization decision evaluates

```
User

↓

Role

+

Department

↓

Permission Granted
```

Both checks must pass.

---

# Resource Categories

Permissions are grouped by resource.

Resources

- Organization
- Departments
- Members
- Jobs
- Candidates
- Interviews
- Hiring
- Dashboard
- Settings
- AI
- Reports

---

# Permission Types

Supported actions

- View
- Create
- Update
- Delete
- Manage
- Export

---

# Permission Matrix

## Organization

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| View | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Departments

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Update | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Archive | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Members

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| View | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Invite | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Suspend | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## Jobs

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Publish | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Candidates

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bookmark | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Export | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## Interviews

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Schedule | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Complete | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Add Notes | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## Hiring

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| View | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Make Decision | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send Offer | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

---

## AI

| Action | Owner | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|--------|:-----:|:------:|:---------:|:---------------:|:-----------:|:------:|
| Generate | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Results | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

# Department Scope

Permissions are always filtered by department.

Example

```
Engineering Recruiter

↓

Engineering Jobs

✅

Warehouse Jobs

❌
```

---

# Frontend Authorization

The frontend must hide actions that the user cannot perform.

Examples

- Hide "Delete Job"
- Hide "Invite Member"
- Hide "Organization Settings"

This improves UX but is **not** a security boundary.

---

# Backend Authorization

Every protected endpoint must verify

1. Authentication
2. Organization
3. Department Scope
4. Role Permission

Backend validation is mandatory.

---

# Unauthorized Access

Return

HTTP 403

Response

```json
{
  "message": "You do not have permission to perform this action."
}
```

---

# API Integration

Every authenticated request contains

- User ID
- Organization ID
- Department ID
- Role

Authorization middleware evaluates permissions before executing business logic.

---

# Business Rules

- Every member has exactly one role.
- Every member belongs to one department.
- Department scope is always enforced.
- Backend authorization is mandatory.
- Frontend authorization is optional UI enhancement.
- Owners always have unrestricted access.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

Department Isolation

Audit Logging for permission failures (Future)

---

# Database Impact

Read

- User
- Role
- Department

No dedicated Permission table is required in MVP.

Permissions are defined statically in the application.

Future versions may move permissions into the database.

---

# Accessibility

Not applicable.

Permission changes should not reduce accessibility.

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Permission Denied
- Unauthorized Attempt
- Protected Resource Access

---

# Backend Tasks

- Authorization Middleware
- Permission Matrix
- Department Scope Validation
- Route Guards

---

# Frontend Tasks

- Permission Guards
- Conditional Rendering
- Route Protection
- Action Visibility

---

# Acceptance Criteria

- Role permissions are enforced.
- Department scope is enforced.
- Unauthorized actions return HTTP 403.
- Frontend hides inaccessible actions.
- Backend always validates permissions.
- Feature works consistently across all modules.

---

# Definition of Done

- Authorization Middleware Implemented
- Frontend Guards Implemented
- Department Scope Verified
- Security Review Completed
- Integration Tests Passed

---

# Future Improvements

- Custom Roles
- Custom Permissions
- Permission Groups
- Attribute-Based Access Control (ABAC)
- Temporary Permissions
- Time-Based Permissions
- Permission Audit Dashboard