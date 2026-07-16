# Database Schema

Database: MongoDB
ODM: Mongoose

```mermaid
erDiagram
  USER ||--o{ COMPLAINT : submits
  USER ||--o{ NOTIFICATION : receives

  USER {
    ObjectId _id
    String name
    String email
    String password
    String securityQuestion
    String securityAnswer
    String roomNumber
    String hostelBlock
    String role
    String phone
    String avatar
    Date createdAt
    Date updatedAt
  }

  COMPLAINT {
    ObjectId _id
    String title
    String description
    String category
    String priority
    String status
    String[] images
    ObjectId student
    String assignedStaff
    String aiSummary
    Date createdAt
    Date updatedAt
  }

  NOTIFICATION {
    ObjectId _id
    ObjectId user
    String message
    Boolean read
    Date createdAt
    Date updatedAt
  }
```

## User
| Field | Type | Notes |
| --- | --- | --- |
| `name` | String | Required |
| `email` | String | Required, unique, lowercase, email format |
| `password` | String | Required, hashed, min 6, excluded by default |
| `securityQuestion` | String | Required |
| `securityAnswer` | String | Required, hashed, excluded by default |
| `roomNumber` | String | Required for students |
| `hostelBlock` | String | Required for students |
| `role` | String | `student` or `admin`, default `student` |
| `phone` | String | Required |
| `avatar` | String | Optional |

## Complaint
| Field | Type | Notes |
| --- | --- | --- |
| `title` | String | Required |
| `description` | String | Required |
| `category` | String | Electrical, Water, Internet, Cleaning, Furniture, Mess, Room, Security, Others |
| `priority` | String | Low, Medium, High |
| `status` | String | Pending, Accepted, In Progress, Resolved, Rejected |
| `images` | String[] | Uploaded file URLs |
| `student` | ObjectId | References User |
| `assignedStaff` | String | Optional |
| `aiSummary` | String | Generated heuristic summary |

## Notification
| Field | Type | Notes |
| --- | --- | --- |
| `user` | ObjectId | References User |
| `message` | String | Required |
| `read` | Boolean | Default `false` |
