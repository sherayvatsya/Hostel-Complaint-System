# User Flow

```mermaid
flowchart TD
  Start[Landing Page] --> Login{Has Account?}
  Login -->|No| Register[Register Student]
  Login -->|Forgot Password| Forgot[Security Question Reset]
  Login -->|Yes| Auth[Login]
  Register --> StudentDash[Student Dashboard]
  Forgot --> Auth
  Auth --> Role{Role}
  Role -->|Student| StudentDash
  Role -->|Admin| AdminDash[Admin Dashboard]

  StudentDash --> Create[Create Complaint]
  Create --> Upload[Optional Image Upload]
  Upload --> Summary[Heuristic Summary Generated]
  Summary --> Track[Track Status]
  Track --> Details[Complaint Details]
  Details -->|Pending| EditDelete[Edit or Delete]
  Details --> Notifications[Notifications]

  AdminDash --> AllComplaints[View All Complaints]
  AllComplaints --> Filter[Search and Filter]
  Filter --> Status[Update Status]
  Status --> Assign[Assign Staff]
  Assign --> Notify[Student Notification Created]
  AdminDash --> Users[Manage Student Users]
```

## Student Journey
1. Register or login.
2. Submit a complaint with required details.
3. Optionally upload images.
4. Track status from dashboard/details page.
5. Receive notification when status changes.

## Admin Journey
1. Login as admin.
2. Review dashboard metrics and recent complaints.
3. Filter complaint list.
4. Update complaint status and assigned staff.
5. Manage student accounts when required.
