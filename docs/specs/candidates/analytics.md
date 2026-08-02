# Recruitment Analytics Specification

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

- Candidate Management
- Candidate Profile
- Job Management
- Dashboard

## Existing Components

- Card
- Statistic Card
- Line Chart
- Bar Chart
- Pie Chart
- Area Chart
- Date Range Picker
- Select
- Skeleton
- Empty State

---

# Overview

Recruitment Analytics provides organizations with insights into their hiring process.

It aggregates recruitment data across jobs, candidates and interviews to help recruiters understand hiring performance.

Analytics are intended for decision-making and reporting, not operational candidate management.

---

# Business Goal

Provide recruiters and managers with clear metrics about hiring performance, recruitment efficiency and candidate pipeline health.

---

# Scope

Included in MVP

- Dashboard Overview
- Hiring Funnel
- Candidate Status Distribution
- Job Performance
- Time to Hire
- Application Trends

---

# Out of Scope

- Predictive Analytics
- AI Hiring Forecast
- Salary Analytics
- Cross-Organization Benchmarking
- Export to PDF
- Scheduled Reports

---

# User Story

As a hiring manager,

I want to understand how my recruitment process is performing,

So that I can identify bottlenecks and improve hiring decisions.

---

# Route

```
/dashboard/analytics
```

Authentication

Required

Permissions

- Recruiter
- Administrator

---

# Page Layout

Sections

1. Overview Statistics
2. Hiring Funnel
3. Candidate Status
4. Job Performance
5. Time Trends
6. Time to Hire

---

# Overview Statistics

Display

- Total Jobs
- Active Jobs
- Total Applications
- Total Candidates
- Interviews Scheduled
- Hired Candidates
- Rejected Candidates

---

# Hiring Funnel

Display

Pipeline

```text
Applications

↓

Under Review

↓

Interview Scheduled

↓

Interview Completed

↓

Hired
```

Each stage displays

- Count
- Percentage

Visualization

Funnel Chart

---

# Candidate Status Distribution

Display

Current candidate distribution.

Statuses

- Submitted
- Under Review
- Interview Scheduled
- Interview Completed
- Hired
- Rejected

Visualization

Pie Chart

---

# Job Performance

Display

Top performing jobs.

Columns

- Job Title
- Applications
- Interviews
- Hires
- Hire Rate

Default

Top 10 jobs

---

# Application Trends

Display

Applications over time.

Selectable Range

- Last 7 Days
- Last 30 Days
- Last 90 Days
- Last Year
- Custom Range

Visualization

Line Chart

---

# Time to Hire

Display

Average time between

```
Application Submitted

↓

Candidate Hired
```

Display

- Average Days
- Median Days (Future)

---

# Filters

Supported

Date Range

Department (Future)

Job

Status

---

# Empty State

Display

Title

```
No analytics available.
```

Description

```
Analytics will appear once recruitment activity begins.
```

---

# Loading State

Display

Skeleton Cards

Skeleton Charts

---

# Error State

Display generic dashboard error.

---

# API Specification

## Dashboard Analytics

GET

```
/analytics/dashboard
```

---

## Job Performance

GET

```
/analytics/jobs
```

---

## Hiring Funnel

GET

```
/analytics/funnel
```

---

## Application Trends

GET

```
/analytics/trends
```

---

# Business Rules

- Analytics are organization-scoped.
- Deleted jobs are excluded.
- Deleted candidates are excluded.
- Historical metrics remain available.
- Statistics are calculated from real recruitment data.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

---

# Database Impact

Read Only

Tables

- Jobs
- Candidates
- Applications
- Interviews

No writes.

---

# Accessibility

- Keyboard Navigation
- Accessible Charts
- Proper Labels
- Screen Reader Support

---

# Internationalization

Supported Languages

- Persian
- English

Numbers and dates should respect localization settings.

---

# Analytics Events

- Analytics Viewed
- Date Range Changed
- Chart Filter Changed

---

# Storybook Components Used

- Statistic Card
- Line Chart
- Bar Chart
- Pie Chart
- Area Chart
- Date Range Picker
- Skeleton

---

# New Components Required

## Overview Statistics Grid

Displays KPI cards.

---

## Hiring Funnel Chart

Displays candidate progression through recruitment stages.

---

## Job Performance Table

Displays hiring performance for each published job.

---

## Application Trend Chart

Displays applications over time.

---

# Backend Tasks

- Analytics Aggregation
- Funnel Calculation
- Job Performance Calculation
- Time-to-Hire Calculation
- Trend Aggregation

---

# Frontend Tasks

- Analytics Dashboard
- Charts
- KPI Cards
- Filters
- Responsive Layout

---

# Acceptance Criteria

- Recruiters can view organization recruitment analytics.
- Statistics update correctly.
- Charts reflect current recruitment data.
- Date range filtering works.
- Dashboard is responsive.
- Empty states are handled gracefully.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- Charts Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- AI Hiring Insights
- Predictive Hiring Analytics
- Offer Acceptance Rate
- Recruitment Cost Analytics
- Recruiter Performance Metrics
- Department Analytics
- Export to PDF / Excel
- Scheduled Reports
- Custom Dashboards