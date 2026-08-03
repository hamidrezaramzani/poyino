# Notification Preferences Specification

Version: 1.0

Status: Approved

Owner: Product Team

Last Updated: 2026-08-03

---

# Dependencies

## Foundation

- architecture.md
- technology-decisions.md

## Related Features

- Notification Center
- Notification Events
- Email Notifications
- Profile Settings

---

# Overview

Notification Preferences allow each user to control how they receive notifications.

The notification service checks these preferences before sending any notification.

Business-critical notifications may override user preferences when necessary.

---

# Business Goal

Reduce notification fatigue while allowing users to customize their communication channels.

---

# Scope

Included in MVP

- Enable / Disable Email Notifications
- Enable / Disable In-App Notifications
- Notification Categories
- Default Preferences

---

# Out of Scope

- Push Notifications
- SMS
- Slack
- Teams
- Per-Project Preferences

---

# User Story

As a user,

I want to control which notifications I receive,

So that I only get alerts that are relevant to me.

---

# Route

```
/dashboard/settings/notification-preferences
```

Authentication

Required

---

# Notification Channels

Supported

| Channel | MVP |
|----------|-----|
| In-App | ✅ |
| Email | ✅ |
| Push | ❌ |
| SMS | ❌ |

---

# Categories

Users can configure each category independently.

---

## Candidate Notifications

Examples

- New Application
- Candidate Status Changed
- Candidate Hired
- Candidate Rejected

---

## Interview Notifications

Examples

- Interview Scheduled
- Interview Updated
- Interview Cancelled
- Interview Completed

---

## Job Notifications

Examples

- Job Published
- Job Expired
- Job Archived

---

## Organization Notifications

Examples

- Invitation Accepted
- Member Joined
- Role Changed

---

## System Notifications

Examples

- Security Alerts
- Maintenance
- Important Announcements

---

# Preference Structure

Each category contains

| Channel | Enabled |
|----------|----------|
| In-App | ✅ |
| Email | ✅ |

Example

Interview

```
In-App

✅ Enabled

Email

❌ Disabled
```

---

# Default Preferences

New users receive

| Category | In-App | Email |
|-----------|--------|-------|
| Candidate | ✅ | ✅ |
| Interview | ✅ | ✅ |
| Jobs | ✅ | ❌ |
| Organization | ✅ | ✅ |
| System | ✅ | ✅ |

---

# Mandatory Notifications

Some notifications cannot be disabled.

Examples

- Password Reset
- Email Verification
- Security Alerts
- Invitation Acceptance

These always use Email.

---

# Preference Resolution

Notification Service

↓

Load User Preferences

↓

Determine Enabled Channels

↓

Send Notifications

---

# Bulk Actions

Supported

```
Enable All

Disable All
```

System notifications remain enabled.

---

# Reset Preferences

Users may restore

```
Default Settings
```

---

# Validation

Every user always has a complete preference configuration.

Missing preferences automatically fall back to defaults.

---

# Loading State

Display skeleton.

---

# Empty State

Not applicable.

Preferences are always initialized.

---

# Error State

Display generic dashboard error.

---

# API Specification

## Get Preferences

GET

```
/notification-preferences
```

---

## Update Preferences

PATCH

```
/notification-preferences
```

---

## Reset Preferences

POST

```
/notification-preferences/reset
```

---

# Business Rules

- Preferences apply only to optional notifications.
- Mandatory notifications ignore user preferences.
- Missing preferences use platform defaults.
- Users control only their own preferences.

---

# Security

Authentication Required

Authorization Required

Users may only modify their own preferences.

---

# Database Impact

Store

Notification Preference

Fields

- UserId
- Category
- InAppEnabled
- EmailEnabled

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Accessible Switches

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

Track

- Preferences Updated
- Preferences Reset
- Channel Disabled
- Channel Enabled

---

# Storybook Components Used

- Switch
- Card
- Button
- Section Header

---

# New Components Required

## Notification Preferences Page

Displays all notification settings.

---

## Notification Category Card

Reusable settings block for each category.

---

## Channel Toggle

Reusable switch for Email and In-App notifications.

---

# Backend Tasks

- Preference CRUD
- Default Preference Generator
- Preference Resolver

---

# Frontend Tasks

- Preferences Page
- Toggle Components
- Reset Action

---

# Acceptance Criteria

- Users can enable or disable Email notifications.
- Users can enable or disable In-App notifications.
- Mandatory notifications cannot be disabled.
- Default preferences are automatically created.
- Notification Service respects user preferences.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- Integration Tests Passed

---

# Future Improvements

- Push Notification Preferences
- SMS Preferences
- Slack Preferences
- Quiet Hours
- Daily Digest
- Weekly Digest
- Browser Notifications
- Per-Resource Notification Rules