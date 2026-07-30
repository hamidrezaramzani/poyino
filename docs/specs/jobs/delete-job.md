# Delete Job Specification

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
- Archive Job
- Candidate Management

## Existing Components

- Confirmation Dialog
- Button
- Loading Button
- Alert
- Toast

---

# Overview

The Delete Job feature allows an organization administrator to permanently remove a job posting from the system.

Deleting a job is an irreversible operation.

To prevent accidental data loss, the user must explicitly confirm the deletion.

---

# Business Goal

Allow organizations to permanently remove jobs that are no longer needed while preventing accidental deletion.

---

# Scope

Included in MVP

- Delete Job
- Confirmation Dialog
- Authorization
- Validation

---

# Out of Scope

- Soft Delete
- Restore Deleted Job
- Scheduled Deletion
- Bulk Delete

---

# User Story

As an organization administrator,

I want to permanently delete a job,

So that outdated or mistakenly created jobs are removed from my organization.

---

# User Flow

Job List

↓

Open Job

↓

Click Delete

↓

Confirmation Dialog

↓

Confirm

↓

Delete Job

↓

Redirect To Job List

---

# Access Rules

Only organization administrators can delete jobs.

Users cannot delete jobs belonging to another organization.

---

# Delete Confirmation

Title

Delete Job

Description

Are you sure you want to permanently delete this job?

This action cannot be undone.

Buttons

- Cancel
- Delete

Delete button uses the destructive style.

---

# Validation Rules

A job **cannot** be deleted if it has one or more submitted candidates.

If the job has applicants, the API returns an error.

Instead, the user should archive the job.

---

# Error Message

```text
This job has submitted candidates and cannot be deleted. Archive it instead.
```

---

# Loading State

- Disable dialog buttons.
- Show Loading Button.

---

# Success State

Toast

```text
Job deleted successfully.
```

Redirect

/jobs

---

# Failure State

Unexpected errors appear using Toast.

---

# API Specification

## Delete Job

DELETE

/jobs/:jobId

Authentication

Required

---

Success Response

HTTP 204

No Response Body

---

Failure Response

HTTP 409

```json
{
  "message": "Job has candidates."
}
```

---

# Business Rules

- Deletion is permanent.
- Deleted jobs cannot be restored.
- Jobs with candidates cannot be deleted.
- Only Draft jobs or Published jobs without candidates may be deleted.
- Deleted jobs immediately disappear from all lists.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation
- Rate Limiting

---

# Database Impact

Delete

- Job
- JobSkills

Do Not Delete

- Organization
- Candidates
- Uploaded Files

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

- Delete Job Clicked
- Delete Job Confirmed
- Delete Job Cancelled
- Job Deleted

---

# Storybook Components Used

- Confirmation Dialog
- Button
- Loading Button
- Alert

---

# New Components Required

None

---

# Backend Tasks

- Delete Job Endpoint
- Ownership Validation
- Candidate Existence Validation

---

# Frontend Tasks

- Delete Confirmation Dialog
- Delete API Integration
- Redirect After Delete
- Error Handling

---

# Acceptance Criteria

- User can delete a job with no candidates.
- Confirmation dialog is displayed.
- Jobs with candidates cannot be deleted.
- Successful deletion redirects to Job List.
- Unauthorized users cannot delete jobs.
- Deleted jobs are removed immediately from the UI.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Validation Completed
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified

---

# Future Improvements

- Soft Delete
- Restore Deleted Job
- Bulk Delete
- Scheduled Cleanup
- Audit Log
```