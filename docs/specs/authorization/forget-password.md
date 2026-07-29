# Forgot Password Specification

Version: 1.0

Status: Approved

Owner: Product Team

Last Updated: 2026-07-29

---

# Dependencies

## Foundation

- architecture.md
- project-structure.md
- coding-standards.md
- naming-conventions.md
- technology-decisions.md

## Related Features

- Login
- Reset Password
- Register

## Existing Components

- Card
- Form
- Input
- Button
- Loading Button
- Alert
- Toast

---

# Overview

The Forgot Password feature allows an organization administrator to request a password reset link using their registered email address.

If the email exists, a password reset email containing a secure token is sent.

The response should always be identical regardless of whether the email exists.

---

# Business Goal

Provide a secure self-service password recovery flow while preventing email enumeration attacks.

---

# Scope

Included in MVP

- Request password reset
- Generate secure reset token
- Send reset email
- Redirect back to Login

---

# Out of Scope

- SMS Recovery
- Security Questions
- Multi-factor Recovery
- Administrator Assisted Recovery

---

# User Story

As an organization administrator,

I want to recover my password,

So that I can regain access to my account.

---

# User Flow

Open Login

↓

Click Forgot Password

↓

Open Forgot Password Page

↓

Enter Email

↓

Submit

↓

Validate Email

↓

Generate Reset Token

↓

Send Reset Email

↓

Redirect to Login

---

# Page Information

Route

/auth/forgot-password

Authentication

Public

Layout

Authentication Layout

---

# UI Components

Reuse Existing Components

- Card
- Form
- Input
- Button
- Loading Button
- Alert
- Toast

No new reusable components are required.

---

# Form Fields

## Email

Type

Email

Required

Yes

Placeholder

example@company.com

Autocomplete

email

---

# Validation Rules

## Email

- Required
- Valid email format

---

# Success Message

Always display

```text
در صورت وجود حساب کاربری، لینک بازیابی رمز عبور برای شما ارسال شد.
```

---

# Error Messages

Language

Persian

Invalid Email

```text
پست الکترونیکی معتبر نیست.
```

Unexpected Error

```text
خطایی رخ داده است. لطفاً دوباره تلاش کنید.
```

---

# Security Rules

Never reveal whether an email exists.

The same response must be returned for both existing and non-existing emails.

---

# User Interactions

- User enters email.
- User submits form.
- Loading state is shown.
- Duplicate requests are prevented.
- Success message displayed.
- User redirected to Login.

---

# Loading State

- Disable form
- Show Loading Button

---

# Success State

- Send email if account exists.
- Redirect user to Login.

---

# Failure State

Unexpected errors should be displayed using Toast.

---

# API Specification

Endpoint

POST /auth/forgot-password

Authentication

Public

---

Request Body

```json
{
  "email": "admin@company.com"
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

# Business Rules

- Token must be cryptographically secure.
- Token expiration is 15 minutes.
- Only one active token per user.
- Old tokens become invalid after generating a new one.

---

# Security Requirements

- Rate Limiting
- Secure Random Token
- Prevent Email Enumeration
- Prevent Duplicate Requests

---

# Rate Limiting

- Maximum 5 requests
- Per IP + Email
- Lock for 15 minutes

---

# Email Content

Contains

- Organization Name
- Reset Password Button
- Expiration Time
- Security Notice

---

# Database Impact

Create Password Reset Token

Invalidate Previous Tokens

Store

- Token
- Expiration
- Created At

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

---

# Analytics Events

- Forgot Password Viewed
- Forgot Password Submitted
- Reset Email Sent

---

# Storybook Components Used

- Card
- Input
- Button
- Loading Button
- Toast
- Alert

---

# New Components

None

---

# Backend Tasks

- Forgot Password Endpoint
- Generate Token
- Store Token
- Send Email
- Rate Limiting

---

# Frontend Tasks

- Forgot Password Page
- Form Validation
- API Integration
- Loading State
- Redirect to Login

---

# Acceptance Criteria

- User can request password reset.
- Existing accounts receive an email.
- Non-existing accounts receive the same response.
- Reset token expires after 15 minutes.
- Duplicate requests are prevented.
- Rate limiting is applied.

---

# Definition of Done

- Backend Completed
- Frontend Completed
- Email Template Created
- Validation Completed
- Accessibility Verified
- i18n Completed
- Dark Mode Verified

---

# Future Improvements

- SMS Recovery
- Recovery Codes
- MFA Recovery
- Suspicious Recovery Detection