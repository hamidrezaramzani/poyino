# General Settings Specification

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

- Dashboard
- Organization Profile
- Branding
- Notifications

## Existing Components

- Form
- Card
- Input
- Textarea
- Select
- Button
- Loading Button
- Toast
- Alert

---

# Overview

The General Settings page allows organizations to manage their basic information and default preferences.

These settings are shared across the entire platform and affect public pages, emails, and application behavior.

---

# Business Goal

Allow organizations to maintain accurate business information and configure their default application preferences.

---

# Scope

Included in MVP

- Organization Information
- Contact Information
- Location
- Timezone
- Default Language
- Save Changes
- Reset Unsaved Changes

---

# Out of Scope

- Billing
- Subscription
- Workspace Management
- Organization Members
- API Keys

---

# User Story

As an organization administrator,

I want to configure my organization's information,

So that the platform correctly represents my company and uses my preferred settings.

---

# User Flow

Open Settings

↓

General Tab

↓

Load Current Settings

↓

Modify Fields

↓

Save Changes

↓

Validate Data

↓

Update Organization

↓

Display Success Message

---

# Page Information

Route

/settings/general

Authentication

Required

Layout

Dashboard Layout

---

# Form Sections

## Organization Information

Fields

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

### Display Name

Type

Text

Required

No

Maximum Length

80

---

### Short Description

Type

Textarea

Required

No

Maximum Length

300

---

## Contact Information

### Organization Email

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

## Location

### Country

Type

Select

Required

No

---

### City

Type

Text

Required

No

---

### Timezone

Type

Select

Required

Yes

Default

Asia/Tehran

---

### Default Language

Type

Select

Required

Yes

Options

- Persian
- English

---

# Validation Rules

Organization Name

- Required
- 3–80 characters

Display Name

- Maximum 80 characters

Description

- Maximum 300 characters

Email

- Required
- Valid email format

Website

- Optional
- Valid URL

Phone Number

- Optional

Timezone

- Required

Language

- Required

---

# User Interactions

- User edits one or more fields.
- Save button becomes enabled after changes.
- Reset button restores the original values.
- Leaving the page with unsaved changes should display a confirmation dialog.

---

# Loading State

- Disable form.
- Display loading skeleton while fetching settings.
- Display Loading Button while saving.

---

# Success State

Display Toast

```text
اطلاعات با موفقیت ذخیره شد.
```

Updated values should immediately be reflected throughout the application where applicable.

---

# Failure State

Validation errors appear below their related fields.

Unexpected server errors are displayed using Toast.

---

# API Specification

## Get Settings

Endpoint

GET /settings/general

Authentication

Required

---

## Update Settings

Endpoint

PUT /settings/general

Authentication

Required

---

Request Body

```json
{
  "organizationName": "Poyino",
  "displayName": "Poyino ATS",
  "description": "AI-powered recruitment platform",
  "email": "contact@poyino.ir",
  "phone": "+98xxxxxxxxxx",
  "website": "https://poyino.ir",
  "country": "Iran",
  "city": "Tehran",
  "timezone": "Asia/Tehran",
  "language": "fa"
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

- Organization Name must always exist.
- Email must belong to the organization.
- Language change affects the UI immediately.
- Timezone affects all date/time displays.
- Only organization administrators can modify settings.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation
- Input Validation
- Rate Limiting

---

# Database Impact

Update Organization

Fields

- organization_name
- display_name
- description
- email
- phone
- website
- country
- city
- timezone
- language

---

# Accessibility

- Keyboard Navigation
- Screen Reader Labels
- Visible Focus States
- Accessible Validation Messages

---

# Internationalization

Supported Languages

- Persian
- English

All labels, placeholders, validation messages, and button texts must support translation.

---

# Analytics Events

- General Settings Viewed
- General Settings Updated
- Language Changed
- Timezone Changed

---

# Storybook Components Used

- Card
- Form
- Input
- Textarea
- Select
- Button
- Loading Button
- Toast

---

# New Components Required

None

---

# Backend Tasks

- Get General Settings Endpoint
- Update General Settings Endpoint
- Validation
- Authorization

---

# Frontend Tasks

- General Settings Page
- Form Validation
- API Integration
- Unsaved Changes Dialog
- Loading State
- Success/Error Handling

---

# Acceptance Criteria

- Current settings are loaded correctly.
- User can modify organization information.
- Validation rules are enforced.
- Changes are saved successfully.
- Unsaved changes warning is displayed.
- Language changes are applied immediately.
- Only authorized users can update settings.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Validation Completed
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- Organization Slug
- Public Company Profile
- Company Size
- Industry
- Social Media Links
- Business Hours
- Multi-Office Support
- Auto-save