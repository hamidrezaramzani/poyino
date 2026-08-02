# Department Members Specification

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
- Departments
- Members
- Roles
- Permissions
- Invitations

---

# Overview

Department Members manages which users belong to each department.

Department membership is the primary scope boundary of the platform.

A user's department determines which jobs, candidates, interviews and analytics they can access.

---

# Business Goal

Allow organizations to securely separate recruitment workflows between departments.

---

# Scope

Included in MVP

- Assign Member to Department
- Change Department
- Remove Member
- Department Member List
- Department Manager
- Member Statistics

---

# Out of Scope

- Multiple Department Membership
- Temporary Assignment
- Department Hierarchy

---

# User Story

As an organization administrator,

I want to manage department members,

So that each employee only accesses the resources related to their department.

---

# Route

```
/dashboard/settings/departments/:departmentId/members
```

Authentication

Required

Permissions

- Owner
- Administrator

---

# Membership Model

Each member belongs to exactly one primary department.

Example

```
Ali

↓

Engineering
```

---

# Department Manager

Each department may optionally have one manager.

The manager is still an ordinary member.

Manager permissions are controlled through Roles.

---

# Member Information

Display

- Avatar
- Full Name
- Email
- Role
- Department
- Joined Date
- Status

---

# Status

Possible Values

- Active
- Invited
- Suspended

---

# Assign Member

Available members

Only users inside the organization that are not already assigned elsewhere.

Required

- Member
- Department

Optional

- Role

---

# Change Department

Administrators may move members between departments.

Effects

- Future jobs belong to the new department.
- Future interview assignments follow the new department.
- Historical records remain unchanged.

---

# Remove Member

Removing a member from a department requires assigning them to another department.

A member cannot exist without a department.

---

# Department Statistics

Display

- Total Members
- Recruiters
- Hiring Managers
- Interviewers

---

# Visibility Rules

Department members can access

- Jobs
- Candidates
- Interviews
- Analytics

Only for their assigned department.

Example

```
Warehouse Member

↓

Warehouse Jobs

Warehouse Candidates

Warehouse Interviews

Warehouse Analytics
```

Engineering resources remain inaccessible.

---

# Interview Assignment

When selecting an interviewer,

the default picker should prioritize members from the same department.

Example

```
Warehouse Job

↓

Warehouse Members
```

Users from other departments can still be selected if permissions allow (future feature).

---

# Search

Support

- Name
- Email
- Role

---

# Sorting

Support

- Name
- Join Date
- Role

---

# Empty State

```
No members have been assigned to this department.
```

---

# Loading State

Display table skeleton.

---

# Error State

Display generic dashboard error.

---

# API Specification

## Get Department Members

GET

```
/organization/departments/:departmentId/members
```

---

## Assign Member

POST

```
/organization/departments/:departmentId/members
```

---

## Update Membership

PATCH

```
/organization/departments/:departmentId/members/:memberId
```

---

## Remove Member

DELETE

```
/organization/departments/:departmentId/members/:memberId
```

---

# Business Rules

- Every member belongs to one department.
- Members cannot exist without a department.
- Historical records never change after department transfers.
- Department managers are optional.
- Department manager is still governed by Role permissions.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

Department Scope Enforcement

---

# Database Impact

Relationships

```
Organization

↓

Department

↓

Member
```

Store

- Department ID
- Role ID
- Join Date

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Accessible Tables

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Member Assigned
- Member Transferred
- Member Removed
- Department Manager Assigned

---

# Storybook Components Used

- Table
- Avatar
- Badge
- Select
- Modal
- Button

---

# New Components Required

## Department Member Table

Displays

- Avatar
- Name
- Role
- Status
- Actions

---

## Assign Member Modal

Allows assigning members to departments.

---

## Department Member Statistics

Displays department workforce metrics.

---

# Backend Tasks

- Department Membership CRUD
- Validation
- Statistics Endpoint
- Department Scope Enforcement

---

# Frontend Tasks

- Department Members Page
- Assignment Modal
- Transfer Flow
- Search
- Sorting

---

# Acceptance Criteria

- Members can be assigned to departments.
- Members can be transferred between departments.
- Department statistics are displayed.
- Department visibility rules are enforced.
- Interview assignment prioritizes department members.
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

- Multiple Department Membership
- Temporary Assignment
- Department Capacity
- Department Skills Matrix
- Cross-Department Visibility
- Department Leads
- Organizational Chart