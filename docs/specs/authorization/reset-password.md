# Reset Password Specification

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

- Forgot Password
- Login
- Register

## Existing Components

- Card
- Form
- Password Input
- Button
- Loading Button
- Alert
- Toast

---

# Overview

The Reset Password feature allows an organization administrator to securely set a new password using a valid password reset token received via email.

A reset token can only be used once and expires after 15 minutes.

After a successful password reset, all previous reset tokens become invalid and the user is redirected to the Login page.

---

# Business Goal

Provide a secure and simple password reset flow while preventing unauthorized password changes.

---

# Scope

Included in MVP

- Validate reset token
- Set new password
- Confirm password
- Invalidate token
- Redirect to Login

---

# Out of Scope

- Password History
- MFA Verification
- Administrator Approval

---

# User Story

As an organization administrator,

I want to set a new password after receiving a recovery email,

So that I can regain access to my account.

---

# User Flow

User clicks Reset Password Link

↓

Open Reset Password Page

↓

Validate Token

↓

Display Form

↓

Enter New Password

↓

Confirm Password

↓

Submit

↓

Validate Password

↓

Update Password

↓

Invalidate Token

↓

Redirect to Login

---

# Page Information

Route

/auth/reset-password?token=...

Authentication

Public

Layout

Authentication Layout

---

# UI Components

Reuse Existing Components

- Card
- Form
- Password Input
- Button
- Loading Button
- Toast
- Alert

No new reusable components are required.

---

# Form Fields

## New Password

Type

Password

Required

Yes

Minimum Length

6

Visibility Toggle

Yes

Autocomplete

new-password

---

## Confirm Password

Type

Password

Required

Yes

Must Match Password

Visibility Toggle

Yes

Autocomplete

new-password

---

# Validation Rules

## Password

- Required
- Minimum 6 characters

---

## Confirm Password

- Required
- Must match password

---

# Token Validation

- Required
- Must exist
- Must not be expired
- Must not be used

---

# Error Messages

Language

Persian

Invalid Token

```text
لینک بازیابی معتبر نیست.
```

Expired Token

```text
اعتبار لینک بازیابی به پایان رسیده است.
```

Passwords Do Not Match

```text
رمز عبور و تکرار رمز عبور یکسان نیست.
```

Password Too Short

```text
رمز عبور باید حداقل ۶ کاراکتر باشد.
```

Unexpected Error

```text
خطایی رخ داده است. لطفاً دوباره تلاش کنید.
```

---

# User Interactions

- User opens reset link.
- Token is validated automatically.
- User enters password.
- User enters confirmation.
- Loading state is shown.
- Duplicate submissions are prevented.
- Redirect to Login after success.

---

# Loading State

- Disable form
- Show Loading Button

---

# Success State

- Password updated.
- Reset token invalidated.
- Success Toast displayed.
- Redirect to Login.

---

# Failure State

- Invalid token page.
- Expired token page.
- Validation errors below fields.
- Unexpected errors displayed with Toast.

---

# API Specification

Endpoint

POST /auth/reset-password

Authentication

Public

---

Request Body

```json
{
  "token": "<reset-token>",
  "password": "123456",
  "confirmPassword": "123456"
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

HTTP 400

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "لینک بازیابی معتبر نیست."
  }
}
```

---

# Business Rules

- Reset token can only be used once.
- Password is securely hashed.
- Previous password is replaced.
- Existing authenticated sessions remain unchanged (MVP).
- User must login again after password reset.

---

# Security Requirements

- Secure token validation
- Password hashing
- One-time token usage
- Token expiration (15 minutes)
- Rate limiting
- Prevent duplicate requests

---

# Rate Limiting

- Maximum 5 requests
- Per IP
- Lock for 15 minutes

---

# Database Impact

Update

- User Password

Delete / Invalidate

- Password Reset Token

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Visible Focus States
- Accessible Error Messages

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Reset Password Page Viewed
- Reset Password Submitted
- Password Reset Successful
- Password Reset Failed

---

# Storybook Components Used

- Card
- Password Input
- Button
- Loading Button
- Toast
- Alert

---

# New Components

None

---

# Backend Tasks

- Validate Token
- Validate Password
- Update Password
- Hash Password
- Invalidate Token

---

# Frontend Tasks

- Reset Password Page
- Form Validation
- API Integration
- Error Handling
- Redirect to Login

---

# Acceptance Criteria

- Valid token allows password reset.
- Expired token is rejected.
- Used token is rejected.
- Password validation works.
- User is redirected to Login.
- Token becomes invalid immediately after use.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Validation Completed
- Accessibility Verified
- i18n Completed
- Dark Mode Verified

---

# Future Improvements

- Password Strength Meter
- Password History Check
- Force Logout All Sessions
- MFA Confirmation
- Password Breach Detection