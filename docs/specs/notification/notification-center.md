# Notification Center Specification

Version: 1.0

Status: Approved

Owner: Product Team

Last Updated: 2026-08-03

---

# Dependencies

## Foundation

- architecture.md
- project-structure.md
- coding-standards.md
- naming-conventions.md
- technology-decisions.md

## Related Features

- Authentication
- Organization
- Jobs
- Candidate Application
- Candidate Management
- Interview
- Notification Events
- Notification Preferences

## Existing Components

- Dropdown
- Badge
- Avatar
- Button
- Tabs
- Empty State
- Skeleton
- Infinite Scroll

---

# Overview

Notification Center provides a centralized place for users to view system events that require their attention.

Notifications are generated automatically by system events and are delivered inside the application.

This module only manages **In-App Notifications**.

Email delivery is covered by `email-notifications.md`.

---

# Business Goal

Keep users informed about important events without requiring them to constantly monitor every section of the application.

---

# Scope

Included in MVP

- Notification List
- Read / Unread
- Mark as Read
- Mark All as Read
- Delete Notification
- Notification Badge
- Notification Categories

---

# Out of Scope

- Push Notifications
- Mobile Notifications
- Browser Notifications
- Real-time WebSocket Updates (Future)

---

# User Story

As a recruiter,

I want to receive notifications about important recruitment events,

So that I can react quickly without manually checking every page.

---

# Notification Entry Point

Every dashboard page displays

```
Notification Bell
```

Located in

```
Top Navigation Bar
```

---

# Notification Badge

If unread notifications exist

Display

```
🔔 7
```

Maximum visible count

```
99+
```

---

# Notification Dropdown

Clicking the notification bell opens

```
Latest Notifications
```

Display

- Icon
- Title
- Short Description
- Relative Time
- Read Status

Example

```
🟢 New application received

John Smith applied for Backend Developer.

5 minutes ago
```

---

# View All Notifications

Dropdown contains

```
View All
```

Navigates to

```
/dashboard/notifications
```

---

# Notification Page

Route

```
/dashboard/notifications
```

Authentication

Required

---

# Page Sections

Tabs

- All
- Unread
- Read

---

# Notification Card

Each notification displays

- Icon
- Title
- Description
- Timestamp
- Read Status

Optional

- Action Button

Example

```
Interview Scheduled

Ali Ahmadi

Tomorrow at 14:00

View Interview
```

---

# Notification Categories

Categories

- Candidates
- Jobs
- Interviews
- Organization
- System
- Billing (Future)

Each category has its own icon.

---

# Read Status

Possible Values

```
Unread
```

```
Read
```

Unread notifications

- Bold title
- Colored indicator

---

# Mark as Read

Clicking a notification

OR

Selecting

```
Mark as Read
```

Changes status immediately.

---

# Mark All as Read

Button

```
Mark All as Read
```

Updates every unread notification.

---

# Delete Notification

Users may remove notifications from their own list.

Deletion does not affect audit logs.

---

# Navigation

Some notifications include

```
Primary Action
```

Examples

```
View Candidate

View Interview

View Job

Open Organization Settings
```

Opening the destination automatically marks the notification as read.

---

# Search

Not included in MVP.

---

# Filtering

Supported

- All
- Read
- Unread

Future

- By Category

---

# Sorting

Newest First

(Default)

---

# Empty State

```
You're all caught up.

No notifications found.
```

---

# Loading State

Display notification skeletons.

---

# Error State

Display generic dashboard error.

---

# Notification Lifetime

Notifications remain visible for

```
90 Days
```

Older notifications are archived automatically.

---

# API Specification

## Get Notifications

GET

```
/notifications
```

---

## Mark As Read

PATCH

```
/notifications/:notificationId/read
```

---

## Mark All As Read

PATCH

```
/notifications/read-all
```

---

## Delete Notification

DELETE

```
/notifications/:notificationId
```

---

# Business Rules

- Users only see their own notifications.
- Notifications are ordered newest first.
- Opening a notification marks it as read.
- Deleted notifications only disappear for that user.
- Archived notifications are no longer displayed after the retention period.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

Users cannot access notifications belonging to other users.

---

# Database Impact

Create

```
Notification
```

Fields

- UserId
- OrganizationId
- Category
- Title
- Description
- ActionUrl
- IsRead
- CreatedAt
- ReadAt

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Accessible Notification List
- Focus Management

---

# Internationalization

Supported Languages

- Persian
- English

Relative timestamps follow the selected locale.

---

# Analytics Events

- Notification Viewed
- Notification Opened
- Notification Read
- Notification Deleted
- Mark All As Read

---

# Storybook Components Used

- Badge
- Dropdown
- Card
- Tabs
- Button
- Empty State
- Skeleton

---

# New Components Required

## Notification Bell

Displays unread count.

---

## Notification Dropdown

Shows recent notifications.

---

## Notification List

Reusable list component.

---

## Notification Card

Displays notification details.

---

## Notification Badge

Reusable unread indicator.

---

# Backend Tasks

- Notification CRUD
- Read Status
- Retention Policy
- Pagination

---

# Frontend Tasks

- Notification Bell
- Notification Dropdown
- Notification Center Page
- Read / Unread Logic
- Mark All As Read
- Delete Notification

---

# Acceptance Criteria

- Users receive in-app notifications.
- Unread count updates correctly.
- Notifications can be marked as read.
- Notifications can be deleted.
- Navigation opens the related resource.
- Notification center is fully responsive.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- Real-time Updates (WebSocket)
- Browser Push Notifications
- Mobile Push Notifications
- Notification Search
- Category Filters
- Notification Pinning
- Snooze Notifications
- Bulk Delete
- AI Notification Prioritization