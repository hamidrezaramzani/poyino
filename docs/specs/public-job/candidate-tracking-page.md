# Candidate Tracking Page Specification

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

- Apply Flow
- Application Success
- Candidate Management
- Application Status

## Existing Components

- Card
- Badge
- Timeline
- Alert
- Empty State
- Skeleton
- Divider

---

# Overview

The Candidate Tracking Page is a private page that allows candidates to check the current status of their application without creating an account.

The page is accessible only through a secure tracking token generated after a successful application.

This page is read-only.

---

# Business Goal

Provide transparency throughout the hiring process while avoiding the need for candidate registration or authentication.

---

# Scope

Included in MVP

- View Application Status
- View Application Timeline
- View Submitted Information
- View Job Information
- Private Access via Tracking Token

---

# Out of Scope

- Candidate Login
- Resume Editing
- Withdraw Application
- Messaging
- Interview Confirmation

---

# User Story

As a candidate,

I want to track my application,

So that I know where I am in the hiring process.

---

# User Flow

```text
Candidate Opens Tracking Link

↓

Tracking Token Validation

↓

Load Application

↓

Display Current Status

↓

Display Timeline

↓

Display Submitted Information
```

---

# Route

```
/tracking/:token
```

Authentication

Not Required

Access is granted only with a valid tracking token.

---

# Page Layout

Sections

1. Application Status
2. Progress Timeline
3. Job Information
4. Submitted Information
5. Last Updated

---

# Application Status

Display

Current Status Badge

Possible Values

- Submitted
- Under Review
- Interview Scheduled
- Interview Completed
- Hired
- Rejected

---

# Status Descriptions

Submitted

```text
Your application has been received successfully.
```

---

Under Review

```text
Our recruitment team is currently reviewing your application.
```

---

Interview Scheduled

```text
Congratulations!
You have been invited to an interview.
```

---

Interview Completed

```text
Your interview has been completed.
The final decision is being prepared.
```

---

Hired

```text
Congratulations!
You have successfully passed the recruitment process.
```

---

Rejected

```text
Thank you for your interest.

After careful consideration, we decided to move forward with another candidate.
```

---

# Progress Timeline

Display

- Application Submitted
- Under Review
- Interview Scheduled
- Interview Completed
- Final Decision

Each completed step displays

- Date
- Time

Future steps remain inactive.

---

# Job Information

Display

- Job Title
- Organization Name
- Employment Type
- Workplace Type
- Location

---

# Submitted Information

Display

Personal Information

- Full Name
- Email
- Phone Number

Professional Information

- Current Position

Do NOT display

- Resume PDF
- Internal Notes
- AI Analysis
- Internal Candidate Score

---

# Last Updated

Display

```text
Last updated

2026-08-02 14:30
```

Uses the organization's configured timezone.

---

# Invalid Tracking Token

Display

Title

Tracking Link Not Found

Description

The tracking link is invalid or has expired.

---

# Expired Tracking Token

For MVP

Tracking tokens never expire.

---

# Loading State

Display Skeleton

- Status
- Timeline
- Job Information

---

# Success State

Display all available information.

---

# Failure State

Invalid Token

404 Page

Unexpected Error

Generic Error Page

---

# API Specification

## Get Tracking Information

GET

```
/public/tracking/:token
```

Authentication

Not Required

---

Success Response

```json
{
  "status": "UNDER_REVIEW",
  "jobTitle": "Senior Frontend Developer",
  "organization": "Acme Inc.",
  "submittedAt": "2026-08-01T12:00:00Z",
  "updatedAt": "2026-08-02T09:30:00Z",
  "timeline": []
}
```

---

# Business Rules

- Tracking tokens provide read-only access.
- Internal recruiter information is never exposed.
- AI analysis is never exposed.
- Recruiter notes are never exposed.
- Candidate ranking is never exposed.
- Tracking links do not require authentication.

---

# Security

- Secure Random Token
- Read-only Endpoint
- Rate Limiting
- No Sensitive Information Returned

---

# Database Impact

Read

- Application
- Job
- Candidate

No data modifications.

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Semantic Headings
- Focus Indicators

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Tracking Page Viewed

---

# Storybook Components Used

- Card
- Badge
- Timeline
- Alert
- Empty State
- Skeleton

---

# New Components Required

## Application Status Card

Displays

- Current Status
- Description
- Last Updated

---

## Application Timeline

Displays

- Hiring Progress
- Completed Steps
- Dates

Reusable for future recruiter dashboard pages.

---

# Backend Tasks

- Tracking Endpoint
- Token Validation
- Status Mapping
- Timeline Retrieval

---

# Frontend Tasks

- Tracking Page
- Timeline Component
- Status Card
- Invalid Token Page

---

# Acceptance Criteria

- Candidate can access the page using a valid tracking token.
- Current application status is displayed.
- Timeline updates correctly as recruiters change the application status.
- Internal HR information is never displayed.
- Invalid tracking links display an error page.
- The page is fully responsive.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Token Validation Completed
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- Candidate Withdraw Application
- Interview Details
- Recruiter Messages
- Email Notification Preferences
- Download Submitted Application
- Multi-language Tracking Page