# Edit Job Specification

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

- Create Job
- Job Details
- Publish Job
- Job Templates

## Existing Components

- Form
- Input
- Textarea
- Rich Text Editor
- Select
- Multi Select
- Date Picker
- Button
- Loading Button
- Card
- Divider
- Toast
- Alert

---

# Overview

The Edit Job feature allows organizations to modify an existing job posting.

Every editable field available during job creation can also be modified after the job has been created.

Changes should be reflected immediately after saving.

---

# Business Goal

Allow recruiters to keep job postings accurate and up to date throughout the hiring process.

---

# Scope

Included in MVP

- Edit Job Information
- Edit Description
- Edit Skills
- Edit Salary
- Edit Expiration Date
- Save Changes

---

# Out of Scope

- Version History
- Change Tracking
- Restore Previous Version
- Collaborative Editing

---

# User Story

As an organization administrator,

I want to edit an existing job,

So that I can keep the information accurate without creating a new job.

---

# User Flow

Open Job Details

↓

Click Edit

↓

Load Existing Information

↓

Modify Fields

↓

Save

↓

Validate

↓

Update Job

↓

Return To Job Details

---

# Page Information

Route

/jobs/:jobId/edit

Authentication

Required

Layout

Dashboard Layout

---

# Editable Fields

## Basic Information

- Job Title
- Department
- Employment Type
- Workplace Type
- Location

---

## Salary

- Minimum Salary
- Maximum Salary
- Currency
- Salary Visibility

---

## Description

- Description
- Responsibilities
- Requirements
- Benefits

---

## Skills

- Required Skills

---

## Hiring

- Number of Positions
- Expiration Date

---

# Validation Rules

Same validation rules as Create Job.

Additionally

- Edited expiration date cannot be earlier than today.
- Maximum salary must be greater than minimum salary.

---

# User Interactions

- Edit fields
- Save changes
- Cancel editing
- Leave page with unsaved changes

---

# Unsaved Changes

If the user attempts to leave the page with unsaved changes,

Display confirmation dialog.

Buttons

- Stay
- Leave

---

# Loading State

- Display Skeleton while loading job.
- Disable form while saving.
- Show Loading Button.

---

# Success State

Toast

```text
Job updated successfully.
```

Redirect

/jobs/:jobId

---

# Failure State

Validation errors appear below related fields.

Unexpected server errors appear using Toast.

---

# API Specification

## Get Job

GET

/jobs/:jobId

---

## Update Job

PUT

/jobs/:jobId

Authentication

Required

---

Request

```json
{
  "title": "Senior Frontend Developer",
  "department": "Engineering",
  "employmentType": "FULL_TIME",
  "workplaceType": "REMOTE",
  "location": "Tehran",
  "salaryMin": 2500,
  "salaryMax": 3500,
  "salaryVisible": true,
  "description": "...",
  "responsibilities": "...",
  "requirements": "...",
  "benefits": "...",
  "skills": [
    "React",
    "TypeScript"
  ],
  "positions": 2,
  "expirationDate": "2026-08-30"
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

- Only the owning organization may edit a job.
- Archived jobs remain editable.
- Published jobs remain published after editing.
- Existing applications remain attached to the job.
- Editing a job never changes its public URL.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation
- Rate Limiting

---

# Database Impact

Update

Job

Related Tables

- Job
- JobSkills

Updated Fields

- updatedAt

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

---

# Analytics Events

- Edit Job Viewed
- Job Updated
- Job Update Failed

---

# Storybook Components Used

- Form
- Input
- Textarea
- Rich Text Editor
- Select
- Multi Select
- Date Picker
- Button
- Loading Button
- Card
- Divider
- Alert
- Toast

---

# New Components Required

None

---

# Backend Tasks

- Get Job Endpoint
- Update Job Endpoint
- Validation
- Authorization

---

# Frontend Tasks

- Edit Job Page
- Load Existing Data
- Form Validation
- API Integration
- Unsaved Changes Guard

---

# Acceptance Criteria

- Existing job data loads correctly.
- User can edit every supported field.
- Validation rules are enforced.
- Changes are saved successfully.
- User is redirected back to Job Details.
- Unsaved changes warning is displayed.
- Only organization-owned jobs can be edited.

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

- Version History
- Activity Timeline
- Restore Previous Version
- Real-time Collaborative Editing
- Change Audit Log
```