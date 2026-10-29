# Docker

This project has three Docker services:

- `backend` - Express API on port `4000`
- `frontend` - customer app on port `5173`
- `admin` - admin app on port `5174`

## Environment

The compose file expects these variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/Dento
JWT_SECRET=change-me
STRIPE_SECRET_KEY=sk_test_change_me
```

You can either create a root `.env` from `.env.example`, or reuse the existing backend env file:

```bash
docker compose --env-file backend/.env up --build
```

## URLs

After startup:

- Customer app: http://localhost:5173
- Admin app: http://localhost:5174
- Backend API: http://localhost:4000

The frontend and admin containers proxy `/api/*` and `/images/*` to the backend container.

## Notes

- MongoDB Atlas must be running before the backend can start successfully.
- Stripe redirects use `FRONTEND_URL`, which defaults to `http://localhost:5173` in Docker Compose.
- Uploaded food images are stored in the `backend_uploads` Docker volume.
