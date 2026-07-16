# Hostel Complaint Management System

A full-stack hostel complaint portal where students can submit and track complaints while administrators manage complaint status, assignments, users, and dashboard analytics.

## Features
- Student registration, login, profile update, password change, and forgot-password flow.
- JWT-protected student and admin routes.
- Complaint creation with category, priority, description, and optional image uploads.
- Heuristic complaint summary generation.
- Student complaint search and filters.
- Admin dashboard with status, category, priority, and recent complaint metrics.
- Admin complaint status updates and staff assignment.
- Student notifications for complaint creation and status updates.
- Local preview fallback using browser localStorage when the backend is unavailable.

## Tech Stack
| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Uploads | Multer |
| Validation | express-validator |

## Project Structure
```text
Hostel Complaint Management System/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── package.json
│   └── server.js
├── docs/
├── .env.example
└── README.md
```

## Screenshots
Add screenshots here:

| Landing Page | Student Dashboard | Admin Dashboard |
| --- | --- | --- |
| `<Add Screenshot>` | `<Add Screenshot>` | `<Add Screenshot>` |

## Live Demo
- Frontend: `<Add Frontend URL>`
- Backend API: `<Add Backend URL>`

## Installation

### 1. Clone Repository
```bash
git clone https://github.com/sherayvatsya/Hostel-Complaint-System.git
cd Hostel-Complaint-System
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Configure Environment
Create `server/.env` using `.env.example`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
```

### 5. Run Backend
```bash
cd server
npm run dev
```

### 6. Run Frontend
```bash
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5000`.

## Environment Variables
| Variable | Description | Default/Fallback |
| --- | --- | --- |
| `PORT` | Express API port | `5000` |
| `NODE_ENV` | Runtime mode | `development` |
| `MONGO_URI` | MongoDB connection string | Set in `server/.env` |
| `JWT_SECRET` | JWT signing secret | Set in `server/.env` |

## API Overview
Base API path: `/api`

| Module | Endpoints |
| --- | --- |
| Auth | `/auth/register`, `/auth/login`, `/auth/forgot-password/question`, `/auth/forgot-password`, `/auth/profile`, `/auth/password` |
| Complaints | `/complaints`, `/complaints/:id` |
| Admin | `/admin/dashboard`, `/admin/complaints`, `/admin/complaints/:id/status`, `/admin/users` |
| Notifications | `/notifications`, `/notifications/read`, `/notifications/:id/read` |

Detailed API docs are available in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Folder Structure
- `client/src/pages`: application pages.
- `client/src/routes`: route definitions and protection.
- `client/src/context`: auth and theme context.
- `client/src/services/api.js`: Axios client and offline mock fallback.
- `server/routes`: Express route files.
- `server/controllers`: request handlers.
- `server/models`: Mongoose schemas.
- `server/middleware`: auth, validation, upload middleware.
- `docs`: project documentation.

## Security Features
- Passwords and security answers are hashed with bcrypt.
- JWT authentication protects private endpoints.
- Admin-only middleware protects administrative routes.
- Students can access only their own complaints and notifications.
- Complaint image uploads are limited by file type and size.
- Request validation is applied to auth and complaint creation endpoints.

## Future Enhancements
- Real-time updates with WebSockets or Server-Sent Events.
- Email/SMS notifications.
- Staff-specific accounts and task queues.
- Server-side pagination for large datasets.
- Automated API and frontend tests.
- Cloud storage for uploaded images.

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes with a clear message.
4. Open a pull request.

## License
This project currently does not include a license file. Add a license before distributing or accepting external contributions.

## Author
**Sheray Vatsya**
Email: sherayvatsya@gmail.com
LinkedIn: https://www.linkedin.com/in/sheray-vatsya-36770b380
