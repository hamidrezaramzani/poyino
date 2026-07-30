# Job Expiration Specification

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
- Publish Job
- Archive Job
- Notification Settings
- Public Job Page

## Existing Components

- Date Picker
- Badge
- Card
- Alert
- Button
- Loading Button
- Toast
- Confirmation Dialog

---

# Overview

The Job Expiration feature allows organizations to define an optional expiration date for a published job.

After the expiration date is reached, the job automatically stops accepting new applications and becomes unavailable on the public careers page.

The job and all associated candidate data remain available inside the dashboard.

---

# Business Goal

Ensure that outdated job postings are automatically closed without requiring manual intervention.

---

# Scope

Included in MVP

- Set Expiration Date
- Automatic Job Expiration
- Expired Status
- Public Job Deactivation
- Expiration Reminder Notification

---

# Out of Scope

- Recurring Expiration
- Automatic Republish
- Custom Expiration Rules
- Bulk Expiration

---

# User Story

As an organization administrator,

I want to specify when a job should expire,

So that old job postings automatically stop accepting applications.

---

# User Flow

Create/Edit Job

↓

Select Expiration Date (Optional)

↓

Publish Job

↓

Expiration Date Reached

↓

Job Automatically Expires

↓

Public Page Disabled

↓

Recruiter Receives Notification

---

# Job Status

Available Statuses

- Draft
- Published
- Archived

Expiration **does not create a new status**.

Instead,

An expired job remains **Published** internally but is marked as **Expired**.

The UI displays an **Expired** badge.

---

# Expiration Rules

Expiration Date

Optional

If empty

The job never expires automatically.

If provided

The job expires at

23:59

of the selected day using the organization's configured timezone.

---

# Public Behavior

Expired jobs

- Do not appear on the public careers page.
- Public URL returns **404 Not Found**.
- Cannot receive new applications.

---

# Dashboard Behavior

Expired jobs remain fully accessible.

Recruiters can

- View Job
- Edit Job
- Extend Expiration Date
- Archive Job
- Delete Job (if eligible)

---

# Candidate Behavior

Existing candidates remain unchanged.

Recruiters may continue to

- Review resumes
- Update hiring status
- Schedule interviews
- Hire candidates

---

# Notifications

If enabled in Notification Settings,

Send an email

3 days before expiration.

No email is sent after expiration.

---

# UI

Display

Expiration Date

Example

```
Expires on
2026-09-15
```

If expired

Display Badge

Expired

Color

Warning

---

# Validation Rules

Expiration Date

- Cannot be earlier than today.
- Can be removed.
- Optional.

---

# Loading State

- Disable expiration controls while saving.
- Display Loading Button.

---

# Success State

Toast

```text
Expiration date updated successfully.
```

---

# Failure State

Validation errors appear below the field.

Unexpected errors appear using Toast.

---

# API Specification

## Update Expiration

PATCH

/jobs/:jobId/expiration

Authentication

Required

---

Request

```json
{
  "expirationDate": "2026-09-15"
}
```

---

Success Response

HTTP 200

```json
{
  "success": true
}
```

---

# Automatic Background Process

Runs periodically.

Checks

Published jobs with expiration dates.

If

Expiration Date < Current DateTime

Then

- Disable public visibility.
- Reject new applications.
- Mark job as expired.

No candidate data is modified.

---

# Business Rules

- Expiration is optional.
- Expired jobs remain editable.
- Public applications are blocked immediately after expiration.
- Existing candidates remain available.
- Extending the expiration date reactivates the public job immediately if it was previously expired.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation

---

# Database Impact

Update

Job

Fields

- expirationDate
- updatedAt

Derived Property

- isExpired

---

# Accessibility

- Keyboard Navigation
- Screen Reader Labels
- Visible Focus States

---

# Internationalization

Supported Languages

- Persian
- English

Dates should follow the organization's configured locale and timezone.

---

# Analytics Events

- Expiration Date Set
- Expiration Date Updated
- Job Expired
- Expiration Reminder Sent

---

# Storybook Components Used

- Date Picker
- Badge
- Card
- Alert
- Button
- Loading Button

---

# New Components Required

None

---

# Backend Tasks

- Update Expiration Endpoint
- Expiration Background Job
- Reminder Email Scheduler
- Public Visibility Validation

---

# Frontend Tasks

- Expiration Date Picker
- Expired Badge
- Expiration Warning
- API Integration

---

# Acceptance Criteria

- User can optionally set an expiration date.
- Expired jobs are automatically hidden from public pages.
- New applications cannot be submitted after expiration.
- Existing candidates remain accessible.
- Reminder emails are sent 3 days before expiration.
- Expiration date can be updated or removed.
- Updating the expiration date reactivates an expired published job.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Background Scheduler Implemented
- Email Reminder Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified

---

# Future Improvements

- Custom Reminder Schedule
- Automatic Archive After Expiration
- Bulk Expiration Updates
- Expiration Analytics
- Calendar Integration
- Auto Republish