# Dashboard Overview Specification

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
- Statistics Cards
- Recent Jobs
- Recent Candidates
- Sidebar Navigation

## Existing Components

- App Layout
- Sidebar
- Header
- Card
- Button
- Table
- Avatar
- Badge
- Empty State
- Skeleton
- Spinner
- Toast

---

# Overview

The Dashboard is the first page displayed after a successful login.

Its purpose is to provide the organization with a quick overview of its recruitment activities and shortcuts to the most frequently used actions.

This page should present only high-level information.

Detailed management belongs to dedicated modules.

---

# Business Goal

Allow organizations to immediately understand the current status of their hiring process.

Reduce navigation time by surfacing the most important information on a single page.

---

# Scope

Included in MVP

- Statistics Overview
- Recent Job Posts
- Recent Candidates
- Quick Navigation
- Responsive Layout

---

# Out of Scope

- Advanced Analytics
- Custom Dashboard Widgets
- Drag & Drop Layout
- Personalized Dashboard

---

# User Story

As an organization administrator,

I want to see the current hiring status immediately after logging in,

So that I can quickly decide what requires my attention.

---

# User Flow

Login

↓

Redirect to Dashboard

↓

Load Dashboard Data

↓

Display Statistics

↓

Display Recent Jobs

↓

Display Recent Candidates

↓

User Navigates to Desired Section

---

# Page Information

Route

/dashboard

Authentication

Required

Layout

Dashboard Layout

---

# Page Sections

## Header

Contains

- Organization Name
- User Avatar
- Notifications (Future)
- User Menu

---

## Statistics

Contains four statistic cards.

- Total Jobs
- Active Jobs
- Total Candidates
- Total Hired Candidates

---

## Recent Job Posts

Display the latest 10 jobs.

Each row includes

- Job Title
- Status
- Published Date
- Candidate Count

Actions

- View
- Edit

---

## Recent Candidates

Display the latest 10 submitted candidates.

Each row includes

- Candidate Name
- Applied Job
- AI Score
- Status
- Applied Date

Actions

- View Candidate

---

# Empty States

Statistics

Show zero values.

Jobs

Display

"No job postings yet."

Include

Create Job button.

Candidates

Display

"No candidates yet."

---

# Loading State

Display Skeleton Components.

No page jumping.

---

# Error State

Display Error Card.

Include

Retry Button.

---

# UI Components

Reuse Existing Components

- Dashboard Layout
- Header
- Sidebar
- Statistic Card
- Table
- Badge
- Avatar
- Button
- Skeleton
- Empty State

---

# Functional Requirements

Dashboard should request all required information using a single dashboard endpoint.

Data should be loaded in parallel where applicable.

Statistics must always reflect the latest database state.

---

# API Specification

Endpoint

GET /dashboard

Authentication

Required

---

Success Response

```json
{
  "statistics": {
    "totalJobs": 18,
    "activeJobs": 7,
    "totalCandidates": 248,
    "totalHired": 9
  },
  "recentJobs": [],
  "recentCandidates": []
}
```

---

# Business Rules

- Only organization members can access dashboard.
- Dashboard data belongs only to the current organization.
- Maximum 10 jobs returned.
- Maximum 10 candidates returned.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation

---

# Performance Requirements

Dashboard should load within 2 seconds under normal conditions.

Statistics query should be optimized.

Recent jobs and candidates should use pagination internally.

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Visible Focus States

---

# Internationalization

Supported Languages

- Persian
- English

All labels must support translation.

---

# Analytics Events

- Dashboard Viewed
- Recent Job Opened
- Candidate Opened

---

# Storybook Components Used

- Statistic Card
- Table
- Badge
- Button
- Avatar
- Skeleton
- Empty State

---

# New Components Required

None

---

# Backend Tasks

- Dashboard Endpoint
- Statistics Query
- Recent Jobs Query
- Recent Candidates Query

---

# Frontend Tasks

- Dashboard Page
- Statistics Cards
- Recent Jobs Table
- Recent Candidates Table
- Loading State
- Empty State
- Error State

---

# Acceptance Criteria

- Dashboard loads after successful login.
- Statistics display correct values.
- Latest 10 jobs are displayed.
- Latest 10 candidates are displayed.
- Empty states are shown correctly.
- Loading states are displayed while fetching data.
- Unauthorized users cannot access the page.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Responsive Design Completed
- Accessibility Verified
- i18n Completed
- Dark Mode Verified
- Storybook Components Reused

---

# Future Improvements

- Custom Dashboard Widgets
- Charts
- Hiring Funnel
- Activity Feed
- Notification Center
- Team Performance Metrics
```