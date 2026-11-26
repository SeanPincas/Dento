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

The Compose file automatically loads the local backend environment file:

```bash
docker compose up --build
```

On Windows PowerShell, use the helper script to start the stack and print the local URLs:

```powershell
.\start-dento.ps1
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
