# Product Requirements Document

## Product Summary
Hostel Complaint Management System is a web application for hostel students to submit maintenance complaints and for administrators to review, assign, update, and track those complaints.

## Goals
- Replace manual complaint tracking with a centralized digital workflow.
- Let students create, view, edit, delete, and track their own complaints.
- Let admins monitor complaint volume, filter complaints, update status, assign staff, and manage students.
- Notify students when complaints are created or updated.

## User Roles
| Role | Description | Main Capabilities |
| --- | --- | --- |
| Student | Hostel resident | Register, login, create complaints, upload images, track status, manage profile, view notifications |
| Admin | Hostel administrator | View analytics, manage complaints, assign staff, manage student accounts |

## Core Requirements
- Public landing page, login, registration, and forgot-password flow.
- JWT protected student and admin areas.
- Complaint creation with title, description, category, priority, and optional images.
- Heuristic complaint summary generation using `server/utils/aiSummarizer.js`.
- Student complaint filters by search, category, status, and priority.
- Admin dashboard metrics by status, category, priority, and recent complaints.
- Notification list and read-state updates.

## Non-Goals
- Real-time WebSocket updates are not implemented.
- External email/SMS delivery is not implemented.
- Payment, hostel room allocation, or inventory management are outside current scope.

## Success Criteria
- Students can submit and track complaints end to end.
- Admins can update complaint status and assigned staff.
- Authenticated routes reject unauthenticated users.
- Production build completes successfully.
