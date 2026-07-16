# Technical Requirements Document

## Stack
| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcryptjs |
| Uploads | Multer local file storage |
| Validation | express-validator |

## Runtime Requirements
- Node.js compatible with Vite 5 and Express 4.
- MongoDB instance reachable through `MONGO_URI`.
- Writable `server/uploads` directory for complaint images.

## Frontend Requirements
- Vite dev server on port `5173`.
- Proxy `/api` and `/uploads` to backend `http://localhost:5000`.
- Auth token stored in `localStorage` as `token`.
- Offline preview fallback exists in `client/src/services/api.js` using localStorage mock data.

## Backend Requirements
- Express server listens on `PORT` or `5000`.
- MongoDB connection uses `MONGO_URI` or local fallback.
- JWT secret uses `JWT_SECRET` or development fallback.
- CORS currently allows all origins.

## Constraints
- Images are limited to 5 MB each.
- Complaint uploads allow JPEG, JPG, PNG, and WEBP.
- Students can update/delete complaints only while status is `Pending`.
- Admin routes require authenticated admin role.

## Build Commands
| Area | Command |
| --- | --- |
| Client dev | `cd client && npm run dev` |
| Client build | `cd client && npm run build` |
| Server dev | `cd server && npm run dev` |
| Server start | `cd server && npm start` |
| Seed database | `cd server && npm run seed` |
