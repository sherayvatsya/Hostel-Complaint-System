# Features

## Public
- Premium landing page.
- Login and registration.
- Forgot-password flow using security question and answer.
- 404 fallback route.

## Student
- Protected dashboard.
- Create complaint with title, description, category, priority, and images.
- View own complaints.
- Filter/search complaints by keyword, category, status, and priority.
- View complaint details.
- Edit pending complaints.
- Delete pending complaints.
- View and update profile.
- Change password.
- View notifications and mark them read.

## Admin
- Protected admin dashboard.
- Dashboard metrics:
  - Total students
  - Total complaints
  - Status counts
  - Category breakdown
  - Priority breakdown
  - Recent complaints
- View and filter all complaints.
- Update complaint status.
- Assign staff by text field.
- Delete complaints.
- Create users from admin panel.
- List and delete student users.

## Backend
- JWT authentication.
- Role-based authorization.
- Image uploads through Multer.
- Heuristic complaint summarization.
- Notification creation on complaint creation and admin status updates.

## Preview Support
`client/src/services/api.js` contains localStorage seed data and mock request handlers for preview/offline fallback behavior.
