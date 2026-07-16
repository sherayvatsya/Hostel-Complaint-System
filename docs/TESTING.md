# Testing

## Current Automated Tests
No dedicated automated test suite is present in the repository.

## Verified Build Command
```bash
cd client
npm run build
```

## Recommended Manual Test Checklist
| Area | Test |
| --- | --- |
| Auth | Register student, login, logout |
| Forgot Password | Fetch security question and reset password |
| Student Complaints | Create complaint with and without images |
| Student Complaints | Search/filter complaint list |
| Student Complaints | Edit/delete pending complaint |
| Student Access | Confirm student cannot access admin routes |
| Admin | Login as admin and view dashboard stats |
| Admin | Update complaint status and assigned staff |
| Notifications | Confirm student sees status update notification |
| Profile | Update profile and change password |

## Suggested Future Tests
- API integration tests for auth, complaints, admin, and notifications.
- Model validation tests for User and Complaint schemas.
- Role-based authorization tests.
- Frontend route protection tests.
- Upload validation tests for file type and size.
