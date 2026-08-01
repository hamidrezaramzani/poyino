# Public Job Page Specification

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

- Publish Job
- Job Details
- Job Expiration
- Apply Flow

## Existing Components

- Card
- Badge
- Button
- Divider
- Empty State
- Skeleton
- Alert

---

# Overview

The Public Job Page is the public landing page for a published job posting.

Candidates can read the job details and start the application process from this page.

No authentication is required.

This page is the primary entry point for candidates.

---

# Business Goal

Provide a clean, professional and responsive public job page where candidates can easily understand the position and start their application.

---

# Scope

Included in MVP

- Public Job Details
- Company Information
- Apply Button
- Expired Job Handling
- Job Not Found
- Responsive Design
- SEO Metadata

---

# Out of Scope

- Related Jobs
- Social Sharing
- Company Reviews
- Comments
- Similar Positions

---

# User Story

As a candidate,

I want to read a job posting,

So that I can decide whether I want to apply.

---

# Route

```
/jobs/:publicSlug
```

Authentication

Not Required

---

# Page Layout

Sections

1. Header
2. Company Information
3. Job Overview
4. Job Description
5. Responsibilities
6. Requirements
7. Benefits
8. Apply CTA

---

# Header

Display

- Job Title
- Organization Name
- Employment Type
- Workplace Type
- Location

---

# Company Information

Display

- Company Logo
- Company Name
- Short Description (optional)

---

# Job Overview

Display

- Employment Type
- Workplace Type
- Department (optional)
- Number of Positions
- Published Date
- Expiration Date (if available)

---

# Job Description

Display

Rich Text

---

# Responsibilities

Display

Bullet List

---

# Requirements

Display

Bullet List

---

# Benefits

Display

Bullet List

Hide section if empty.

---

# Apply CTA

Primary Button

Apply Now

Clicking the button starts the Apply Flow.

---

# Job Status

Visible

- Published

Hidden

- Draft
- Archived
- Deleted
- Expired

---

# Expired Job

Display

Title

This job is no longer accepting applications.

Description

The application deadline has passed.

Hide Apply Button.

---

# Job Not Found

Display

404 Illustration

Title

Job not found

Description

The requested job does not exist or is no longer available.

---

# Loading State

Display Skeletons for

- Header
- Description
- Sections

---

# Success State

Display all available job information.

---

# Failure State

404

Job not found.

Unexpected server errors return a generic error page.

---

# SEO

Generate dynamically

- Title
- Description
- Open Graph Title
- Open Graph Description

Canonical URL

Required

---

# Accessibility

- Keyboard Navigation
- Semantic HTML
- Screen Reader Support
- Proper Heading Hierarchy
- Focus Indicators

---

# Internationalization

Supported Languages

- Persian
- English

The page language follows the organization's default language.

---

# API Specification

## Get Public Job

GET

```
/public/jobs/:slug
```

Authentication

Not Required

---

Success Response

```json
{
  "title": "Senior Frontend Developer",
  "organization": {
    "name": "Acme Inc.",
    "logo": "..."
  },
  "description": "...",
  "responsibilities": [],
  "requirements": [],
  "benefits": [],
  "employmentType": "Full-time",
  "workplaceType": "Hybrid",
  "location": "Tehran",
  "expirationDate": "2026-10-01"
}
```

---

# Business Rules

- Only published jobs are publicly accessible.
- Expired jobs cannot receive applications.
- Archived jobs are inaccessible.
- Deleted jobs return 404.
- Draft jobs return 404.
- Organization branding is displayed if available.

---

# Security

- Public Endpoint
- Rate Limiting
- No Sensitive Information Returned

---

# Database Impact

Read Only

Tables

- Jobs
- Organizations

---

# Analytics Events

- Public Job Viewed
- Apply Button Clicked

---

# Storybook Components Used

- Card
- Badge
- Button
- Skeleton
- Alert
- Empty State

---

# New Components Required

None

---

# Backend Tasks

- Public Job Endpoint
- Slug Lookup
- Status Validation
- Expiration Validation

---

# Frontend Tasks

- Public Job Page
- Responsive Layout
- Apply Button
- Error Pages
- SEO Metadata

---

# Acceptance Criteria

- Published jobs are publicly accessible.
- Draft, archived, deleted and expired jobs return 404 or appropriate messages.
- Apply button is visible only when applications are allowed.
- Page is fully responsive.
- Company branding is displayed correctly.
- SEO metadata is generated dynamically.

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

- Similar Jobs
- Social Sharing
- Company Profile Page
- Bookmark Job
- Print Version
- Job View Analytics