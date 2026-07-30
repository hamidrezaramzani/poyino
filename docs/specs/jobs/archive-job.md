# Archive Job Specification

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

- Job List
- Job Details
- Publish Job
- Unpublish Job
- Delete Job
- Candidate Management

## Existing Components

- Confirmation Dialog
- Badge
- Button
- Loading Button
- Toast
- Alert

---

# Overview

The Archive Job feature allows an organization to stop accepting new applications while preserving all existing job data and candidate records.

Archived jobs remain accessible in the dashboard but are hidden from the public career page.

---

# Business Goal

Allow recruiters to safely close completed or inactive job postings without losing historical recruitment data.

---

# Scope

Included in MVP

- Archive Job
- Archive Confirmation
- Hide Public Job
- Preserve Candidates

---

# Out of Scope

- Scheduled Archive
- Bulk Archive
- Archive Reason
- Automatic Archive Rules

---

# User Story

As an organization administrator,

I want to archive a job,

So that I can stop receiving applications while keeping all related recruitment information.

---

# User Flow

Job List

↓

Open Job

↓

Click Archive

↓

Confirmation Dialog

↓

Confirm

↓

Job Archived

↓

Job Status Updated

↓

Public Job Becomes Unavailable

---

# Access Rules

Only organization administrators can archive jobs.

Users cannot archive jobs owned by another organization.

---

# Archive Confirmation

Title

Archive Job

Description

Archiving this job will stop accepting new applications.

Existing candidates and recruitment data will remain available.

Buttons

- Cancel
- Archive

---

# Job Status

Before

- Draft
- Published

After

- Archived

---

# Public Behavior

Archived jobs

- Cannot receive new applications.
- Return **404 Not Found** on the public job page.
- Are excluded from public job listings.

---

# Dashboard Behavior

Archived jobs remain visible.

Users can

- View Details
- Edit
- Delete (only if there are no candidates)
- Unarchive (Future)

Archived jobs display an **Archived** badge.

---

# Candidate Behavior

Existing candidates remain unchanged.

Recruiters can continue to

- View candidates
- Update hiring status
- Schedule interviews
- Add notes
- Download resumes

---

# Validation Rules

Only jobs belonging to the current organization can be archived.

Jobs already archived cannot be archived again.

---

# Loading State

- Disable confirmation dialog.
- Display Loading Button.

---

# Success State

Toast

```text
Job archived successfully.
```

Job status updates immediately.

---

# Failure State

Unexpected errors appear using Toast.

---

# API Specification

## Archive Job

PATCH

/jobs/:jobId/archive

Authentication

Required

---

Success Response

HTTP 200

```json
{
  "success": true,
  "status": "ARCHIVED"
}
```

---

# Business Rules

- Archive never deletes data.
- Existing candidates remain accessible.
- Archived jobs are hidden from public pages.
- Archived jobs cannot receive new applications.
- Organization ownership must be verified.

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
- archivedAt
- updatedAt

No candidate data is modified.

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

- Archive Job Clicked
- Archive Confirmed
- Archive Cancelled
- Job Archived

---

# Storybook Components Used

- Confirmation Dialog
- Badge
- Button
- Loading Button
- Toast

---

# New Components Required

None

---

# Backend Tasks

- Archive Job Endpoint
- Authorization
- Update Job Status
- Hide Archived Jobs From Public APIs

---

# Frontend Tasks

- Archive Confirmation Dialog
- Archive API Integration
- Status Badge Update
- Refresh Job List

---

# Acceptance Criteria

- User can archive a job.
- Confirmation dialog is displayed.
- Archived jobs disappear from public pages.
- Existing candidates remain accessible.
- Archived badge is displayed.
- Unauthorized users cannot archive jobs.

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

- Unarchive Job
- Bulk Archive
- Archive Reason
- Automatic Archive Rules
- Archive History
```