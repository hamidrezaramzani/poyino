# Job Details Specification

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

- Job List
- Create Job
- Edit Job
- Publish Job
- Archive Job
- Candidate Management

## Existing Components

- Card
- Badge
- Button
- Dropdown Menu
- Statistic Card
- Tabs
- Empty State
- Loading Skeleton
- Toast

---

# Overview

The Job Details page is the central place for managing an individual job posting.

It displays all job information, application statistics, and provides quick access to every action related to the job.

---

# Business Goal

Provide recruiters with a complete overview of a job and reduce navigation between different pages.

---

# Scope

Included in MVP

- View Job Information
- View Statistics
- Quick Actions
- Copy Public Link
- View Candidates
- Open Edit Page

---

# Out of Scope

- Activity Timeline
- Version History
- Comments
- Team Collaboration

---

# User Story

As an organization administrator,

I want to view all information about a job,

So that I can manage the hiring process from a single page.

---

# User Flow

Job List

↓

Open Job

↓

View Details

↓

Perform Actions

- Edit
- Publish
- Unpublish
- Archive
- Delete
- View Candidates
- Copy Public Link

---

# Page Information

Route

/jobs/:jobId

Authentication

Required

Layout

Dashboard Layout

---

# Header

Displays

- Job Title
- Status Badge
- Department
- Employment Type
- Workplace Type
- Created Date

---

# Quick Actions

Depending on job status

- Edit
- Publish
- Unpublish
- Archive
- Delete
- Copy Public Link
- View Public Page

---

# Statistics Cards

Display

- Total Applications
- New Applications
- Interview Candidates
- Hired Candidates

---

# Job Information

Display

- Title
- Department
- Employment Type
- Workplace Type
- Location
- Salary
- Number of Positions
- Expiration Date

---

# Job Description

Display

- Description
- Responsibilities
- Requirements
- Benefits

---

# Required Skills

Display all required skills as badges.

---

# Public Information

If Published

Display

- Public URL
- Published Date

Actions

- Copy URL
- Open Public Page

---

# Candidate Summary

Display

- Total Candidates
- Latest Candidate
- View All Candidates Button

Clicking the button redirects to

/jobs/:jobId/candidates

---

# Empty States

If no candidates exist

Display

"No candidates have applied yet."

---

# Status Badges

Possible Values

- Draft
- Published
- Archived

---

# Loading State

Display Skeleton for

- Header
- Statistics
- Description
- Candidate Summary

---

# Success State

Job information loads successfully.

---

# Failure State

404

Display

"Job not found."

Unexpected errors appear using Toast.

---

# API Specification

## Get Job Details

GET

/jobs/:jobId

Authentication

Required

---

Success Response

```json
{
  "id": "job_123",
  "title": "Senior Frontend Developer",
  "status": "PUBLISHED",
  "applications": 34,
  "newApplications": 8,
  "interviews": 5,
  "hired": 1,
  "publicUrl": "/jobs/frontend-123"
}
```

---

# Business Rules

- Organizations can only view their own jobs.
- Statistics update in real time.
- Public URL is shown only for published jobs.
- Candidate statistics are read-only.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation

---

# Database Impact

Read

- Job
- JobSkills
- Candidates
- Interviews

No database modifications.

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

- Job Details Viewed
- Public Link Copied
- Public Page Opened
- View Candidates Clicked

---

# Storybook Components Used

- Card
- Badge
- Button
- Statistic Card
- Tabs
- Dropdown Menu
- Empty State
- Loading Skeleton

---

# New Components Required

## Statistic Card

Displays

- Icon
- Value
- Label

Reusable across Dashboard and Job Details.

---

## Copy Link Button

Reusable component for copying URLs to the clipboard.

---

# Backend Tasks

- Job Details Endpoint
- Candidate Statistics
- Public URL Retrieval

---

# Frontend Tasks

- Job Details Page
- Statistics Cards
- Public Link Actions
- Candidate Summary
- API Integration

---

# Acceptance Criteria

- User can view complete job information.
- Statistics are displayed correctly.
- Status badge reflects the current state.
- Public URL is available only for published jobs.
- User can navigate to the candidate list.
- Organization isolation is enforced.

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

- Activity Timeline
- Audit Log
- Version History
- Notes
- Internal Comments
- Share Job
- Recruitment Progress Chart