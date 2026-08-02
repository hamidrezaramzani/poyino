# Interview AI Specification

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

- AI Infrastructure
- Candidate Profile
- Interview Process
- Job Management
- Resume Analysis

## Existing Components

- Card
- Button
- Tabs
- Accordion
- Badge
- Alert
- Loading Button
- Textarea
- Markdown Viewer

---

# Overview

Interview AI assists recruiters before, during and after interviews.

Using the job description, candidate profile, resume analysis and recruiter instructions, the AI generates interview guidance to help recruiters conduct more effective interviews.

AI never makes hiring decisions. It provides recommendations only.

---

# Business Goal

Reduce recruiter preparation time while increasing interview quality and consistency.

---

# Scope

Included in MVP

- AI Interview Preparation
- Executive Interview Summary
- Technical Interview Questions
- Behavioral Interview Questions
- Follow-up Questions
- Candidate Strengths
- Candidate Weaknesses
- Missing Skills
- Evaluation Checklist

---

# Out of Scope

- AI Voice Interview
- Live Interview Assistant
- Automatic Transcript Analysis
- AI Hiring Decision
- AI Candidate Rejection

---

# User Story

As a recruiter,

I want AI to prepare me before an interview,

So that I can ask better questions and evaluate candidates more effectively.

---

# AI Inputs

The AI receives

## Job Information

- Job Title
- Department
- Employment Type
- Workplace Type
- Job Description
- Responsibilities
- Requirements
- Required Skills
- Preferred Skills

---

## Candidate Information

- Resume
- Structured Resume Data
- AI Resume Summary
- Skills
- Experience
- Education
- AI Match Score
- Missing Skills

---

## Recruiter Context

Optional prompt.

Example

```
Focus on React architecture.

Evaluate leadership skills.

This is the second technical interview.
```

---

# AI Outputs

The AI generates the following sections.

---

# Executive Summary

A concise explanation of the candidate's background and suitability for the role.

Maximum

300 words

---

# Interview Objectives

Explain what the interviewer should validate during this interview.

Example

- Technical depth
- Communication
- Leadership
- Architecture
- Team collaboration

---

# Technical Questions

Generate

5–10 technical questions.

Questions should be directly related to

- Job Description
- Candidate Experience

---

# Behavioral Questions

Generate

5–10 behavioral questions.

Examples

- Conflict resolution
- Teamwork
- Leadership
- Time management
- Decision making

---

# Follow-up Questions

Generate additional questions based on possible candidate answers.

Purpose

Allow recruiters to continue the conversation naturally.

---

# Candidate Strengths

Summarize the strongest aspects of the candidate.

Examples

- Strong React experience
- Excellent leadership
- Cloud architecture background

---

# Candidate Weaknesses

Identify possible concerns.

Examples

- Limited backend experience
- No enterprise-scale projects
- Missing Docker knowledge

These are recommendations only.

---

# Missing Skills

Display skills required by the job but not found in the candidate profile.

Example

```
Kubernetes

Redis

GraphQL
```

---

# Evaluation Checklist

Generate a structured checklist.

Example

Technical Knowledge

Communication

Problem Solving

Architecture

Leadership

Culture Fit

Each item includes a short explanation.

---

# Recruiter Notes

Recruiters may write notes while interviewing.

These notes are

- Organization Private
- Never sent to AI automatically

Future AI features may summarize them after explicit user approval.

---

# Regenerate AI

Recruiters can regenerate the interview guide.

Useful when

- Job Description changes
- Recruiter Prompt changes

Previous generations remain available in history (Future).

---

# Prompt Customization

Recruiters may provide optional instructions.

Examples

```
Focus on system design.

Ask more practical coding questions.

Ignore frontend topics.

Keep questions beginner-friendly.
```

---

# AI Processing

Display progress.

States

- Preparing Interview
- Generating Questions
- Building Evaluation Checklist

---

# Failure State

If AI generation fails

Display

```
Unable to generate interview preparation.

Please try again.
```

The recruiter can retry.

---

# API Specification

## Generate Interview Preparation

POST

```
/jobs/:jobId/candidates/:candidateId/interview-ai
```

Body

```json
{
  "prompt": "Focus on leadership experience."
}
```

---

Success Response

Returns

- Executive Summary
- Interview Objectives
- Technical Questions
- Behavioral Questions
- Follow-up Questions
- Strengths
- Weaknesses
- Missing Skills
- Evaluation Checklist

---

# Business Rules

- AI recommendations are advisory only.
- Recruiters make all hiring decisions.
- Recruiter prompts are optional.
- AI never modifies candidate data.
- AI output can be regenerated.

---

# Security

Authentication Required

Authorization Required

Organization Isolation

Resume and job data must never be shared outside the configured AI provider.

---

# Database Impact

MVP

No persistence required.

Generate responses on demand.

Future

Persist AI generations for history and comparison.

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Accessible Expand/Collapse Sections

---

# Internationalization

Supported Languages

- Persian
- English

The AI should generate content in the organization's selected language.

---

# Analytics Events

- Interview AI Generated
- Interview AI Regenerated
- Recruiter Prompt Used

---

# Storybook Components Used

- Card
- Accordion
- Tabs
- Badge
- Loading Button
- Textarea
- Markdown Viewer

---

# New Components Required

## Interview Preparation Card

Displays

- Executive Summary
- Objectives

---

## Question Sections

Displays

- Technical Questions
- Behavioral Questions
- Follow-up Questions

---

## Evaluation Checklist Card

Displays

Evaluation criteria with expandable explanations.

---

## AI Prompt Panel

Allows recruiters to provide optional context before generating interview guidance.

---

# Backend Tasks

- AI Prompt Builder
- Interview Preparation Endpoint
- Structured Response Validation
- Retry Handling

---

# Frontend Tasks

- Interview AI Page
- AI Prompt Panel
- Loading States
- Question Sections
- Checklist
- Error Handling

---

# Acceptance Criteria

- Recruiters can generate interview preparation.
- AI uses both the job description and candidate profile.
- Technical and behavioral questions are generated.
- Strengths, weaknesses and missing skills are displayed.
- Recruiters can regenerate the output with optional instructions.
- The feature is fully responsive.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- AI Integration Completed
- Structured Output Validation Implemented
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- AI Interview Scorecard
- AI Interview Note Summarization
- AI Transcript Analysis
- AI Candidate Comparison
- AI Final Hiring Recommendation
- Voice Interview Assistant
- Multi-language Interview Generation
- Interview Preparation Templates