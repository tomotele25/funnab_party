# Deploy Checklist

Run through this before every production deploy.

## Backend (Vercel)

Environment variables must be set in the Vercel project settings (not read from a committed `.env`):

- `DB_URL` — MongoDB Atlas connection string
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `PAYSTACK_SECRET_KEY` — **must be the live `sk_live_...` key, not the `sk_test_...` key used for development.** Check `backend/.env` locally before copying — the live key is saved there in a comment.
- `QR_SECRET`
- `EMAIL_USER`, `EMAIL_PASS` — Gmail address + app password used to send ticket emails

Also confirm:
- `backend/api/server.js`'s `allowedOrigins` CORS list includes the actual production frontend domain.

## Frontend (Vercel)

- `NEXT_PUBLIC_BACKEND_URL` — must point at the deployed backend URL, not `http://localhost:2005`.
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` — matching live/test mode of the backend secret key above.

## Admin access

There is no in-app signup flow for admin accounts (intentionally — public admin self-registration would be a security hole). To create one after deploy:

```
node backend/scripts/create-admin.js <email> <password> [fullname]
```

Run this against the same `DB_URL` the deployed backend uses (either run it locally with production env vars, or via a one-off deploy step).

## Before going live

- [ ] `PAYSTACK_SECRET_KEY` is the live key
- [ ] All backend env vars set in Vercel
- [ ] `NEXT_PUBLIC_BACKEND_URL` on the frontend points at the deployed backend
- [ ] At least one admin account exists
- [ ] `npm audit` shows no unresolved high/critical advisories in `backend/` and `frontend/`
