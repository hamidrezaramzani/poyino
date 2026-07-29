# Organization Profile Specification

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

- General Settings
- Branding Settings
- Authentication

## Existing Components

- Card
- Avatar
- Image Upload
- Input
- Button
- Loading Button
- Toast
- Alert

---

# Overview

The Organization Profile page allows administrators to manage their organization's public profile information.

Unlike General Settings, this page focuses on identity and contact information that may be displayed to applicants.

---

# Business Goal

Provide a central place for organizations to manage their public-facing profile.

---

# Scope

Included in MVP

- Organization Logo
- Organization Name
- Contact Email
- Phone Number
- Website
- Address
- Save Changes

---

# Out of Scope

- Multiple Offices
- Company Size
- Industry
- Social Links
- Company Gallery
- Team Members

---

# User Story

As an organization administrator,

I want to manage my organization's profile,

So that applicants always see accurate company information.

---

# User Flow

Open Settings

↓

Organization Profile

↓

Load Profile

↓

Edit Information

↓

Save

↓

Profile Updated

---

# Page Information

Route

/settings/profile

Authentication

Required

Layout

Dashboard Layout

---

# Form Sections

## Organization Identity

### Logo

Type

Image Upload

Required

No

Accepted Formats

- PNG
- JPG
- SVG

Maximum Size

2 MB

---

### Organization Name

Type

Text

Required

Yes

Minimum Length

3

Maximum Length

80

---

## Contact Information

### Contact Email

Type

Email

Required

Yes

---

### Phone Number

Type

Text

Required

No

Maximum Length

20

---

### Website

Type

URL

Required

No

---

### Address

Type

Textarea

Required

No

Maximum Length

300

---

# Validation Rules

Organization Name

- Required
- 3–80 characters

Email

- Required
- Valid email

Website

- Optional
- Valid URL

Address

- Maximum 300 characters

---

# User Interactions

- Upload logo
- Replace logo
- Remove logo
- Edit profile information
- Save changes
- Reset unsaved changes

---

# Loading State

- Display skeleton while loading.
- Disable form while saving.
- Display Loading Button.

---

# Success State

Display Toast

```text
Organization profile updated successfully.
```

---

# Failure State

Display validation errors below fields.

Unexpected errors are displayed using Toast.

---

# API Specification

## Get Organization Profile

Endpoint

GET /settings/profile

Authentication

Required

---

## Update Organization Profile

Endpoint

PUT /settings/profile

Authentication

Required

---

Request Body

```json
{
  "organizationName": "Poyino",
  "email": "contact@poyino.ir",
  "phone": "+98xxxxxxxxxx",
  "website": "https://poyino.ir",
  "address": "Tehran, Iran",
  "logoId": "file_123"
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

- Every organization must have a name.
- Email must be unique.
- Logo belongs only to the organization.
- Uploaded files are stored in S3-compatible storage.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation
- File Validation

---

# Database Impact

Update Organization

Fields

- logo_id
- organization_name
- email
- phone
- website
- address

---

# Accessibility

- Keyboard Navigation
- Screen Reader Labels
- Focus Indicators

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Organization Profile Viewed
- Organization Profile Updated
- Logo Uploaded
- Logo Removed

---

# Storybook Components Used

- Card
- Avatar
- Image Upload
- Input
- Button
- Loading Button
- Toast

---

# New Components Required

None

---

# Backend Tasks

- Get Organization Profile Endpoint
- Update Organization Profile Endpoint
- Logo Upload Integration

---

# Frontend Tasks

- Organization Profile Page
- Profile Form
- Upload Integration
- Validation
- Loading State

---

# Acceptance Criteria

- Profile loads correctly.
- User can edit profile information.
- Logo upload works correctly.
- Validation rules are enforced.
- Changes persist after saving.
- Unauthorized users cannot access the page.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified

---

# Future Improvements

- Company Cover Image
- Company Gallery
- Industry Information
- Company Size
- Social Media Links
- Public Organization Page