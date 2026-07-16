# Authentication

## Method
Authentication uses JSON Web Tokens signed with `JWT_SECRET`. Tokens expire after 30 days.

## Login Flow
```mermaid
sequenceDiagram
  participant U as User
  participant C as React Client
  participant A as Auth API
  participant DB as MongoDB

  U->>C: Submit email/password
  C->>A: POST /api/auth/login
  A->>DB: Find user with password
  DB-->>A: User
  A->>A: Compare bcrypt password
  A-->>C: JWT + user profile
  C->>C: Store token in localStorage
```

## Authorization
| Layer | Implementation |
| --- | --- |
| Client | `ProtectedRoute` checks authenticated user and allowed roles |
| API | `protect` middleware verifies JWT |
| Admin API | `admin` middleware checks `req.user.role === 'admin'` |

## Password Handling
- Passwords are hashed with bcrypt before saving.
- Security answers are also hashed with bcrypt.
- Password and security answer fields use `select: false` in the User model.

## Token Usage
The client attaches:

```http
Authorization: Bearer <token>
```

## Password Recovery
Forgot-password flow asks for email, retrieves the stored security question, verifies the security answer, and writes a new hashed password.

## Current Security Notes
- Code includes development fallbacks for `JWT_SECRET`.
- Production deployments should always provide a strong `JWT_SECRET`.
- CORS is currently configured with `origin: '*'`.
