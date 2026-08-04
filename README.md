# RGIPT Food Court — Frontend

React + Vite + Tailwind CSS frontend for the RGIPT campus food ordering platform.

## Tech Stack
- React 18 + Vite 5
- Tailwind CSS 3
- React Router v6
- TanStack React Query v5
- Axios
- Socket.io-client
- Lucide React (icons)

## Setup

```bash
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm install
npm run dev      # Development on http://localhost:5173
npm run build    # Production build → dist/
```

## Environment Variables

```env
VITE_API_URL=https://your-render-backend.onrender.com
```

In development, leave `VITE_API_URL` empty — Vite proxies `/api` to `localhost:5000`.

## Deployment (Vercel)

1. Connect this repo to Vercel
2. Framework preset: **Vite**
3. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
4. Deploy — `vercel.json` handles SPA routing automatically

## Pages

| Route | Description |
|---|---|
| `/` | Landing page |
| `/home` | Shop listing (auth required) |
| `/shops/:id/menu` | Shop menu + cart |
| `/orders` | Order history |
| `/orders/:id` | Live order tracking |
| `/profile` | User profile |
| `/admin/*` | Admin panel (admin role) |
| `/shop-owner/*` | Shop dashboard (owner role) |
