# Security

## Implemented Controls
| Control | Implementation |
| --- | --- |
| Password hashing | bcryptjs pre-save hook |
| Security answer hashing | bcryptjs pre-save hook |
| JWT auth | `jsonwebtoken` with 30-day expiry |
| Protected routes | `protect` middleware |
| Admin authorization | `admin` middleware |
| Input validation | `express-validator` |
| Upload restrictions | Multer file type and 5 MB file size limit |
| Ownership checks | Students can access only their own complaints/notifications |

## Important Notes
- `JWT_SECRET` has a development fallback in code. Production must set a strong secret.
- CORS currently allows all origins through `origin: '*'`.
- Uploaded files are stored locally in `server/uploads`.
- Forgot-password relies on security questions and answers, not email verification.

## Recommended Hardening
- Restrict CORS to trusted frontend domains.
- Remove hard-coded secret fallback for production.
- Add rate limiting for auth and password reset endpoints.
- Add centralized request logging.
- Store uploads in object storage with signed URLs.
- Add server-side file scanning if accepting user uploads in production.
