# Campus Food Court — Frontend

A reusable campus food-ordering frontend built with React and Vite. It currently includes RGIPT-specific branding and authentication assumptions; review the customization notes before deploying it for another campus.

**Backend:** https://github.com/KISHAN000053/rgipt-food-court-backend

## Features
- Student-facing shop discovery, menus, cart, orders, profile, and support pages
- Shop-owner dashboards and order management
- Admin screens for campus operations
- REST API integration and Socket.IO client support
- Responsive UI with React Router

## Stack
React 18 · Vite 5 · Tailwind CSS 3 · React Router 6 · TanStack Query 5 · Axios · Socket.IO Client · Lucide

## Local development

Requirements: Node.js and npm, plus a running backend.

```bash
npm install
cp .env.example .env
npm run dev
```

Vite normally serves the app at http://localhost:5173. Configure the backend URL in `.env`:

```env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to the deployed backend's base URL. Only put public configuration in `VITE_*` variables: Vite embeds these values in client-side assets.

Useful commands:

```bash
npm run dev
npm run build
npm run preview
```

## Main routes

| Route | Purpose |
|---|---|
| `/` | Landing and sign-in |
| `/home` | Shop listing |
| `/shops/:id/menu` | Shop menu |
| `/cart` | Cart |
| `/orders`, `/orders/:id` | Order history and tracking |
| `/profile` | User profile |
| `/admin/*` | Admin screens |
| `/shop-owner/*` | Shop-owner screens |

Some routes require authentication and a corresponding role on the backend. Frontend route hiding is not a security boundary.

## Deployment (Vercel)

1. Import this repository into Vercel.
2. Select the Vite framework preset.
3. Set `VITE_API_URL` to the deployed backend URL.
4. Deploy. The included Vercel configuration should handle client-side routing.

Also configure the backend's CORS and OAuth callback settings for the deployed frontend URL.

## Reuse for another campus

Before deploying a fork:
1. Replace RGIPT-specific names, copy, logos, and campus references.
2. Check the Google OAuth flow and configure the correct authorized redirect URI.
3. Configure the backend URL and ensure backend CORS allows this frontend origin.
4. Verify student email-domain rules, admin identities, hostel/room fields, and campus-specific seed data in the backend.
5. Test student, shop-owner, and admin flows with separate accounts, including payment and order-status updates.

Search the codebase for `RGIPT`, `rgipt.ac.in`, and campus-specific labels to find remaining assumptions.

## Security and production checklist

- Never commit `.env`, API keys, database credentials, OAuth client secrets, JWT secrets, or payment secrets.
- Rotate any credential that has been exposed; removing it from the latest commit does not remove it from Git history.
- Use strong unique production secrets and restrict database network access.
- Validate permissions and input on the backend; do not trust client-side role checks.
- Use HTTPS and test OAuth, CORS, payment verification/webhooks, and error handling before taking real orders.

## License

Check the repository's root license file before redistributing or selling a modified version. Third-party services and assets have their own terms. This README is documentation, not a guarantee of production readiness.
