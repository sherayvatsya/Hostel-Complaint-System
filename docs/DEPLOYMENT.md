# Deployment

## Prerequisites
- Node.js
- MongoDB database
- Hosting for client static build
- Hosting for Express API

## Environment Variables
Create `server/.env` from `.env.example`.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | API port, defaults to `5000` |
| `NODE_ENV` | No | Runtime environment |
| `MONGO_URI` | Yes in production | MongoDB connection URI |
| `JWT_SECRET` | Yes in production | Secret for signing JWTs |

## Local Deployment
```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

## Production Build
```bash
cd client
npm run build
```

Deploy `client/dist` to a static hosting provider. Deploy `server` as a Node.js service with MongoDB access.

## API Routing
In local development, Vite proxies:
- `/api` to `http://localhost:5000`
- `/uploads` to `http://localhost:5000`

For production, configure equivalent reverse proxy rules or update the client API base URL strategy.

## Uploads
Uploaded images are stored in `server/uploads`. Production deployments should use persistent storage or object storage if the hosting filesystem is ephemeral.
