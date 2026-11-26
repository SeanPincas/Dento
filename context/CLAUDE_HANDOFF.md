# Claude Handoff Context — Dento

This file is the current briefing for Claude or another AI assistant continuing work on the Dento project. Read this file together with the root `README.md` before making changes.

## Project identity

Dento is a Japanese food delivery platform with three applications:

- `frontend/`: customer-facing React application.
- `backend/`: Express/Node API connected to MongoDB Atlas and Stripe.
- `admin/dento/`: React admin application for food management and future order management.

GitHub repository: `https://github.com/SeanPincas/Dento`

The repository's current `main` branch contains the Docker setup, secret-safe environment templates, startup helper, and URL-printing container changes. Do not expose or recreate any real value from `backend/.env` in documentation, logs, commits, or chat.

## Current verified state

- MongoDB Atlas cluster is active.
- The new MongoDB database-user password was saved locally in `backend/.env` and tested successfully.
- Direct Mongoose connection succeeded against database `Dento`.
- Docker Compose successfully built all three images.
- Docker containers successfully started with the rotated MongoDB credentials.
- Backend logs showed `Server Started on http://localhost:4000` and `DB Connected`.
- Docker port mappings are `5173` customer, `5174` admin, and `4000` backend.
- Frontend and admin Docker logs print their local URLs at startup.
- The latest pushed commit at the time of this handoff adds those URL messages.

## How to start the project

Run from `C:\Users\ACER\Desktop\WebProjects\Dento` with Docker Desktop running:

```powershell
docker compose up --build
```

This works without `--env-file` because `docker-compose.yml` explicitly loads `./backend/.env` through the backend service's `env_file` setting.

Alternatively:

```powershell
.\start-dento.ps1
```

The helper starts the stack detached, prints the three URLs, and runs `docker compose ps`.

Open:

- Customer: `http://localhost:5173`
- Admin: `http://localhost:5174`
- API: `http://localhost:4000`

Stop the stack:

```powershell
docker compose down
```

## Environment rules

The local file `backend/.env` is required and ignored by Git. It contains:

- `MONGODB_URI`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- optionally `PORT` and `FRONTEND_URL`

Use `backend/.env.example` as the template. Never ask the user to paste secrets into chat. If a secret is suspected to have been exposed, rotate it in the provider dashboard and update the local file.

MongoDB Atlas currently needs an allowed client IP. The broad `0.0.0.0/0` rule was used for Docker testing and should be removed or narrowed to the actual deployment/network IP before production.

## Architecture and request flow

```text
Browser
  ├── localhost:5173 → frontend Nginx → backend:4000
  └── localhost:5174 → admin Nginx    → backend:4000

Backend Express API
  ├── /api/user   → registration and login
  ├── /api/food   → food list/add/remove
  ├── /api/cart   → authenticated cart operations
  ├── /api/order  → place, verify, and customer orders
  ├── /images     → uploaded food images
  └── MongoDB Atlas / Stripe Checkout
```

Customer order flow:

1. User logs in and receives a JWT.
2. Cart requests send the JWT through the auth middleware.
3. The place-order request saves the order and clears the cart.
4. The backend creates a Stripe Checkout session and returns its URL.
5. Stripe redirects to `/verify` with `success` and `orderId` query values.
6. The frontend calls `/api/order/verify`.

## Important known issues

These are known product/security gaps, not reasons to undo the Docker work:

1. Payment verification trusts the browser redirect query. Add a Stripe webhook and verify the Checkout Session or Payment Intent server-side before marking an order paid.
2. The admin Orders page currently only renders placeholder text. Add authenticated admin order-list and status-update routes/UI.
3. Food add/remove endpoints are not protected by an admin role check.
4. `connectDB()` is started without awaiting it before `app.listen`; production startup should fail clearly or use a healthcheck if the database is unavailable.
5. Docker Compose `depends_on` currently orders startup but does not wait for a backend healthcheck.
6. The dependency audit reported vulnerabilities during image builds. Review upgrades deliberately; do not blindly run `npm audit fix` without testing.
7. There are no automated tests or CI/CD workflows yet.

## Recommended continuation order

1. Test the customer app and admin app locally through the two browser URLs.
2. Implement Stripe webhook verification and test payment success/cancellation.
3. Add admin authentication/authorization.
4. Implement the admin order list and status updates.
5. Add backend/frontend healthchecks and automated tests.
6. Choose a production host, configure HTTPS and deployment secrets, and replace local URLs.
7. Restrict MongoDB Atlas network access and configure Stripe production webhooks/keys only at deployment time.

## Working rules for the next assistant

- Preserve existing user changes and inspect `git status` before editing.
- Use `apply_patch` for file edits.
- Do not print secrets from `.env` files.
- Do not commit `backend/.env`, dependency folders, build output, or uploaded runtime data.
- Verify builds after changes: `npm run build` in both frontend projects and `docker compose up --build` when Docker-related files change.
- Keep the user informed one step at a time when changing Atlas, credentials, Docker, or deployment settings.
