# Deployment Guide

Recommended, low-effort split for a college-project deployment:

| Layer | Suggested host | Notes |
|---|---|---|
| Frontend | Vercel or Netlify | Deploy `client/`, build command `npm run build`, output dir `dist` |
| Backend | Render or Railway | Deploy `server/`, start command `npm start`, set env vars from `.env.example` |
| Database | MongoDB Atlas | Free tier (M0) is sufficient for a demo |

## Steps

1. Create a MongoDB Atlas cluster, add a database user, allow network access from your backend host, and copy the connection string into `MONGO_URI`.
2. Deploy the backend first (Render/Railway), setting `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL` (your eventual frontend URL) as environment variables there.
3. Deploy the frontend (Vercel/Netlify), pointing its API base URL (via a Vite env var or the dev proxy config) at the deployed backend's URL.
4. Update `CLIENT_URL` on the backend to match the deployed frontend's exact origin (CORS).
5. Add the same `MONGO_URI` / `JWT_SECRET` values as Jenkins credentials (see `jenkins.md`) so CI/CD can run health checks against the same configuration shape.

No Docker or docker-compose is used at any point in this stack.
