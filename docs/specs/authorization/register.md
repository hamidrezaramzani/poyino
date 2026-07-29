# Dependencies

Foundation

- architecture.md
- project-structure.md
- coding-standards.md
- naming-conventions.md
- technology-decisions.md

Components

- Button
- Input
- Password Input
- Toast

Related Features

- Login
- Email Verification

# Register Specification

Version: 1.0

Status: Approved

Owner: Product Team

Last Updated: 2026-07-29

---

# Overview

The Register feature allows an organization to create a new account in Poyino.

Only organizations can register.

A successful registration creates a new organization together with its first administrator account. After registration, a verification email is sent to the provided email address. The user is redirected to the Login page and must verify the email before signing in.

---

# Business Goal

Provide a simple, secure and reliable onboarding process for organizations while ensuring:

- Unique organization identity
- Verified email ownership
- Secure password storage
- Minimal friction

---

# Scope

Included in MVP

- Organization registration
- Email validation
- Password validation
- Password confirmation
- Email uniqueness validation
- Email verification
- Redirect to Login

---

# Out of Scope

- Social Login
- Google Login
- Microsoft Login
- Invite-based registration
- Multi-workspace onboarding
- CAPTCHA

---

# User Story

As an organization,

I want to create an account,

So that I can publish job opportunities and manage candidates.

---

# User Flow

Open Register Page

↓

Fill Organization Information

↓

Client-side Validation

↓

Submit Form

↓

Server Validation

↓

Create Organization

↓

Create Administrator User

↓

Generate Verification Token

↓

Send Verification Email

↓

Redirect to Login

---

# Page Information

Route

/auth/register

Authentication

Public

Layout

Authentication Layout

---

# UI Components

Reuse Existing Components

- Card
- Button
- Input
- Password Input
- Form
- Label
- Toast
- Alert
- Loading Button

No new reusable component is required.

---

# Form Fields

## Organization Name

Type

Text

Required

Yes

Minimum Length

3

Maximum Length

80

Placeholder

Organization Name

---

## Email

Type

Email

Required

Yes

Unique

Yes

Placeholder

example@company.com

---

## Password

Type

Password

Required

Yes

Minimum Length

6

Visibility Toggle

Yes

---

## Confirm Password

Type

Password

Required

Yes

Visibility Toggle

Yes

Must Match Password

Yes

---

# Validation Rules

## Organization Name

- Required
- Trim spaces
- Minimum 3 characters
- Maximum 80 characters

---

## Email

- Required
- Valid email format
- Must not already exist

---

## Password

- Required
- Minimum 6 characters

---

## Confirm Password

- Must equal Password

---

# Error Messages

Language

Persian

Examples

Organization Name

"نام سازمان الزامی است."

Email

"پست الکترونیکی معتبر نیست."

Email Exists

"پست الکترونیکی قبلاً ثبت شده است."

Password

"رمز عبور باید حداقل ۶ کاراکتر باشد."

Password Confirmation

"رمز عبور و تکرار رمز عبور یکسان نیست."

Unexpected Error

"خطایی رخ داده است. لطفاً دوباره تلاش کنید."

---

# User Interactions

User types inside fields.

Validation happens after blur.

Submit button remains enabled.

During submission:

- Inputs disabled
- Loading Button displayed
- Duplicate requests prevented

---

# Loading State

Display Loading Button.

Prevent multiple submissions.

---

# Success State

Display success Toast.

Redirect user to Login.

---

# Failure State

Display field errors under related inputs.

Display unexpected errors using Toast.

---

# API Specification

Endpoint

POST /auth/register

Authentication

Public

---

Request Body

```json
{
  "organizationName": "Acme",
  "email": "admin@acme.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

---

Success Response

HTTP 201

```json
{
  "success": true
}
```

---

Error Response

HTTP 409

```json
{
  "success": false,
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "پست الکترونیکی قبلاً ثبت شده است."
  }
}
```

---

# Business Rules

- Every email must be unique.
- Every organization has exactly one administrator after registration.
- Passwords are never stored in plain text.
- Verification email must always be sent.
- Login is not allowed until email verification.

---

# Security Requirements

- Password hashing
- HttpOnly Cookies (after login)
- Rate Limiting
- Secure verification token
- Verification token expires after 15 minutes
- Prevent duplicate requests

---

# Database Impact

Create Organization

Create User

Create Email Verification Token

---

# Email Verification

Generate secure token.

Expiration

15 minutes.

Email contains

- Verification link
- Organization name

After verification

Token becomes invalid immediately.

---

# Accessibility

- Full keyboard navigation
- Screen reader labels
- Visible focus states
- Accessible error messages

---

# Internationalization

Supported Languages

- Persian
- English

Validation messages must support i18n.

---

# Analytics Events

Register Page Viewed

Registration Submitted

Registration Successful

Registration Failed

Verification Email Sent

---

# Storybook Components Used

- Button
- Input
- Password Input
- Card
- Alert
- Toast
- Loading Button

---

# New Components

None

---

# Backend Tasks

- Register endpoint
- Validation
- Organization creation
- User creation
- Password hashing
- Email sending
- Verification token generation

---

# Frontend Tasks

- Register page
- Form validation
- API integration
- Error handling
- Loading state
- Success redirect

---

# Acceptance Criteria

- Organization can register successfully.
- Duplicate emails are rejected.
- Validation errors appear under related fields.
- Verification email is sent.
- User is redirected to Login.
- Passwords are securely stored.
- Rate limiting is applied.

---

# Definition of Done

- Specification approved.
- API implemented.
- Frontend implemented.
- Storybook components reused.
- Shared contracts created.
- Validation complete.
- Accessibility verified.
- i18n completed.
- Dark Mode verified.

---

# Future Improvements

- Google Authentication
- Microsoft Authentication
- Invite-based Registration
- Organization Domain Verification
- CAPTCHA
- Multi-step Registration