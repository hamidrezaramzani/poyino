# Candidate List Specification

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

- Candidate Application
- Candidate Profile
- Job Management
- AI Infrastructure

## Existing Components

- Data Table
- Badge
- Avatar
- Button
- Dropdown Menu
- Search Input
- Select
- Pagination
- Empty State
- Skeleton
- Tooltip

---

# Overview

The Candidate List is the main workspace for recruiters.

It displays every application submitted for the selected job.

Recruiters can search, filter, sort and quickly review candidates before opening their full profile.

This page is expected to be the most frequently used page inside the HR dashboard.

---

# Business Goal

Provide recruiters with a fast and efficient overview of all candidates while prioritizing the best matches using AI-assisted ranking.

---

# Scope

Included in MVP

- Candidate Table
- Search
- Filters
- Sorting
- Pagination
- AI Match Score
- Candidate Status
- Quick Actions

---

# Out of Scope

- Bulk Actions
- CSV Export
- Candidate Comparison
- Kanban View
- Saved Filters

---

# User Story

As a recruiter,

I want to quickly find and review candidates,

So that I can efficiently identify the best applicants.

---

# Route

```
/dashboard/jobs/:jobId/candidates
```

Authentication

Required

Permissions

Recruiter

Administrator

---

# Page Layout

Sections

1. Page Header
2. Statistics
3. Search & Filters
4. Candidate Table
5. Pagination

---

# Header

Display

- Job Title
- Number of Applications
- Last Updated

Actions

- Refresh

---

# Statistics

Display

- Total Candidates
- Under Review
- Interview Scheduled
- Hired
- Rejected

---

# Search

Search by

- Full Name
- Email
- Phone Number

Search should be debounced.

Delay

300ms

---

# Filters

Status

- Submitted
- Under Review
- Interview Scheduled
- Interview Completed
- Hired
- Rejected

Experience Level

- Junior
- Mid-Level
- Senior

Education

Dynamic

Application Date

- Today
- Last 7 Days
- Last 30 Days
- Custom Range

---

# Sorting

Supported Fields

- AI Match Score
- Application Date
- Candidate Name

Default

AI Match Score (Descending)

---

# Candidate Table

Columns

## Candidate

Display

- Avatar
- Full Name
- Current Position

---

## AI Match

Display

Percentage

Example

```
92%
```

Color

90-100

Green

70-89

Yellow

Below 70

Gray

---

## Experience

Display

Years

Example

```
6 Years
```

---

## Skills

Display

Maximum

3 Skills

Example

```
React

TypeScript

NestJS

+4
```

---

## Applied

Display

Date

---

## Status

Display

Badge

Values

- Submitted
- Under Review
- Interview Scheduled
- Interview Completed
- Hired
- Rejected

---

## Actions

Buttons

- View Profile

Future

- Bookmark
- Reject
- Schedule Interview

---

# Empty State

Title

No candidates found

Description

No applications match your current filters.

---

# Loading State

Display

Skeleton Table

---

# Candidate Ranking

Candidates are automatically sorted by

AI Match Score

Descending

Recruiters can manually change sorting.

---

# Pagination

Server-side

Default

20 Candidates

Supported

10

20

50

100

---

# Quick Actions

Current

- Open Candidate Profile

Future

- Bookmark
- Reject
- Schedule Interview
- Send Email

---

# API Specification

## Get Candidates

GET

```
/jobs/:jobId/candidates
```

Supports

- Search
- Filters
- Sorting
- Pagination

---

Success Response

```json
{
  "items": [],
  "total": 125,
  "page": 1,
  "pageSize": 20
}
```

---

# Business Rules

- Only candidates belonging to the selected job are displayed.
- Deleted applications are hidden.
- AI Match Score is calculated during resume analysis.
- Recruiters only see candidates they have permission to access.

---

# Security

Authentication Required

Authorization Required

Server-side Filtering

Server-side Pagination

---

# Database Impact

Read

- Candidates
- Applications
- Jobs
- AI Analysis

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Focus Indicators
- Accessible Table

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Candidate List Viewed
- Search Used
- Filter Changed
- Candidate Profile Opened

---

# Storybook Components Used

- Data Table
- Badge
- Avatar
- Pagination
- Search Input
- Select
- Skeleton
- Empty State

---

# New Components Required

## Candidate Row

Displays

- Candidate Information
- AI Match
- Status
- Quick Actions

Reusable inside the Data Table.

---

## Candidate Statistics Cards

Displays

- Total
- Under Review
- Interview
- Hired
- Rejected

---

# Backend Tasks

- Candidate List Endpoint
- Search
- Filtering
- Sorting
- Pagination
- AI Match Score Retrieval

---

# Frontend Tasks

- Candidate Table
- Statistics Cards
- Search
- Filters
- Pagination
- Empty State

---

# Acceptance Criteria

- Recruiters can view all candidates for a job.
- Search works correctly.
- Filters work correctly.
- Pagination works correctly.
- AI Match Score is displayed.
- Candidates are sorted by AI Match Score by default.
- Clicking a row opens the Candidate Profile.
- The page is fully responsive.

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

- Bulk Actions
- Candidate Comparison
- CSV Export
- Saved Filters
- Bookmarking
- Smart AI Filters
- Live Updates
- Kanban View