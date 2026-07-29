# Login Specification

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

- Register
- Forgot Password
- Reset Password
- Email Verification

## Existing Components

- Card
- Button
- Input
- Password Input
- Form
- Label
- Toast
- Alert
- Loading Button

---

# Overview

The Login feature allows an organization's administrator to securely authenticate and access the Poyino dashboard.

Only verified accounts are allowed to sign in.

Authentication is session-based using HttpOnly Cookies.

---

# Business Goal

Provide a secure, simple and reliable authentication flow while minimizing friction for returning users.

---

# Scope

Included in MVP

- Email & Password login
- Session authentication
- Email verification check
- Remember active session
- Redirect to Dashboard
- Forgot Password navigation
- Rate limiting

---

# Out of Scope

- Google Login
- Microsoft Login
- Magic Link
- Two-Factor Authentication (2FA)
- Multi-factor Authentication
- Social Login

---

# User Story

As an organization administrator,

I want to sign in using my email and password,

So that I can access my recruitment dashboard.

---

# User Flow

Open Login Page

↓

Enter Email

↓

Enter Password

↓

Client Validation

↓

Submit

↓

Server Validation

↓

Verify Email Status

↓

Create Session

↓

Set HttpOnly Cookie

↓

Redirect to Dashboard

---

# Page Information

Route

/auth/login

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
- Password Input
- Button
- Loading Button
- Toast
- Alert

No new reusable component is required.

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

## Password

Type

Password

Required

Yes

Minimum Length

6

Visibility Toggle

Yes

Autocomplete

current-password

---

# Secondary Actions

- Forgot Password
- Register

---

# Validation Rules

## Email

- Required
- Valid email format

---

## Password

- Required
- Minimum 6 characters

---

# Error Messages

Language

Persian

## Invalid Credentials

```text
پست الکترونیکی یا رمز عبور اشتباه است.
```

---

## Email Not Verified

```text
حساب کاربری شما هنوز فعال نشده است. لطفاً ایمیل خود را بررسی کنید.
```

---

## Too Many Requests

```text
تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً چند دقیقه دیگر دوباره تلاش کنید.
```

---

## Unexpected Error

```text
خطایی رخ داده است. لطفاً دوباره تلاش کنید.
```

---

# User Interactions

- User enters email.
- User enters password.
- User can show/hide password.
- User clicks Login.
- Loading state is displayed.
- Multiple submissions are prevented.
- User can navigate to Forgot Password.
- User can navigate to Register.

---

# Loading State

- Disable form controls.
- Show Loading Button.
- Prevent duplicate requests.

---

# Success State

- Create authenticated session.
- Set HttpOnly Cookie.
- Redirect to Dashboard.

---

# Failure State

Validation Errors

Display below related input.

Authentication Errors

Display using Toast.

---

# API Specification

Endpoint

POST /auth/login

Authentication

Public

---

Request Body

```json
{
  "email": "admin@company.com",
  "password": "123456"
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

Error Response

HTTP 401

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "پست الکترونیکی یا رمز عبور اشتباه است."
  }
}
```

---

# Authentication

After successful authentication

Backend should

- Generate Session
- Store Session
- Set HttpOnly Cookie
- Redirect user to Dashboard

Cookie Configuration

- HttpOnly
- Secure (Production)
- SameSite=Lax
- Expiration according to session policy

---

# Business Rules

- Only verified users can login.
- Email comparison must be case-insensitive.
- Password must be verified using secure hashing.
- Authentication should never reveal whether the email exists.
- Every failed login attempt should be logged.
- Rate limiting applies to every login request.

---

# Security Requirements

- Password hashing
- HttpOnly Cookies
- Secure Cookies
- SameSite Cookies
- Rate Limiting
- Timing-safe password comparison
- Prevent brute-force attacks
- Prevent duplicate requests

---

# Rate Limiting

Apply endpoint rate limiting.

Suggested Policy

- 5 failed attempts
- Per IP + Email
- Lock for 15 minutes

---

# Database Impact

No new tables.

Update

- Last Login Time
- Failed Login Counter (optional)
- Last Login IP (optional)

---

# Accessibility

- Full keyboard navigation
- Visible focus indicators
- Screen reader labels
- Accessible validation messages

---

# Internationalization

Supported Languages

- Persian
- English

All validation and server messages must support i18n.

---

# Analytics Events

- Login Page Viewed
- Login Submitted
- Login Successful
- Login Failed
- Forgot Password Clicked
- Register Clicked

---

# Storybook Components Used

- Button
- Loading Button
- Input
- Password Input
- Card
- Form
- Toast
- Alert

---

# New Components

None

---

# Backend Tasks

- Login Endpoint
- Credential Validation
- Email Verification Check
- Session Creation
- Cookie Generation
- Rate Limiting
- Audit Logging

---

# Frontend Tasks

- Login Page
- Form Validation
- API Integration
- Error Handling
- Loading State
- Redirect to Dashboard

---

# Acceptance Criteria

- Verified users can login successfully.
- Invalid credentials return the correct error.
- Unverified users cannot login.
- Session cookie is created.
- User is redirected to Dashboard.
- Rate limiting is enforced.
- Password visibility toggle works.
- Forgot Password link works.
- Register link works.

---

# Definition of Done

- Specification Approved
- Backend Implemented
- Frontend Implemented
- Shared Contracts Created
- Storybook Components Reused
- Validation Completed
- Accessibility Verified
- i18n Completed
- Dark Mode Verified

---

# Future Improvements

- Remember Me
- Two-Factor Authentication (2FA)
- Magic Link Login
- Social Login
- Device Management
- Active Sessions Management
- Login Notifications
- Suspicious Login Detection