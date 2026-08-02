# Interview Summary Specification

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

- Interview Process
- Interview AI
- Candidate Profile
- Recruiter Notes

---

# Overview

Interview Summary generates an AI-powered summary of the entire interview journey for a candidate.

Instead of reading every interview note individually, recruiters and hiring managers receive a concise overview of the recruitment process.

The summary is regenerated whenever requested and is based on all completed interview stages.

---

# Business Goal

Reduce the time required to review candidates while improving hiring consistency.

---

# Scope

Included in MVP

- AI Summary
- Interview Timeline Summary
- Strengths
- Weaknesses
- Recruiter Consensus
- Outstanding Concerns
- Suggested Next Step

---

# Out of Scope

- Automatic Hiring Decision
- Candidate Ranking
- Salary Recommendation

---

# User Story

As a hiring manager,

I want to quickly understand the complete interview history,

So that I can make informed hiring decisions without reading every interview note.

---

# AI Inputs

The AI receives

## Candidate Information

- Resume
- Candidate Profile
- AI Resume Analysis

## Job Information

- Job Description
- Requirements
- Responsibilities

## Interview History

Every completed interview.

For each interview

- Interview Type
- Internal Notes
- Evaluation
- Status

---

# AI Outputs

## Executive Summary

Overall interview summary.

Maximum

500 words.

## Interview Timeline Summary

Summarize each completed interview.

Example

HR Interview

↓

Technical Interview

↓

Final Interview

## Consensus

Summarize the overall opinion of interviewers.

Examples

- Strong agreement
- Mixed opinions
- Conflicting evaluations

## Strengths

List recurring strengths mentioned across interviews.

## Weaknesses

List recurring concerns.

## Risks

Potential hiring risks.

Examples

- Communication
- Technical Depth
- Leadership
- Culture Fit

## Outstanding Questions

Questions that remain unanswered after all interviews.

## Suggested Next Step

Examples

- Hire
- Schedule another interview
- Collect more references
- Reject

This is an AI recommendation only.

---

# Regeneration

Recruiters may regenerate the summary after new interviews are completed.

---

# Loading State

Display

```
Generating interview summary...
```

---

# Failure State

Display

```
Unable to generate interview summary.

Please try again.
```

---

# API Specification

## Generate Summary

POST

```
/jobs/:jobId/candidates/:candidateId/interview-summary
```

---

# Business Rules

- Only completed interviews are included.
- Internal recruiter notes are used.
- Candidate-visible notes are ignored.
- AI recommendations are advisory only.
- The summary never changes candidate data.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

---

# Database Impact

MVP

Persist generated summaries on the interview process (per candidate application).

Fields

- `aiSummary`
- `aiSummaryGeneratedAt`

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Interview Summary Generated
- Interview Summary Regenerated

---

# Storybook Components Used

- Card
- Accordion
- Badge
- Markdown Viewer

---

# New Components Required

## Interview Summary Card

Displays

- Executive Summary
- Timeline
- Consensus
- Strengths
- Weaknesses
- Risks
- Suggested Next Step

---

# Backend Tasks

- AI Prompt Builder
- Interview Summary Endpoint
- Structured Output Validation

---

# Frontend Tasks

- Summary Panel
- Loading State
- Error State
- Regenerate Button

---

# Acceptance Criteria

- AI summarizes all completed interviews.
- Summary reflects recruiter notes.
- Strengths and weaknesses are identified.
- Consensus is generated.
- Suggested next step is displayed.
- Recruiters can regenerate the summary.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- AI Integrated
- Responsive Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- Hiring Committee Summary
- Multi-Candidate Comparison
- AI Confidence Score
- Hiring Risk Score
- Executive One-Page Report
