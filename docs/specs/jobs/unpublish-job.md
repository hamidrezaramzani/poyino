# Publish Job Specification

Version: 1.0

Status: Approved

Owner: Product Team

Last Updated: 2026-07-30

---

# Dependencies

## Foundation

- architecture.md
- project-structure.md
- coding-standards.md
- naming-conventions.md
- technology-decisions.md

## Related Features

- Create Job
- Edit Job
- Job Details
- Job Expiration
- Public Job Page

## Existing Components

- Confirmation Dialog
- Badge
- Button
- Loading Button
- Alert
- Toast

---

# Overview

The Publish Job feature makes a draft job publicly available.

After publishing, the job receives a public URL where candidates can view the job description and submit their resumes.

---

# Business Goal

Allow organizations to publish completed job postings and begin receiving candidate applications.

---

# Scope

Included in MVP

- Publish Draft Job
- Validation Before Publishing
- Generate Public URL
- Update Job Status

---

# Out of Scope

- Scheduled Publishing
- Publish Approval Workflow
- Publish History
- Multi-stage Publishing

---

# User Story

As an organization administrator,

I want to publish a job,

So that candidates can find and apply for it.

---

# User Flow

Job Details

↓

Click Publish

↓

System Validates Job

↓

Confirmation Dialog

↓

Publish

↓

Generate Public URL

↓

Status Changes To Published

↓

Job Is Visible Publicly

---

# Access Rules

Only organization administrators can publish jobs.

Users cannot publish jobs owned by another organization.

---

# Publish Confirmation

Title

Publish Job

Description

This job will become publicly available and candidates will be able to submit applications.

Buttons

- Cancel
- Publish

---

# Validation Rules

Before publishing, the system validates:

Required

- Job Title
- Employment Type
- Workplace Type
- Description
- Number of Positions

Optional

- Salary
- Benefits
- Requirements
- Expiration Date

Publishing is blocked if validation fails.

---

# Job Status

Before

Draft

After

Published

---

# Public Behavior

After publishing

- Public URL becomes active.
- Job appears in the organization's career page.
- Candidates can submit resumes.
- Public API returns the job.

---

# Dashboard Behavior

Published jobs display a **Published** badge.

Available Actions

- View
- Edit
- Archive
- Unpublish
- Copy Public Link

---

# Public URL

Example

```text
https://app.example.com/jobs/abc123
```

The public URL remains stable until the job is deleted.

---

# Loading State

- Disable publish button.
- Display Loading Button.

---

# Success State

Toast

```text
Job published successfully.
```

Job status updates immediately.

Public URL becomes available.

---

# Failure State

Validation errors appear if required fields are missing.

Unexpected server errors appear using Toast.

---

# API Specification

## Publish Job

PATCH

/jobs/:jobId/publish

Authentication

Required

---

Success Response

HTTP 200

```json
{
  "success": true,
  "status": "PUBLISHED",
  "publicUrl": "/jobs/abc123"
}
```

---

# Business Rules

- Only Draft jobs can be published.
- Archived jobs cannot be published.
- Published jobs become immediately available to candidates.
- Publishing never changes the job ID.
- Public URL is generated only once.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation
- Rate Limiting

---

# Database Impact

Update

Job

Fields

- status
- publishedAt
- publicSlug
- updatedAt

---

# Accessibility

- Keyboard Navigation
- Screen Reader Labels
- Focus Trap Inside Dialog

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Publish Job Clicked
- Publish Confirmed
- Job Published
- Public URL Generated

---

# Storybook Components Used

- Confirmation Dialog
- Badge
- Button
- Loading Button
- Toast

---

# New Components Required

## Copy Button

Reusable button for copying the public job URL to the clipboard.

---

# Backend Tasks

- Publish Job Endpoint
- Validation Before Publishing
- Generate Public Slug
- Public URL Endpoint

---

# Frontend Tasks

- Publish Confirmation Dialog
- Publish API Integration
- Copy Public URL
- Status Badge Update

---

# Acceptance Criteria

- Draft jobs can be published.
- Required fields are validated before publishing.
- Public URL is generated.
- Published jobs are accessible publicly.
- Status changes to Published immediately.
- Unauthorized users cannot publish jobs.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Validation Completed
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified

---

# Future Improvements

- Scheduled Publishing
- Publish Preview
- SEO Metadata
- Social Share Preview
- Publish History
- Multi-language Public Pages