# Interview Calendar Specification

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

- Interview Process
- Candidate Profile
- Candidate List
- Dashboard

## Existing Components

- Calendar
- Card
- Badge
- Modal
- Drawer
- Button
- Tooltip
- Avatar
- Select
- Skeleton

---

# Overview

The Interview Calendar provides a centralized view of all scheduled interviews across the organization.

Recruiters can navigate between dates, view upcoming interviews, identify scheduling conflicts, and quickly access interview details.

The calendar becomes the primary planning tool for recruitment teams.

---

# Business Goal

Provide recruiters with a visual scheduling interface to efficiently manage interviews across multiple jobs and candidates.

---

# Scope

Included in MVP

- Month View
- Week View
- Day View
- View Scheduled Interviews
- Navigate Between Dates
- Open Interview Details
- Quick Status Updates
- Filters

---

# Out of Scope

- Drag & Drop Scheduling
- Calendar Synchronization
- Google Calendar
- Outlook Calendar
- Room Reservation
- Resource Scheduling

---

# User Story

As a recruiter,

I want to see all interviews on a calendar,

So that I can organize my recruitment schedule efficiently.

---

# Route

```
/dashboard/interviews/calendar
```

Authentication

Required

Permissions

- Recruiter
- Administrator

---

# Calendar Views

Supported Views

- Month
- Week
- Day

Default

Month View

---

# Navigation

Users can

- Go to Previous
- Go to Next
- Jump to Today
- Select Specific Date

---

# Interview Event

Each calendar event displays

- Candidate Name
- Job Title
- Interview Type
- Time
- Status

Color indicates interview status.

---

# Interview Status Colors

Scheduled

Blue

In Progress

Orange

Completed

Green

Cancelled

Gray

No Show

Red

---

# Filters

Recruiter

Display interviews assigned to a specific recruiter.

---

Job

Filter by job posting.

---

Interview Type

- HR
- Technical
- Team Lead
- Manager
- Final
- Custom

---

Interview Status

- Scheduled
- In Progress
- Completed
- Cancelled
- No Show

---

# Calendar Event

Clicking an event opens

Interview Details Drawer

Display

- Candidate
- Job
- Interview Type
- Date
- Time
- Recruiter
- Meeting Link
- Location
- Public Notes
- Internal Notes
- Status

Actions

- Edit
- Complete
- Cancel
- Open Candidate Profile

---

# Quick Status Update

Recruiters can update status directly from the drawer.

Supported

- Scheduled
- In Progress
- Completed
- Cancelled
- No Show

Timeline updates automatically.

---

# Today's Interviews

Display a summary section.

Example

```
Today's Interviews

09:00 HR Interview

11:30 Technical Interview

15:00 Final Interview
```

---

# Upcoming Interviews

Display

Next 7 Days

Optional collapsible panel.

---

# Schedule Conflicts

The system should detect overlapping interviews for the same recruiter.

Display warning

```
Schedule Conflict Detected
```

Creation is still allowed.

---

# Empty State

Title

```
No interviews scheduled.
```

Description

```
There are no interviews for the selected period.
```

---

# Loading State

Display Calendar Skeleton.

---

# Error State

Display generic dashboard error.

---

# API Specification

## Calendar Events

GET

```
/interviews/calendar
```

Supports

- Date Range
- Recruiter
- Job
- Status
- Type

---

## Update Interview Status

PATCH

```
/interviews/:interviewId/status
```

---

# Business Rules

- Only scheduled interviews appear on the calendar.
- Cancelled interviews remain visible unless filtered out.
- Completed interviews remain visible historically.
- Changing interview status updates the candidate timeline.
- Calendar only displays interviews belonging to the current organization.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

---

# Database Impact

Read

- Interview Processes
- Interview Stages
- Candidates
- Jobs

Write

- Interview Status

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Focus Indicators
- Accessible Calendar Navigation

---

# Internationalization

Supported Languages

- Persian
- English

Calendar should support

- Gregorian
- Jalali

The displayed calendar system follows user preferences.

---

# Analytics Events

- Calendar Viewed
- Calendar View Changed
- Calendar Filter Changed
- Interview Opened
- Interview Status Updated

---

# Storybook Components Used

- Calendar
- Drawer
- Card
- Badge
- Avatar
- Tooltip
- Select

---

# New Components Required

## Interview Calendar

Reusable calendar component supporting

- Month View
- Week View
- Day View

---

## Interview Event Card

Displays

- Candidate
- Time
- Type
- Status

---

## Interview Details Drawer

Displays

- Interview Information
- Notes
- Status
- Actions

Reusable across future scheduling features.

---

# Backend Tasks

- Calendar Endpoint
- Date Range Filtering
- Conflict Detection
- Status Update Endpoint

---

# Frontend Tasks

- Calendar Page
- Calendar Navigation
- Filters
- Interview Drawer
- Quick Status Updates

---

# Acceptance Criteria

- Recruiters can view interviews in Month, Week and Day views.
- Calendar navigation works correctly.
- Filters update results correctly.
- Interview details open from the calendar.
- Status can be updated from the calendar.
- Schedule conflicts are detected.
- The page is fully responsive.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Calendar Integrated
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- Jalali Calendar Verified
- i18n Verified

---

# Future Improvements

- Drag & Drop Rescheduling
- Google Calendar Sync
- Outlook Calendar Sync
- Zoom Integration
- Google Meet Integration
- Room Scheduling
- Multi-Recruiter Scheduling
- Availability Management
- Calendar Notifications
- Interview Capacity Planning