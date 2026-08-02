# Interview Process Specification

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
- Candidate Tracking Page
- Interview Calendar
- Interview AI
- Email Service

## Existing Components

- Card
- Badge
- Timeline
- Button
- Modal
- Date Picker
- Time Picker
- Select
- Textarea
- Alert
- Tabs

---

# Overview

An Interview Process represents the complete interview journey of a candidate for a specific job application.

Instead of treating interviews as isolated events, the system groups them into a single interview process.

Each interview process may contain one or more interview stages.

Examples

- HR Interview
- Technical Interview
- Team Lead Interview
- Final Interview

The process continues until a hiring decision is made.

---

# Business Goal

Provide recruiters with a structured interview workflow while giving candidates clear visibility into upcoming interviews and recruitment progress.

---

# Scope

Included in MVP

- Create Interview Stage
- Edit Interview Stage
- Cancel Interview Stage
- Complete Interview Stage
- Internal Notes
- Candidate Notes
- Interview Timeline
- Interview Process Status

---

# Out of Scope

- Calendar View
- AI Interview Question Generation
- Calendar Synchronization
- Automatic Reminder Emails

---

# User Story

As a recruiter,

I want to manage the complete interview journey of a candidate,

So that multiple interviews remain organized under a single recruitment process.

---

# Data Model

```
Application

↓

Interview Process

↓

Interview Stage

↓

Notes

↓

Timeline
```

---

# Route

```
/dashboard/jobs/:jobId/candidates/:candidateId/interviews
```

Authentication

Required

Permissions

Recruiter

Administrator

---

# Interview Process

One Interview Process belongs to

- One Application

One Interview Process contains

- One or More Interview Stages

---

# Interview Stage

Required Fields

- Stage Name
- Interview Type
- Scheduled Date
- Scheduled Time

Optional

- Recruiter
- Meeting Link
- Physical Location
- Internal Notes
- Candidate Notes

---

# Interview Types

Supported

- HR Interview
- Technical Interview
- Team Lead Interview
- Manager Interview
- Final Interview
- Custom

---

# Interview Stage Status

Possible Values

- Scheduled
- In Progress
- Completed
- Cancelled
- No Show

---

# Interview Process Status

Possible Values

- Waiting
- Interviewing
- Passed
- Failed
- Hired

The process status is automatically updated based on interview outcomes.

---

# Candidate Visibility

The candidate should only see

- Interview Date
- Interview Time
- Meeting Link
- Physical Location
- Candidate Notes
- Current Interview Status

The candidate must never see

- Internal Notes
- Evaluation
- Recruiter Comments
- AI Analysis

---

# Internal Notes

Visible only to recruiters.

Examples

- Candidate appeared nervous.
- Strong communication.
- Weak React knowledge.

Unlimited updates.

---

# Candidate Notes

Visible on the private tracking page.

Examples

- Please join 10 minutes earlier.
- Bring your national ID.
- Meeting link will become active shortly before the interview.

These notes should always remain professional.

---

# Interview Timeline

Every action generates a timeline event.

Examples

Interview Scheduled

↓

Interview Updated

↓

Interview Started

↓

Interview Completed

↓

Interview Passed

---

# Schedule Interview

Required

- Date
- Time
- Interview Type

Optional

- Recruiter
- Location
- Meeting Link
- Internal Notes
- Candidate Notes

After creation

Interview Status

↓

Scheduled

Application Status

↓

Interview Scheduled

Timeline Event Created

---

# Edit Interview

Recruiters may update

- Date
- Time
- Meeting Link
- Location
- Recruiter
- Notes

Every modification creates a timeline entry.

---

# Cancel Interview

Confirmation Required

Interview Status

↓

Cancelled

Application Status remains unchanged.

Timeline updated.

---

# Complete Interview

Recruiter marks interview as completed.

Interview Status

↓

Completed

Recruiter may optionally define

Interview Result

- Passed
- Failed
- Pending

If Passed

Recruiter may immediately create the next interview stage.

---

# Multiple Interview Stages

Example

```
HR Interview

↓

Technical Interview

↓

Team Lead Interview

↓

Final Interview
```

Each interview remains connected to the same Interview Process.

The candidate experiences a single hiring journey.

---

# Hiring Decision

After the final interview

Recruiter selects

- Hire
- Reject

Application Status updates automatically.

---

# Validation

Required

- Interview Type
- Date
- Time

Meeting URL

Must be a valid URL.

Interview date

Cannot be in the past.

---

# Loading State

Display loading indicators while

- Creating
- Updating
- Cancelling
- Completing

---

# Error States

Validation Errors

Display below corresponding fields.

Unexpected Errors

Toast

```
Something went wrong.
```

---

# API Specification

## Get Interview Process

GET

```
/jobs/:jobId/candidates/:candidateId/interviews
```

---

## Create Interview Stage

POST

```
/jobs/:jobId/candidates/:candidateId/interviews
```

---

## Update Interview Stage

PATCH

```
/jobs/:jobId/candidates/:candidateId/interviews/:interviewId
```

---

## Complete Interview Stage

PATCH

```
/jobs/:jobId/candidates/:candidateId/interviews/:interviewId/complete
```

---

## Cancel Interview Stage

PATCH

```
/jobs/:jobId/candidates/:candidateId/interviews/:interviewId/cancel
```

---

# Business Rules

- Every application owns one interview process.
- An interview process may contain multiple interview stages.
- Internal Notes are private.
- Candidate Notes are publicly visible to the candidate.
- Completed interviews cannot be edited.
- Cancelled interviews remain in history.
- Every interview action creates a timeline event.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

Candidate access is only possible through the private tracking link.

---

# Database Impact

Create

- Interview Process
- Interview Stage

Update

- Application Status
- Timeline

Store

- Internal Notes
- Candidate Notes
- Meeting Information

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

---

# Analytics Events

- Interview Scheduled
- Interview Updated
- Interview Cancelled
- Interview Completed
- Candidate Viewed Interview

---

# Storybook Components Used

- Card
- Timeline
- Badge
- Modal
- Button
- Date Picker
- Time Picker
- Select
- Textarea

---

# New Components Required

## Interview Process Card

Displays

- Current Process Status
- Next Interview
- Progress

---

## Interview Stage Card

Displays

- Interview Details
- Status
- Notes
- Actions

Reusable across candidate profile and calendar.

---

## Candidate Notes Card

Displays the notes visible to the candidate.

---

# Backend Tasks

- Interview Process CRUD
- Interview Stage CRUD
- Timeline Integration
- Application Status Synchronization
- Candidate Notes API

---

# Frontend Tasks

- Interview Process Page
- Interview Stage Management
- Timeline
- Notes
- Status Management

---

# Acceptance Criteria

- Recruiters can manage multiple interview stages.
- Interview stages remain connected to a single interview process.
- Candidates can see interview information and public notes.
- Recruiters can maintain internal notes.
- Timeline updates automatically.
- Application status stays synchronized.
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

- Interview Templates
- Evaluation Forms
- Interview Scorecards
- Multi-Interviewer Support
- Automatic Reminder Emails
- Google Calendar Integration
- Outlook Calendar Integration
- Zoom Integration
- Google Meet Integration
- AI Interview Evaluation
- AI Interview Summary
- Candidate Self-Scheduling