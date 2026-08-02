# Interview Management Specification

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

- Candidate Profile
- Candidate List
- Candidate Tracking Page
- Calendar Integration (Future)
- Email Service

## Existing Components

- Card
- Modal
- Button
- Badge
- Date Picker
- Time Picker
- Select
- Textarea
- Alert
- Timeline

---

# Overview

Interview Management allows recruiters to schedule, update, cancel and complete interviews for candidates.

Every interview belongs to a single candidate and is displayed inside the Candidate Profile.

Scheduling or updating interviews automatically updates the candidate's application status and activity timeline.

---

# Business Goal

Provide recruiters with a simple workflow to manage interviews without leaving the recruitment system.

---

# Scope

Included in MVP

- Schedule Interview
- Edit Interview
- Cancel Interview
- Complete Interview
- Interview Notes
- Activity Timeline Integration

---

# Out of Scope

- Calendar Synchronization
- Google Calendar
- Outlook Calendar
- Zoom Integration
- Google Meet Integration
- Automated Reminder Emails
- Candidate Self Scheduling

---

# User Story

As a recruiter,

I want to manage candidate interviews,

So that I can keep the recruitment process organized.

---

# Entry Points

- Candidate Profile
- Candidate List (Future)

---

# Interview Lifecycle

```text
No Interview

↓

Schedule Interview

↓

Interview Scheduled

↓

Interview Completed

↓

Hiring Decision
```

Cancelled interviews remain in history.

---

# Interview Information

Required

- Date
- Time
- Interview Type

Optional

- Location
- Meeting Link
- Recruiter Notes

---

# Interview Types

Supported

- HR Interview
- Technical Interview
- Manager Interview
- Final Interview

Stored as configurable enum.

---

# Schedule Interview

Recruiter selects

- Date
- Time
- Interview Type

Optional

- Meeting URL
- Physical Location
- Notes

Save

Interview

Automatically update application status to

```
Interview Scheduled
```

Create timeline event.

---

# Edit Interview

Recruiter may update

- Date
- Time
- Type
- Location
- Meeting Link
- Notes

Every modification creates a timeline entry.

---

# Cancel Interview

Confirmation Dialog

Title

```
Cancel Interview?
```

Description

```
The interview will be marked as cancelled and remain in the candidate history.
```

Confirmation

Required

Status becomes

```
Cancelled
```

Timeline updated.

---

# Complete Interview

Recruiter marks interview as completed.

Optional

Interview Notes

Status automatically becomes

```
Interview Completed
```

Timeline updated.

---

# Interview Notes

Private

Visible only to recruiters.

Markdown is not supported.

Maximum Length

5000 characters.

---

# Validation

Required

- Date
- Time
- Interview Type

Meeting URL

Must be a valid URL.

Interview Date

Cannot be in the past.

---

# Activity Timeline

Every action creates an event.

Examples

- Interview Scheduled
- Interview Updated
- Interview Cancelled
- Interview Completed

Timeline stores

- Timestamp
- User
- Action

---

# Loading State

Display loading indicators during

- Save
- Update
- Cancel
- Complete

---

# Error States

Validation Errors

Displayed below each field.

Unexpected Errors

Toast

```
Something went wrong.
```

---

# API Specification

## Create Interview

POST

```
/jobs/:jobId/candidates/:candidateId/interviews
```

---

## Update Interview

PATCH

```
/jobs/:jobId/candidates/:candidateId/interviews/:interviewId
```

---

## Cancel Interview

PATCH

```
/jobs/:jobId/candidates/:candidateId/interviews/:interviewId/cancel
```

---

## Complete Interview

PATCH

```
/jobs/:jobId/candidates/:candidateId/interviews/:interviewId/complete
```

---

## Get Interviews

GET

```
/jobs/:jobId/candidates/:candidateId/interviews
```

---

# Business Rules

- A candidate may have multiple interviews.
- Completed interviews cannot be edited.
- Cancelled interviews remain in history.
- Scheduling an interview updates candidate status.
- Completing an interview updates candidate status.
- Every interview action creates a timeline event.

---

# Security

Authentication Required

Authorization Required

Interview data is organization-private.

---

# Database Impact

Create

- Interview

Update

- Candidate Status
- Timeline

Store

- Date
- Time
- Type
- Location
- Meeting URL
- Notes
- Status

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Accessible Date Picker
- Accessible Time Picker

---

# Internationalization

Supported Languages

- Persian
- English

Dates should respect the configured calendar system.

---

# Analytics Events

- Interview Scheduled
- Interview Updated
- Interview Cancelled
- Interview Completed

---

# Storybook Components Used

- Date Picker
- Time Picker
- Modal
- Card
- Button
- Select
- Textarea

---

# New Components Required

## Interview Card

Displays

- Date
- Time
- Type
- Status

---

## Interview Form Modal

Reusable for

- Create
- Edit

---

## Interview Timeline Item

Displays interview-related events.

---

# Backend Tasks

- Interview CRUD
- Candidate Status Synchronization
- Timeline Integration
- Validation

---

# Frontend Tasks

- Interview Form
- Edit Flow
- Cancel Flow
- Complete Flow
- Timeline Integration

---

# Acceptance Criteria

- Recruiters can schedule interviews.
- Recruiters can edit interviews before completion.
- Recruiters can cancel interviews.
- Recruiters can complete interviews.
- Candidate status updates automatically.
- Timeline reflects all interview events.
- The feature is fully responsive.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Timeline Integrated
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- Google Calendar Integration
- Outlook Calendar Integration
- Zoom Integration
- Google Meet Integration
- Automatic Email Invitations
- SMS Reminders
- Candidate Self Scheduling
- AI Suggested Interview Times
- AI Interview Evaluation