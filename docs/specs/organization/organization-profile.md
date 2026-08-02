# Organization Profile Specification

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

- Authentication
- Departments
- Members
- Invitations
- Roles
- Permissions
- Branding
- Organization Settings

## Existing Components

- Card
- Form
- Input
- Textarea
- Select
- Upload
- Button
- Avatar
- Skeleton
- Alert

---

# Overview

Every workspace belongs to exactly one Organization.

The organization is the highest-level entity within the platform.

All jobs, candidates, departments, members, interviews, analytics and AI resources belong to an organization.

The organization owner is created automatically when the workspace is created.

---

# Business Goal

Provide organizations with a centralized identity and ownership model while supporting collaboration between multiple members.

---

# Scope

Included in MVP

- Organization Profile
- Organization Logo
- Organization Name
- Industry
- Company Size
- Website
- Description
- Timezone
- Default Language
- Owner Information

---

# Out of Scope

- Billing
- Subscription Management
- Multi-workspace Support
- Custom Domains

---

# User Story

As an organization owner,

I want to configure my organization,

So that my team has a centralized workspace with shared settings.

---

# Route

```
/dashboard/settings/organization
```

Authentication

Required

Permissions

Owner

Administrator

---

# Organization Entity

Each organization contains

- Departments
- Members
- Jobs
- Candidates
- Interviews
- Analytics
- AI Usage
- Storage

Everything belongs to exactly one organization.

---

# Organization Owner

The first registered user automatically becomes

```
Organization Owner
```

The owner has unrestricted access.

Only one owner exists in MVP.

Future versions may support ownership transfer.

---

# Organization Profile

Fields

## Organization Name

Required

Maximum

100 characters

Examples

- Acme Inc.
- Porosys
- FutureTech

---

## Logo

Optional

Supported

- PNG
- JPG
- SVG
- WebP

Maximum Size

5 MB

---

## Description

Optional

Maximum

1000 characters

Displayed internally.

---

## Industry

Optional

Examples

- Software
- Healthcare
- Finance
- Manufacturing
- Retail
- Education

---

## Company Size

Optional

Values

- 1–10
- 11–50
- 51–200
- 201–500
- 500+

---

## Website

Optional

Must be a valid URL.

---

## Timezone

Required

Used for

- Interviews
- Notifications
- Audit Logs

Default

UTC

---

## Default Language

Required

Supported

- English
- Persian

Used as the default language for

- Emails
- AI Output
- Dashboard

Users may override their own language later.

---

# Organization Identity

The organization name and logo are used throughout the application.

Examples

- Dashboard Header
- Email Templates
- Candidate Tracking Page
- Interview Invitations
- Offer Letters (Future)

---

# Workspace Ownership

Every resource belongs to an organization.

Examples

```
Organization

↓

Departments

↓

Jobs

↓

Candidates

↓

Interview Processes
```

No resource may exist outside an organization.

---

# Organization Visibility

Organization information is visible only to organization members.

Public candidates never see

- Internal description
- Company size
- Internal settings

Only approved public branding is exposed.

---

# Update Organization

Owners and administrators can update

- Name
- Logo
- Description
- Website
- Industry
- Company Size
- Timezone
- Default Language

Changes are immediately reflected across the workspace.

---

# Delete Organization

Not supported in MVP.

Future implementation may require

- Owner confirmation
- Data export
- Permanent deletion

---

# Validation

Required

- Organization Name
- Timezone
- Default Language

Website

Must be a valid HTTPS URL.

Logo

Supported image formats only.

---

# Loading State

Display organization profile skeleton while loading.

---

# Error States

Validation Errors

Displayed below the corresponding fields.

Unexpected Errors

Toast

```
Something went wrong.
```

---

# API Specification

## Get Organization

GET

```
/organization
```

---

## Update Organization

PATCH

```
/organization
```

---

## Upload Organization Logo

POST

```
/organization/logo
```

---

# Business Rules

- Every workspace belongs to one organization.
- Every organization has exactly one owner in MVP.
- Organization name is required.
- Organization logo is optional.
- Only owners and administrators can edit organization settings.
- Organization settings affect all members.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

Users may only access their own organization.

---

# Database Impact

Create

- Organization

Store

- Name
- Logo
- Description
- Industry
- Website
- Company Size
- Timezone
- Default Language
- Owner

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Accessible Forms
- Accessible Upload Component

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Organization Created
- Organization Updated
- Organization Logo Updated

---

# Storybook Components Used

- Card
- Form
- Input
- Upload
- Button
- Avatar
- Alert

---

# New Components Required

## Organization Profile Card

Displays

- Logo
- Name
- Industry
- Company Size
- Website

---

## Organization Settings Form

Allows editing organization information.

Reusable across future settings pages.

---

# Backend Tasks

- Organization CRUD
- Logo Upload
- Validation
- Organization Ownership

---

# Frontend Tasks

- Organization Settings Page
- Organization Profile Form
- Logo Upload
- Validation
- Loading States

---

# Acceptance Criteria

- Organization owner is created automatically.
- Owners and administrators can update organization information.
- Organization logo can be uploaded.
- Organization settings are reflected across the application.
- The feature is fully responsive.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- Organization Verification
- Ownership Transfer
- Multiple Workspaces
- Subscription & Billing
- Custom Domains
- Custom Branding
- Multiple Logos
- Legal Information
- Tax Information
- Public Company Profile