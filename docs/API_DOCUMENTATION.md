# API Documentation

Base URL: `/api`

Protected endpoints require:

```http
Authorization: Bearer <jwt>
```

## Auth
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register student |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/forgot-password/question?email=` | Public | Get security question |
| POST | `/auth/forgot-password` | Public | Reset password with security answer |
| GET | `/auth/profile` | Private | Get current profile |
| PUT | `/auth/profile` | Private | Update profile |
| PUT | `/auth/password` | Private | Change password |

### Register Body
| Field | Required | Notes |
| --- | --- | --- |
| `name` | Yes | String |
| `email` | Yes | Valid email |
| `password` | Yes | Min 6 chars |
| `securityQuestion` | Yes | String |
| `securityAnswer` | Yes | String |
| `phone` | Yes | String |
| `roomNumber` | Student | Required for students |
| `hostelBlock` | Student | Required for students |
| `avatar` | No | URL/string |

## Complaints
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/complaints` | Private | Create complaint with optional `images` files |
| GET | `/complaints` | Private | List current user's complaints |
| GET | `/complaints/:id` | Private | Get complaint details |
| PUT | `/complaints/:id` | Private | Update pending complaint |
| DELETE | `/complaints/:id` | Private | Delete pending complaint |

Query filters for `GET /complaints`: `search`, `category`, `status`, `priority`.

## Admin
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/admin/dashboard` | Admin | Dashboard stats |
| GET | `/admin/complaints` | Admin | List/filter all complaints |
| PUT | `/admin/complaints/:id/status` | Admin | Update status and assigned staff |
| DELETE | `/admin/complaints/:id` | Admin | Delete complaint |
| GET | `/admin/users` | Admin | List students |
| POST | `/admin/users` | Admin | Create user |
| DELETE | `/admin/users/:id` | Admin | Delete student and related records |

## Notifications
| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/notifications` | Private | List current user's notifications |
| PUT | `/notifications/read` | Private | Mark all read |
| PUT | `/notifications/:id/read` | Private | Mark one read |

## Common Response Shape
```json
{
  "success": true,
  "message": "Optional message",
  "data": "Endpoint-specific payload"
}
```
