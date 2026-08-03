# Notification Service Specification

Version: 1.0

Status: Approved

Owner: Platform Team

Last Updated: 2026-08-03

---

# Dependencies

## Foundation

- architecture.md
- technology-decisions.md

## Related Features

- Notification Center
- Notification Events
- Notification Preferences
- Email Notifications
- Authentication
- Organization

---

# Overview

Notification Service is responsible for receiving domain events and delivering notifications through the appropriate channels.

This service is the single entry point for all notification delivery across the platform.

Business modules must never create notifications directly.

---

# Business Goal

Provide a centralized, scalable and extensible notification infrastructure that supports multiple delivery channels.

---

# Scope

Included in MVP

- Event Processing
- Notification Creation
- Preference Evaluation
- In-App Delivery
- Email Delivery
- Retry Strategy
- Delivery Logging

---

# Out of Scope

- Push Notifications
- SMS
- Slack
- Microsoft Teams
- Webhooks

---

# Architecture

```
Business Module

↓

Domain Event

↓

Notification Service

↓

Load User Preferences

↓

Determine Delivery Channels

↓

Create In-App Notification

↓

Queue Email

↓

Delivery Log
```

---

# Responsibilities

The service must

- Receive domain events
- Resolve recipients
- Check notification preferences
- Create in-app notifications
- Queue emails
- Log delivery status
- Retry failed deliveries

---

# Supported Channels

| Channel | MVP |
|----------|-----|
| In-App | ✅ |
| Email | ✅ |
| Push | ❌ |
| SMS | ❌ |

---

# Delivery Flow

## Step 1

Receive Event

Example

```
candidate.applied
```

---

## Step 2

Resolve Recipients

Example

- Recruiter
- Hiring Manager

---

## Step 3

Load Preferences

Determine

- In-App Enabled
- Email Enabled

---

## Step 4

Create Notification

Store notification for every recipient.

---

## Step 5

Queue Email

If Email is enabled.

---

## Step 6

Write Delivery Log

Status

- Success
- Failed

---

# Retry Strategy

If delivery fails

Retry

- 1 Minute
- 5 Minutes
- 30 Minutes

Maximum

```
3 Attempts
```

---

# Failure Handling

Notification failures

Never block business operations.

Example

Candidate application succeeds even if email sending fails.

---

# Delivery Status

Possible Values

- Pending
- Delivered
- Failed

---

# Logging

Every delivery attempt stores

- Notification ID
- Recipient
- Channel
- Attempt Number
- Status
- Timestamp

---

# Idempotency

Duplicate domain events must not generate duplicate notifications.

Every event must include a unique identifier.

---

# Performance

Notification delivery should be asynchronous.

Email sending should never occur during the main HTTP request lifecycle.

---

# Queue

Recommended

```
BullMQ
```

or any equivalent queue implementation.

Queue integration is optional in MVP but architecture should support it.

---

# Notification Expiration

In-App Notifications

Retention

```
90 Days
```

Old notifications are archived automatically.

---

# Monitoring

Track

- Delivery Success Rate
- Failed Deliveries
- Queue Size
- Average Delivery Time

---

# Security

Authentication is not required internally.

Service only accepts trusted domain events.

Notification recipients must always belong to the same organization.

---

# Database Impact

Notification

Delivery Log

Email Queue

---

# Business Rules

- Business modules never send notifications directly.
- Notification Service owns delivery.
- User preferences are always respected.
- Mandatory notifications bypass preferences.
- Delivery failures never interrupt business logic.

---

# Backend Tasks

- Notification Dispatcher
- Preference Resolver
- Email Queue
- Retry Worker
- Delivery Logger
- Idempotency Validation

---

# Frontend Tasks

None

Frontend only consumes notifications.

---

# Acceptance Criteria

- Domain events generate notifications.
- Preferences are respected.
- In-App notifications are created.
- Emails are queued correctly.
- Failed deliveries are retried.
- Business operations remain unaffected by delivery failures.

---

# Definition of Done

- Dispatcher Implemented
- Delivery Service Implemented
- Retry Strategy Implemented
- Logging Implemented
- Integration Tests Passed

---

# Future Improvements

- WebSocket Real-time Notifications
- Push Notifications
- SMS Delivery
- Slack Integration
- Microsoft Teams Integration
- Webhooks
- Notification Scheduling
- Notification Templates
- Multi-channel Delivery Policies