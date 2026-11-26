# Deploying Dento

Customer site and admin on **Vercel**, API on **Render**, database on
**MongoDB Atlas**, payments on **Stripe**. Nothing secret lives in the repo:
every key below is typed into the host's dashboard.

| Part | Folder | Host | Config in repo |
| --- | --- | --- | --- |
| API (Express) | `backend/` | Render web service | `render.yaml` |
| Customer site (Vite + React) | `frontend/` | Vercel project | `frontend/vercel.json` |
| Admin (Vite + React) | `admin/dento/` | Vercel project | `admin/dento/vercel.json` |

Deploy in this order, because each step needs the URL from the one before.

## 1. API on Render

1. Render dashboard > **New > Blueprint** > connect GitHub > pick `SeanPincas/Dento`
   and the branch to deploy.
2. Render reads `render.yaml` and asks for the secrets:
   - `MONGODB_URI`: your Atlas connection string (same as in `backend/.env`).
   - `JWT_SECRET`: a long random string (new value = everyone signs in again).
   - `STRIPE_SECRET_KEY`: keep the **test** key (`sk_test_…`) until you are ready
     to take real payments.
   - `FRONTEND_URL`: fill in after step 2 (the customer site's Vercel URL), then
     redeploy. For now any placeholder, e.g. `https://example.com`.
3. Wait for the deploy, then open `https://<your-service>.onrender.com/` and check
   it says **API Working**. Note this URL.

Free plan notes: the service sleeps after ~15 minutes idle, so the first request
after a pause takes up to a minute. Its disk is temporary: the dish photos that
are committed in `backend/uploads/` are always there, but **photos uploaded
through the admin after deploying are lost on the next deploy or restart**. For
lasting uploads, add a Render persistent disk (paid) or move images to a service
like Cloudinary.

## 2. Customer site on Vercel

1. Vercel > **Add New > Project** > import `SeanPincas/Dento`.
2. **Root Directory**: `frontend`. Framework preset: Vite (detected).
3. **Environment variable**: `VITE_API_URL` = the Render URL from step 1, no
   trailing slash (e.g. `https://dento-backend.onrender.com`).
4. Deploy. Note the URL (e.g. `https://dento.vercel.app`).
5. Back in Render, set `FRONTEND_URL` to this URL and redeploy the API, so Stripe
   returns customers to the right site after paying.

## 3. Admin on Vercel

Same as step 2, as a second Vercel project: **Root Directory** `admin/dento`,
`VITE_API_URL` = the Render URL.

## 4. MongoDB Atlas network access

Render's free services don't have a fixed outgoing IP, so Atlas has to accept
connections from anywhere (`0.0.0.0/0`) for the API to reach it. Keep the
database user's password strong, and narrow this rule if you move to a host with
a static IP.

## Checks after deploying

- Customer site loads, the belt shows plates, dish photos appear (served by the API).
- Sign up, add dishes, Checkout on the slip > delivery page > Stripe test card
  `4242 4242 4242 4242` > back on **My orders**.
- Admin: add and list dishes (remember the upload note above).
- Refreshing a deep link such as `/orders` works (that is what `vercel.json` does).

## Before taking real payments

- Switch `STRIPE_SECRET_KEY` to the live key in Render.
- The API currently allows requests from any site (`cors()` in `backend/server.js`);
  restrict it to the two Vercel URLs.
- Remove placeholder contact details you don't want public (footer).
