# Apply Flow Specification

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

- Public Job Page
- AI Infrastructure
- Resume Upload
- Candidate Tracking
- Candidate Management

## Existing Components

- Card
- Button
- Loading Button
- Text Input
- Textarea
- File Upload
- Progress Bar
- Alert
- Toast
- Skeleton

---

# Overview

The Apply Flow allows a candidate to apply for a published job.

Instead of manually filling every field, the candidate uploads a PDF resume.

The system extracts the resume text, sends it to the AI service, automatically fills the application form, allows the candidate to review and edit the generated data, and finally submits the application.

The candidate always has the final control over the submitted information.

---

# Business Goal

Reduce the amount of manual work required to submit a job application while maintaining structured and accurate candidate information.

---

# Scope

Included in MVP

- Resume Upload
- Upload Progress
- Resume Text Extraction
- AI Resume Analysis
- Automatic Form Filling
- Manual Review
- Form Validation
- Submit Application

---

# Out of Scope

- Multiple Resume Uploads
- Cover Letter Upload
- Portfolio Upload
- Drag & Drop Multiple Files
- AI Chat

---

# User Story

As a candidate,

I want to upload my resume,

So that the application form is completed automatically and I only need to review it before submitting.

---

# User Flow

```text
Open Public Job

↓

Click Apply

↓

Upload Resume (PDF)

↓

Upload Progress

↓

Extract Resume Text

↓

Analyze Using AI

↓

Auto Fill Form

↓

Candidate Reviews Information

↓

Candidate Edits Information (Optional)

↓

Submit Application

↓

Redirect To Success Page
```

---

# Step 1 — Upload Resume

Accepted File Types

- PDF

Maximum File Size

10 MB

Maximum Files

1

Required

Yes

---

# Validation

File Required

```text
Please upload your resume.
```

Unsupported File

```text
Only PDF files are supported.
```

Large File

```text
File size exceeds the maximum allowed limit.
```

---

# Step 2 — Upload Progress

Display

- Upload Progress Bar
- Upload Percentage

During upload

- Disable submit button
- Prevent navigation

---

# Step 3 — Resume Text Extraction

After upload completes

The backend extracts plain text from the uploaded PDF.

If extraction fails

Display

```text
Unable to read your resume. Please upload another PDF.
```

The application flow stops.

---

# Step 4 — AI Resume Analysis

The extracted text is sent to the AI service.

The AI returns structured JSON.

Expected Information

- Full Name
- Email
- Phone Number
- Current Position
- Skills
- Work Experience
- Education
- LinkedIn (optional)
- Website (optional)
- Portfolio (optional)

The response must pass Zod validation.

If validation fails

Display

```text
Unable to analyze your resume.
Please complete the application manually.
```

The candidate can continue by filling the form manually.

---

# Step 5 — Auto Filled Application Form

The following fields are automatically populated.

Personal Information

- Full Name
- Email
- Phone Number

Professional Information

- Current Position
- Skills
- Experience
- Education

Optional

- LinkedIn
- Portfolio
- Website

Every field remains editable.

The candidate has full control before submission.

---

# Step 6 — Manual Review

The candidate reviews all information.

The candidate may

- Edit fields
- Remove skills
- Add missing experience
- Correct AI mistakes

Nothing is locked.

---

# Step 7 — Submit Application

Validation

Required

- Full Name
- Email
- Phone Number
- Resume File

After successful validation

Create

- Candidate
- Application

Store

- Resume PDF
- Extracted Text
- AI Analysis
- Structured Candidate Information

Generate

Private Tracking Token

Redirect

Application Success Page

---

# Form Fields

## Personal Information

- Full Name
- Email
- Phone Number

## Professional Information

- Current Position
- Skills
- Work Experience
- Education

## Links

- LinkedIn
- Portfolio
- Website

---

# Loading States

Uploading

Display Progress Bar.

Extracting Resume

Display

```text
Reading your resume...
```

Analyzing

Display

```text
Analyzing your resume with AI...
```

Submitting

Display Loading Button.

---

# Success State

Redirect

Application Success Page

---

# Failure States

Upload Error

```text
Unable to upload your resume.
```

Extraction Error

```text
Unable to read your resume.
```

AI Error

```text
Unable to analyze your resume.
Please complete the form manually.
```

Validation Error

Display below the corresponding field.

Unexpected Error

Toast

```text
Something went wrong.
```

---

# API Specification

## Upload Resume

POST

```
/public/jobs/:slug/upload
```

Returns

Uploaded File ID

---

## Analyze Resume

POST

```
/public/jobs/:slug/analyze
```

Returns

Structured Candidate JSON

---

## Submit Application

POST

```
/public/jobs/:slug/apply
```

Returns

Application ID

Tracking Token

---

# Business Rules

- Resume upload is required.
- Only PDF files are accepted.
- AI analysis never replaces user input.
- Candidates may edit every generated field.
- One application per email address per job.
- Every successful application receives a private tracking token.

---

# Security

- Public Endpoints
- Rate Limiting
- Virus Scan (Future)
- Secure File Storage
- Signed File URLs

---

# Database Impact

Create

- Candidate
- Application

Store

- Resume File
- Extracted Resume Text
- AI Analysis Result
- Structured Candidate Data

---

# Accessibility

- Keyboard Navigation
- Screen Reader Support
- Focus Indicators
- Accessible Upload Component

---

# Internationalization

Supported Languages

- Persian
- English

---

# Analytics Events

- Resume Uploaded
- Resume Extraction Started
- Resume Analysis Completed
- Application Submitted

---

# Storybook Components Used

- File Upload
- Progress Bar
- Text Input
- Textarea
- Button
- Loading Button
- Alert

---

# New Components Required

## Resume Upload Card

Displays

- Upload Area
- Progress
- File Preview
- Remove File

---

## AI Processing Indicator

Displays

- Current Step
- Progress Animation
- Status Message

---

# Backend Tasks

- Resume Upload Endpoint
- PDF Text Extraction
- AI Resume Analysis
- Application Submission
- Tracking Token Generation

---

# Frontend Tasks

- Multi-step Apply Flow
- Upload Component
- Progress UI
- AI Autofill
- Review Form
- Submit Integration

---

# Acceptance Criteria

- Candidate can upload a PDF resume.
- Resume text is extracted successfully.
- AI automatically fills the application form.
- Candidate can edit every generated field.
- Application is successfully submitted.
- A private tracking token is generated.
- Errors are handled gracefully.
- The flow is fully responsive.

---

# Definition of Done

- Backend Implemented
- Frontend Implemented
- AI Integration Completed
- Responsive Verified
- Accessibility Verified
- Storybook Updated
- Dark Mode Verified
- i18n Verified

---

# Future Improvements

- DOCX Support
- Cover Letter Upload
- Portfolio Upload
- Resume Version History
- AI Skill Suggestions
- Duplicate Candidate Detection
- AI Resume Quality Score