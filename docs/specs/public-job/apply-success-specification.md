# Application Success Specification

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
- Candidate Tracking Page
- Candidate Management
- Email Service

## Existing Components

- Card
- Alert
- Button
- Badge
- Toast

---

# Overview

The Application Success page is displayed immediately after a candidate successfully submits an application.

Its primary purpose is to reassure the candidate that the application has been received and provide a private tracking link for future status updates.

---

# Business Goal

Provide clear confirmation that the application has been submitted and allow candidates to securely track their application without creating an account.

---

# Scope

Included in MVP

- Success Confirmation
- Tracking Link
- Copy Tracking Link
- Open Tracking Page
- Email Confirmation

---

# Out of Scope

- Candidate Account
- Login
- Application Editing
- Resume Replacement

---

# User Story

As a candidate,

I want to know that my application was submitted successfully,

So that I can safely leave the page and later check its status.

---

# User Flow

```text
Application Submitted

↓

Application Created

↓

Tracking Token Generated

↓

Confirmation Email Sent

↓

Redirect To Success Page

↓

Candidate Saves Tracking Link
```

---

# Route

```
/apply/success
```

The page is accessible only after a successful application.

Direct access without a valid submission should redirect to the public job page.

---

# Page Layout

Sections

1. Success Message
2. Application Summary
3. Tracking Link
4. Next Steps

---

# Success Message

Display

Success Icon

Title

Application Submitted Successfully

Description

Your application has been received successfully.

Our recruitment team will review your application and update its status.

---

# Application Summary

Display

- Job Title
- Organization Name
- Submitted At

---

# Tracking Link

Display

Private Tracking URL

Example

```
https://app.example.com/tracking/xxxxxxxxxxxxxxxx
```

Actions

- Copy Link
- Open Tracking Page

---

# Copy Link

Clicking

Copy Link

Copies the tracking URL to the clipboard.

Success Toast

```text
Tracking link copied.
```

---

# Email Confirmation

Send a confirmation email to the candidate.

The email includes

- Job Title
- Organization Name
- Tracking Link

If email delivery fails

The application remains successful.

Email sending should not block the user.

---

# Next Steps

Display

```text
You can use the tracking link at any time to check the status of your application.

Please keep this link in a safe place.
```

---

# Loading State

Not applicable.

The page is displayed only after successful submission.

---

# Success State

Display

- Success illustration
- Tracking link
- Copy button
- Open tracking page button

---

# Failure State

If the page is opened without a valid application

Redirect

Public Job Page

---

# API Specification

The page receives its data from the Apply endpoint response.

No additional request is required.

Example

```json
{
  "applicationId": "app_123",
  "trackingToken": "xxxxxxxxxxxxxxxx",
  "trackingUrl": "/tracking/xxxxxxxxxxxxxxxx"
}
```

---

# Business Rules

- Every application receives a unique tracking token.
- Tracking tokens must be cryptographically secure.
- Tracking tokens cannot be guessed.
- Email delivery failures do not invalidate the application.
- Tracking links never require authentication.

---

# Security

- Secure Random Token
- One Token Per Application
- Public Read-only Access
- Rate Limiting

---

# Database Impact

Create

Application Tracking Token

Store

- token
- createdAt

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Proper Heading Structure
- Focus Indicators

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Application Submitted
- Tracking Link Copied
- Tracking Page Opened

---

# Storybook Components Used

- Card
- Button
- Alert
- Badge

---

# New Components Required

## Success Summary Card

Displays

- Success Message
- Application Summary
- Tracking Link
- Actions

---

# Backend Tasks

- Generate Secure Tracking Token
- Return Tracking URL
- Queue Confirmation Email

---

# Frontend Tasks

- Success Page
- Copy Link Action
- Open Tracking Page Action

---

# Acceptance Criteria

- Candidate is redirected after a successful submission.
- Tracking link is displayed.
- Tracking link can be copied.
- Confirmation email is sent asynchronously.
- Tracking link opens the private tracking page.
- Direct access without a valid submission is prevented.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Secure Token Generated
- Email Queue Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified

---

# Future Improvements

- Download Application Summary
- Share Tracking Link
- Email Delivery Status
- SMS Confirmation
- Calendar Reminder