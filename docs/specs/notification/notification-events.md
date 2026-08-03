# Notification Events Specification

Version: 1.0

Status: Approved

Owner: Product Team

Last Updated: 2026-08-03

---

# Dependencies

## Foundation

- architecture.md
- technology-decisions.md

## Related Features

- Notification Center
- Email Notifications
- Notification Preferences
- Authentication
- Jobs
- Candidate Application
- Candidate Management
- Interview
- Organization

---

# Overview

Notification Events define every business event that may generate one or more notifications.

The notification system must **never create notifications directly from controllers or UI actions**.

Instead, business actions emit events, and the notification system decides whether an in-app notification, email, or future delivery channel should be triggered.

---

# Business Goal

Create a centralized, event-driven notification architecture that can easily support future delivery channels.

---

# Scope

Included in MVP

- Event Definitions
- Event Payload Structure
- Notification Routing
- In-App Notifications
- Email Trigger Mapping

---

# Out of Scope

- Webhooks
- Mobile Push
- SMS
- Slack
- Microsoft Teams

---

# Event Lifecycle

```
Business Action

↓

Domain Event

↓

Notification Service

↓

Preference Check

↓

Create Notification

↓

Send Email (optional)

↓

Notification Center
```

---

# Event Payload

Every event should contain

Required

- Event Name
- Organization ID
- Triggered By
- Target User(s)
- Resource Type
- Resource ID
- Timestamp

Optional

- Metadata

Example

```json
{
  "event": "candidate.applied",
  "organizationId": "...",
  "resourceId": "...",
  "triggeredBy": "...",
  "targetUsers": ["..."],
  "metadata": {}
}
```

---

# Authentication Events

## auth.email_verified

Recipients

- User

---

## organization.member_invited

Recipients

- Invited User

---

## organization.member_joined

Recipients

- Owner
- Administrators

---

# Job Events

## job.created

Recipients

- Recruiters
- Administrators

---

## job.published

Recipients

- Recruiters

---

## job.unpublished

Recipients

- Recruiters

---

## job.archived

Recipients

- Recruiters

---

## job.expired

Recipients

- Recruiters

---

# Candidate Events

## candidate.applied

Recipients

- Recruiters
- Hiring Managers

---

## candidate.status_changed

Recipients

- Candidate

---

## candidate.bookmarked

Recipients

None

Internal only.

---

## candidate.hired

Recipients

- Candidate
- Recruiters

---

## candidate.rejected

Recipients

- Candidate
- Recruiters

---

# Interview Events

## interview.created

Recipients

- Candidate
- Interviewers

---

## interview.updated

Recipients

- Candidate
- Interviewers

---

## interview.cancelled

Recipients

- Candidate
- Interviewers

---

## interview.completed

Recipients

- Recruiters
- Hiring Managers

---

## interview.note_added

Recipients

- Recruiters
- Hiring Managers

Candidate does not receive internal notes.

---

# Organization Events

## department.created

Recipients

- Administrators

---

## member.role_changed

Recipients

- Target Member

---

## member.department_changed

Recipients

- Target Member

---

## invitation.accepted

Recipients

- Owner
- Administrators

---

# AI Events

## ai.resume_analysis_completed

Recipients

- Recruiters

---

## ai.job_generated

Recipients

- Triggering User

---

## ai.interview_questions_generated

Recipients

- Triggering User

---

## ai.interview_summary_generated

Recipients

- Recruiters

---

# Billing Events (Future)

## billing.subscription_expiring

Recipients

- Owner

---

## billing.subscription_expired

Recipients

- Owner

---

## billing.payment_failed

Recipients

- Owner

---

## billing.ai_credit_low

Recipients

- Owner

Triggered when remaining AI credits fall below a configurable threshold.

---

# System Events

## system.maintenance

Recipients

- Organization Members

---

## system.security_alert

Recipients

- Organization Owner

---

# Delivery Channels

Supported in MVP

| Channel | Supported |
|----------|-----------|
| In-App | ✅ |
| Email | ✅ |
| Push | ❌ |
| SMS | ❌ |
| Webhook | ❌ |

---

# Notification Routing

Every event specifies

- Recipient(s)
- Delivery Channel(s)
- Notification Category
- Priority

---

# Priorities

Possible values

- Low
- Normal
- High
- Critical

Examples

High

- Interview Cancelled
- Payment Failed

Normal

- New Candidate

Low

- Job Published

---

# Idempotency

Events should not generate duplicate notifications.

Each event must include a unique event identifier.

---

# Failed Delivery

If notification creation fails

- Retry automatically
- Log failure
- Never interrupt the original business action

Example

Candidate application succeeds even if email delivery fails.

---

# Business Rules

- Business logic emits events.
- Notification Service consumes events.
- Notification Preferences determine delivery.
- Duplicate notifications must be prevented.
- Notification failures must never block business operations.

---

# Security

Authentication Required

Organization Isolation

Events must only notify authorized recipients.

---

# Database Impact

Notification records are created from events.

No business entity should create notifications directly.

---

# Analytics Events

Track

- Event Published
- Notification Created
- Notification Delivered
- Email Sent
- Delivery Failed

---

# Backend Tasks

- Event Bus
- Notification Dispatcher
- Event Routing
- Duplicate Prevention
- Retry Strategy

---

# Frontend Tasks

None

Frontend only consumes generated notifications.

---

# Acceptance Criteria

- Every business action emits a domain event.
- Notifications are generated from events only.
- Duplicate notifications are prevented.
- Failed notification delivery does not affect business operations.
- Email and In-App notifications share the same event source.

---

# Definition of Done

- Event Catalog Implemented
- Notification Dispatcher Implemented
- Routing Rules Implemented
- Retry Strategy Implemented
- Integration Tests Passed

---

# Future Improvements

- Event Queue
- RabbitMQ / Kafka Integration
- Webhooks
- Push Notifications
- SMS Delivery
- Slack Integration
- Microsoft Teams Integration
- Custom Organization Events