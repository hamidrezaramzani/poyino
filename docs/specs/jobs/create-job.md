# Create Job Specification

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

- Job Templates
- AI Job Generator
- Job List
- Publish Job
- Job Details

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

## New Components Required

None

---

# Overview

The Create Job feature allows an organization to create a new job posting.

A job can be created manually or generated from an existing template.

After creation, the job remains in **Draft** status until it is published.

---

# Business Goal

Reduce the time required to create high-quality job postings while providing a structured and consistent experience.

---

# Scope

Included in MVP

- Create Job
- Save Draft
- AI Assisted Generation
- Create From Template
- Validation
- Publish Later

---

# Out of Scope

- Auto Translation
- Collaborative Editing
- Version History
- Auto Save

---

# User Story

As an organization administrator,

I want to create a new job posting,

So that candidates can apply for the position.

---

# User Flow

Jobs

↓

Create Job

↓

(Optional)

Choose Template

↓

(Optional)

Generate With AI

↓

Fill Form

↓

Save Draft

↓

Publish Later

---

# Page Information

Route

/jobs/create

Authentication

Required

Layout

Dashboard Layout

---

# Form Sections

## Basic Information

### Job Title

Type

Text

Required

Yes

Minimum Length

3

Maximum Length

100

---

### Department

Type

Text

Required

No

Maximum Length

80

---

### Employment Type

Type

Select

Required

Yes

Options

- Full Time
- Part Time
- Contract
- Internship
- Temporary

---

### Workplace Type

Type

Select

Required

Yes

Options

- On-site
- Hybrid
- Remote

---

### Location

Type

Text

Required

No

Maximum Length

120

---

## Salary Information

### Salary Range

Type

Range Input

Required

No

Fields

- Minimum Salary
- Maximum Salary

---

### Currency

Type

Select

Required

No

Default

Organization Default

---

### Salary Visibility

Type

Select

Required

Yes

Options

- Visible
- Hidden

---

## Job Description

### Description

Type

Rich Text Editor

Required

Yes

Minimum Length

50

---

### Responsibilities

Type

Rich Text Editor

Required

No

---

### Requirements

Type

Rich Text Editor

Required

No

---

### Benefits

Type

Rich Text Editor

Required

No

---

## Skills

### Required Skills

Type

Multi Select

Required

No

User may create new skills.

---

## Hiring Information

### Number of Positions

Type

Number

Required

Yes

Minimum

1

Maximum

999

Default

1

---

### Expiration Date

Type

Date Picker

Required

No

Job remains active until manually archived if empty.

---

# AI Generation

User can provide a short description.

Example

> We are looking for a Senior React Developer with 5 years of experience.

AI generates

- Job Title
- Description
- Responsibilities
- Requirements
- Benefits

Generated content remains editable.

---

# Template Support

User may choose an existing Job Template.

The template pre-fills the form.

All fields remain editable.

---

# Validation Rules

Job Title

- Required
- 3–100 characters

Employment Type

- Required

Workplace Type

- Required

Description

- Required
- Minimum 50 characters

Number of Positions

- Required
- Minimum 1

Expiration Date

- Cannot be earlier than today

Salary

- Maximum must be greater than minimum

---

# Actions

## Save Draft

Creates the job with

Status

Draft

Redirect

Job Details

---

## Cancel

Show confirmation dialog if there are unsaved changes.

---

# Loading State

- Disable form
- Show Loading Button

---

# Success State

Toast

```text
Job created successfully.
```

Redirect

/jobs/:id

---

# Failure State

Validation errors appear below related fields.

Unexpected errors appear using Toast.

---

# API Specification

## Create Job

POST

/jobs

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
    "TypeScript",
    "Next.js"
  ],
  "positions": 2,
  "expirationDate": "2026-08-30"
}
```

---

Success Response

HTTP 201

```json
{
  "id": "job_123",
  "status": "draft"
}
```

---

# Business Rules

- Every new job starts as Draft.
- Job Title is required.
- Description is required.
- Published jobs must have valid content.
- Organization owns every created job.
- Deleted jobs cannot be restored in MVP.

---

# Security

- Authentication Required
- Authorization Required
- Organization Isolation
- Rate Limiting
- Input Validation

---

# Database Impact

Create Job

Fields

- organizationId
- title
- department
- employmentType
- workplaceType
- location
- salaryMin
- salaryMax
- salaryVisible
- description
- responsibilities
- requirements
- benefits
- positions
- expirationDate
- status
- createdAt
- updatedAt

Related Tables

- JobSkills

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

- Create Job Viewed
- Job Created
- Draft Saved
- AI Generation Used
- Template Selected

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

# Backend Tasks

- Create Job Endpoint
- Validation
- AI Generation Endpoint
- Template Loading
- Skill Relationship

---

# Frontend Tasks

- Create Job Page
- Form Validation
- Template Integration
- AI Generation
- API Integration
- Unsaved Changes Guard

---

# Acceptance Criteria

- User can manually create a job.
- User can create a job from a template.
- AI can generate job content.
- Draft is saved successfully.
- Validation rules are enforced.
- User is redirected to Job Details after creation.
- Unsaved changes warning is displayed.

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

- Auto Save
- Job Version History
- AI Salary Recommendation
- AI Skill Recommendation
- Duplicate Existing Job
- Multi-language Job Posts
- Collaborative Editing