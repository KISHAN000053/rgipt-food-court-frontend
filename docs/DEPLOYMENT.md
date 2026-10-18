# Frontend deployment and campus setup

## Local development

Requirements: Node.js and npm, plus the backend running on port 5000.

```bash
npm install
cp .env.example .env
npm run dev
```

The Vite dev server normally runs at `http://localhost:5173`. Leave `VITE_API_URL` empty locally so the Vite proxy sends `/api` and Socket.IO traffic to `localhost:5000`.

## Vercel deployment

1. Import this repository into Vercel and use the Vite framework preset.
2. Set `VITE_API_URL` to the backend's deployed origin without a trailing slash.
3. Set `VITE_CAMPUS_NAME`, `VITE_INSTITUTION_NAME`, and `VITE_SUPPORT_EMAIL` to the public values for the campus deployment.
4. Deploy and confirm client-side routes load directly. The repository includes a Vercel routing configuration.
5. Add the deployed frontend origin to the backend's `FRONTEND_URL` or `FRONTEND_URLS`.
6. Update the Google OAuth redirect URI to the backend callback URL.

## Configuration safety

Every `VITE_*` variable is public and is compiled into the browser bundle. Never put database credentials, OAuth client secrets, JWT secrets, or payment secrets in the frontend environment.

## Before reusing for another campus

- Change all three public branding variables.
- Update backend `ALLOWED_EMAIL_DOMAINS`, `ADMIN_EMAILS`, and `CAMPUS_NAME`.
- Review the About, Terms, Privacy, Code of Conduct, and Support pages. Their legal and operational claims must match the actual operator, jurisdiction, payment model, and campus policy.
- Check remaining campus-specific assumptions, hostel delivery availability, pickup rules, payment fees, and shop-owner onboarding.
- Confirm that the backend is configured for this exact frontend origin and that Google sign-in, Socket.IO, payments, and refunds work end to end.
