# Dento

Dento is a full-stack Japanese food delivery web application. Customers can browse Japanese-inspired food items, create an account, manage a cart, place delivery orders, and pay through Stripe Checkout. An accompanying admin application lets staff add and remove food items and provides the starting point for order administration.

## Project capabilities

### Customer application

- Browse food items loaded from MongoDB.
- Filter or explore food categories.
- Register and log in with JWT-based authentication.
- Add and remove items from a user cart.
- Enter a delivery address and place an order.
- Redirect to Stripe Checkout using Philippine peso pricing.
- View the customer's order history.
- View payment verification results.

### Backend API

- Express API on port `4000`.
- MongoDB Atlas persistence through Mongoose.
- User registration and login with bcrypt password hashing and JWT tokens.
- Food CRUD operations used by the customer and admin apps.
- Authenticated cart and customer-order endpoints.
- Stripe Checkout session creation.
- Uploaded food-image serving from `/images`.

### Admin application

- React/Vite admin interface on port `5174`.
- Add food items with image upload, description, price, and category.
- View the food list and remove food items.
- Includes an Orders page placeholder for future admin order-management work.

## Technology stack

| Area | Technology |
| --- | --- |
| Customer UI | React 18, React Router 6, Axios, Vite 5 |
| Admin UI | React 19, React Router 7, Axios, React Toastify, Vite 6 |
| API | Node.js, Express 5, CORS, Body Parser |
| Database | MongoDB Atlas, Mongoose 8 |
| Authentication | bcrypt, JSON Web Tokens |
| Payments | Stripe Checkout |
| Uploads | Multer and a persistent Docker volume |
| Containers | Docker, Docker Compose, Nginx |
| Source control | GitHub |

## Repository layout

```text
Dento/
├── backend/       Express API, models, routes, controllers, uploads
├── frontend/      Customer React application
├── admin/dento/   Admin React application
├── context/       Project and AI handoff documentation
├── docker-compose.yml           Production-style stack (Nginx builds)
├── docker-compose.override.yml  Live-reload dev setup, loaded automatically
├── start-dento.ps1              Starts the production-style stack
├── start-dento-dev.ps1          Starts the live-reload stack
├── DOCKER.md
└── README.md
```

## Application flow

1. The customer frontend is served by Nginx on `http://localhost:5173`.
2. The admin frontend is served by Nginx on `http://localhost:5174`.
3. Both Nginx containers proxy `/api/*` and `/images/*` requests to the backend service over the Docker network.
4. The backend loads environment variables from `backend/.env`, starts on port `4000`, and connects to MongoDB Atlas.
5. Customer registration/login returns a JWT used by authenticated cart and order requests.
6. Placing an order saves an order record, clears the user's cart, creates a Stripe Checkout session, and redirects the customer to Stripe.
7. The verification page currently calls `/api/order/verify` after the Stripe redirect to mark the order as paid or remove it when cancelled.

## Run locally with Docker

Prerequisites:

- Docker Desktop running.
- A local `backend/.env` file containing valid MongoDB, JWT, and Stripe values. Use `backend/.env.example` as the template.
- MongoDB Atlas running with the machine's IP address allowed.

From the project root, run:

```powershell
docker compose up --build
```

This loads `docker-compose.override.yml` automatically, so the customer and admin apps run with live reload: saved changes in `frontend/` or `admin/dento/` appear in the browser without a rebuild. `.\start-dento-dev.ps1` does the same in the background and prints the URLs.

To test the production-style Nginx build instead (no live reload):

```powershell
docker compose -f docker-compose.yml up --build
```

or `.\start-dento.ps1`.

Local addresses:

- Customer app: `http://localhost:5173`
- Admin dashboard: `http://localhost:5174`
- Backend health response: `http://localhost:4000`

Stop the running stack with `Ctrl+C` when using the attached command, or run:

```powershell
docker compose down
```

The `backend_uploads` named volume preserves uploaded food images across container recreation.

## Environment and security

- Never commit `backend/.env` or any real secret.
- Keep MongoDB, JWT, and Stripe values in the local environment or a deployment secret manager.
- The repository includes `.env.example` files with placeholders only.
- MongoDB credentials were rotated during setup. The local `backend/.env` must contain the current password.
- The Atlas `0.0.0.0/0` access-list entry was used for local Docker testing and should be removed or restricted before production deployment.
- Stripe test credentials should be used for development; production deployment requires production Stripe keys and webhook configuration.

## Current limitations and next development work

- Payment confirmation is redirect-based and should be replaced or supplemented with a verified Stripe webhook before production use.
- The admin Orders page is currently a placeholder; backend admin order-list and status-update endpoints still need to be implemented.
- Admin food endpoints currently do not have a separate admin authorization layer.
- Docker Compose uses local development ports and a local `FRONTEND_URL`; production deployment needs hosted URLs, HTTPS, restricted network access, and managed secrets.
- Automated tests and CI/CD have not yet been added.

## GitHub

Repository: https://github.com/SeanPincas/Dento

