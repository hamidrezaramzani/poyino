# Statistics Cards Specification

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

- Dashboard Overview

## Existing Components

- Card
- Icon
- Skeleton
- Tooltip

---

# Overview

Statistics Cards provide a quick overview of the organization's recruitment performance.

They are displayed at the top of the Dashboard and summarize the most important hiring metrics.

Each card is clickable and redirects users to the related module.

---

# Business Goal

Allow users to understand the overall recruitment status within a few seconds after opening the dashboard.

---

# Scope

Included in MVP

- Four statistic cards
- Responsive layout
- Loading state
- Empty state
- Navigation

---

# Out of Scope

- Animated counters
- Historical comparison
- Trend charts
- Customizable cards

---

# User Story

As an organization administrator,

I want to quickly see important recruitment metrics,

So that I can immediately understand the current status of my hiring process.

---

# User Flow

Dashboard Opens

↓

Statistics Requested

↓

Cards Displayed

↓

User Clicks Card

↓

Navigate To Related Module

---

# Component Layout

Responsive Grid

Desktop

4 Columns

Tablet

2 Columns

Mobile

1 Column

---

# Cards

## Total Jobs

Description

Total number of created job postings.

Navigation

Job List

Icon

Briefcase

---

## Active Jobs

Description

Number of currently published jobs.

Navigation

Filtered Job List

Status = Published

Icon

Rocket

---

## Total Candidates

Description

Total submitted applications.

Navigation

Candidate List

Icon

Users

---

## Total Hired

Description

Number of hired candidates.

Navigation

Candidate List

Status = Hired

Icon

Badge Check

---

# Card Structure

Each card contains

- Icon
- Title
- Numeric Value
- Optional Description

Entire card is clickable.

---

# Empty State

Display

0

for every metric.

---

# Loading State

Display Skeleton Card.

Maintain layout to prevent page shifting.

---

# Error State

Display placeholder value.

Show Tooltip

"Unable to load statistics."

---

# UI Components

Reuse Existing Components

- Card
- Skeleton
- Icon
- Tooltip

No new reusable component is required.

---

# Functional Requirements

Statistics must always belong to the currently authenticated organization.

All values must be calculated on the backend.

Frontend must not perform calculations.

---

# API Specification

Statistics are returned by

GET /dashboard

No dedicated endpoint is required.

---

Example Response

```json
{
  "statistics": {
    "totalJobs": 18,
    "activeJobs": 7,
    "totalCandidates": 248,
    "totalHired": 9
}
}
```

---

# Business Rules

Total Jobs

Includes

- Draft
- Published
- Archived

Deleted jobs are excluded.

---

Active Jobs

Only Published jobs.

---

Total Candidates

Includes every submitted application.

---

Total Hired

Only candidates with

Status = Hired

---

# Performance Requirements

Statistics query should execute using aggregate database queries.

Avoid loading full records.

---

# Security

- Authentication Required
- Organization Isolation

---

# Accessibility

- Keyboard Focus
- Screen Reader Labels
- Visible Focus States

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Statistics Card Viewed
- Statistics Card Clicked

---

# Storybook Components Used

- Card
- Skeleton
- Tooltip

---

# New Components Required

None

---

# Backend Tasks

- Aggregate Statistics Query
- Dashboard DTO

---

# Frontend Tasks

- Statistics Card Component
- Responsive Grid
- Skeleton State
- Navigation

---

# Acceptance Criteria

- Four cards are displayed.
- Statistics are accurate.
- Cards navigate correctly.
- Loading state is shown while fetching.
- Empty values display as 0.
- Cards are fully responsive.

---

# Definition of Done

- Backend Completed
- Frontend Completed
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified

---

# Future Improvements

- Growth Percentage
- Weekly Comparison
- Monthly Comparison
- Animated Counters
- Custom Dashboard Widgets
- Configurable Metrics