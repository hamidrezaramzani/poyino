# Departments Specification

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

- Organization Profile
- Members
- Roles
- Permissions
- Jobs
- Interview Process

## Existing Components

- Card
- Table
- Modal
- Input
- Select
- Button
- Badge
- Empty State
- Alert

---

# Overview

Departments organize the workspace into functional business units.

Every job belongs to a department.

Every member belongs to one primary department.

Department membership determines the default visibility of jobs, candidates, interviews and future resources.

Departments are one of the core authorization boundaries of the platform.

---

# Business Goal

Allow organizations to separate recruitment activities between departments while keeping everything inside one organization.

---

# Scope

Included in MVP

- Create Department
- Edit Department
- Archive Department
- Restore Department
- Department Manager
- Department Description
- Department Statistics

---

# Out of Scope

- Nested Departments
- Department Hierarchy
- Cross Organization Departments

---

# User Story

As an organization owner,

I want to organize my company into departments,

So that members only access the information relevant to their team.

---

# Route

```
/dashboard/settings/departments
```

Authentication

Required

Permissions

Owner

Administrator

---

# Department Entity

Each department contains

- Members
- Jobs
- Candidates
- Interviews
- Analytics

Examples

- Human Resources
- Engineering
- Warehouse
- Sales
- Finance
- Marketing

---

# Department Fields

## Name

Required

Maximum

100 characters

Must be unique within the organization.

---

## Description

Optional

Maximum

1000 characters

---

## Manager

Optional

One member can be assigned as department manager.

Manager has no additional permissions by default.

Permissions are controlled separately through Roles.

---

## Color

Optional

Used for

- Calendar
- Dashboard
- Department Badge

---

## Icon

Optional

Future use.

---

# Create Department

Required

- Name

Optional

- Description
- Manager
- Color

After creation

Department becomes available

- During Job Creation
- Member Assignment
- Dashboard Filters
- Analytics

---

# Edit Department

Editable

- Name
- Description
- Manager
- Color

All updates take effect immediately.

---

# Archive Department

Departments cannot be permanently deleted if they contain

- Members
- Jobs
- Candidates

Instead

Status

↓

Archived

Archived departments

- Cannot receive new jobs
- Cannot receive new members
- Remain visible in historical records

---

# Restore Department

Archived departments can be restored.

---

# Default Department

Every organization starts with

```
General
```

This department

- Cannot be deleted
- Cannot be archived

It is used for members or jobs without a dedicated department.

---

# Department Statistics

Display

- Total Members
- Active Jobs
- Total Candidates
- Scheduled Interviews

---

# Department Visibility

Departments are visible only inside the organization.

Public users never see department information.

---

# Job Relationship

Every job belongs to exactly one department.

Example

```
Warehouse Worker

↓

Warehouse
```

---

# Candidate Relationship

Candidates inherit the department from the job they applied for.

Candidates cannot belong to multiple departments simultaneously.

---

# Interview Relationship

Interview visibility follows department visibility.

Only authorized members may access interview information.

---

# Validation

Required

Department Name

Unique within organization.

---

# Loading State

Display table skeleton.

---

# Error State

Display generic dashboard error.

---

# API Specification

## List Departments

GET

```
/organization/departments
```

---

## Create Department

POST

```
/organization/departments
```

---

## Update Department

PATCH

```
/organization/departments/:departmentId
```

---

## Archive Department

PATCH

```
/organization/departments/:departmentId/archive
```

---

## Restore Department

PATCH

```
/organization/departments/:departmentId/restore
```

---

# Business Rules

- Every job belongs to one department.
- Every member has one primary department.
- Department names must be unique.
- General department always exists.
- Archived departments remain in history.
- Departments with active resources cannot be deleted.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

---

# Database Impact

Create

- Department

Update

- Job
- Member
- Candidate

Relationships

Organization

↓

Department

↓

Members / Jobs / Candidates

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Accessible Tables
- Accessible Forms

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Department Created
- Department Updated
- Department Archived
- Department Restored

---

# Storybook Components Used

- Table
- Card
- Modal
- Badge
- Button
- Input

---

# New Components Required

## Department Table

Displays

- Name
- Manager
- Members
- Jobs
- Status

---

## Department Form

Reusable for

- Create
- Edit

---

## Department Statistics Card

Displays

- Members
- Jobs
- Candidates
- Interviews

---

# Backend Tasks

- Department CRUD
- Archive Logic
- Validation
- Statistics Endpoint

---

# Frontend Tasks

- Departments Page
- Create Department Modal
- Edit Department Modal
- Archive Flow
- Statistics Cards

---

# Acceptance Criteria

- Owners and administrators can manage departments.
- Every job belongs to one department.
- Department statistics are displayed.
- Archived departments remain available historically.
- General department always exists.
- Feature is fully responsive.

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

- Department Hierarchy
- Multiple Managers
- Department Budget
- Department Goals
- Department Analytics Dashboard
- Department Avatar
- Department Permissions
- Cross-Department Collaboration
- Department Transfer History