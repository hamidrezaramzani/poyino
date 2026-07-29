# Recent Candidates Specification

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
- Candidate List
- Candidate Details

## Existing Components

- Card
- Table
- Avatar
- Badge
- Button
- Skeleton
- Empty State

---

# Overview

The Recent Candidates section displays the latest submitted job applications on the Dashboard.

Its purpose is to allow recruiters to immediately see newly submitted candidates without navigating to the Candidates module.

Only the latest applications are displayed.

---

# Business Goal

Reduce recruiter response time by highlighting the most recent applications directly on the Dashboard.

---

# Scope

Included in MVP

- Display latest 10 submitted candidates
- Show application summary
- Quick navigation to Candidate Details
- Loading state
- Empty state

---

# Out of Scope

- Pagination
- Sorting
- Filtering
- Bulk Actions
- Candidate Status Update

---

# User Story

As an organization administrator,

I want to immediately see new applications,

So that I can review candidates as soon as possible.

---

# User Flow

Dashboard Opens

↓

Request Recent Candidates

↓

Display Latest Applications

↓

User Opens Candidate

↓

Navigate To Candidate Details

---

# Component Layout

Card

Header

- Title
- View All Button

Body

Table

Footer

None

---

# Table Columns

## Candidate

Display

- Full Name
- Avatar (Initial if no avatar)

Clicking the name opens Candidate Details.

---

## Applied Job

Display job title.

Clicking opens Job Details.

---

## AI Score

Display score between 0 and 100.

Display as colored badge.

Color Rules

- 80–100 → Success
- 60–79 → Warning
- Below 60 → Danger

If AI analysis has not completed, display

"Analyzing..."

---

## Status

Display candidate status.

Available values

- Applied
- Reviewing
- Interview Scheduled
- Interview Passed
- Rejected
- Hired

Display using Badge component.

---

## Applied Date

Display application submission date.

Use Jalali calendar.

---

## Actions

Button

View Candidate

---

# Maximum Records

Display only the latest 10 submitted candidates.

Order

Submitted Date DESC

---

# Empty State

Display

"No candidates have applied yet."

No action button is required.

---

# Loading State

Display table skeleton.

Preserve layout dimensions.

---

# Error State

Display Error Card.

Include Retry button.

---

# UI Components

Reuse Existing Components

- Card
- Table
- Avatar
- Badge
- Button
- Skeleton
- Empty State

No new reusable components are required.

---

# Functional Requirements

Only candidates belonging to the authenticated organization must be returned.

Only active applications should be displayed.

Deleted applications must never appear.

AI score should be displayed only after analysis is completed.

---

# API Specification

Data is returned by

GET /dashboard

No dedicated endpoint is required.

---

Example Response

```json
{
  "recentCandidates": [
    {
      "id": "candidate_1",
      "fullName": "John Doe",
      "jobTitle": "Frontend Developer",
      "status": "reviewing",
      "aiScore": 86,
      "submittedAt": "2026-07-29T08:30:00Z"
    }
  ]
}
```

---

# Business Rules

- Maximum 10 candidates.
- Ordered by submission date descending.
- Organization isolation is required.
- Deleted applications are excluded.
- Candidate status reflects the latest state.

---

# Performance Requirements

Query should use

LIMIT 10

Only required fields should be selected.

AI score should be retrieved without recalculating the analysis.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation

---

# Accessibility

- Keyboard Navigation
- Screen Reader Labels
- Visible Focus States

---

# Internationalization

Supported Languages

- Persian
- English

Dates should be displayed using Jalali format according to project settings.

---

# Analytics Events

- Recent Candidates Viewed
- Candidate Opened
- Job Opened From Candidate
- View All Candidates Clicked

---

# Storybook Components Used

- Card
- Table
- Avatar
- Badge
- Button
- Skeleton
- Empty State

---

# New Components Required

None

---

# Backend Tasks

- Dashboard Recent Candidates Query
- AI Score Projection
- Dashboard DTO Update

---

# Frontend Tasks

- Recent Candidates Card
- Candidates Table
- Loading State
- Empty State
- Navigation
- AI Score Badge

---

# Acceptance Criteria

- Latest 10 candidates are displayed.
- Candidate name opens Candidate Details.
- Job title is displayed correctly.
- AI score is displayed after analysis.
- Candidate status badge is correct.
- Empty state appears when no candidates exist.
- Loading state is displayed while fetching.
- Only organization candidates are visible.

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

- Candidate Priority Indicator
- Resume Preview
- AI Summary Tooltip
- Quick Status Change
- Live Updates
- Recently Viewed Candidates
- Candidate Activity Timeline