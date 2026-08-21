# Portfolio Client

React + Vite frontend: the public portfolio site and the admin dashboard that manages
its content. All content comes from the API in `../server` - nothing is hardcoded.

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build into dist/
npm run lint
```

## Environment

Copy `.env.example` to `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

In production this is the deployed API URL, including the `/api` suffix.

## Routes

| Route | Description |
|---|---|
| `/` | Public portfolio |
| `/login` | Redirects to `/admin/login` |
| `/admin/login` | Owner login |
| `/admin/dashboard` | Protected dashboard (Projects, Skills, Messages, Profile) |

## Structure

```
src/
├── components/         public site sections
│   └── admin/          dashboard panels, shared admin UI, route guard
├── pages/
│   ├── Index.jsx       public page
│   └── admin/          Login and Dashboard
├── context/            AuthContext - token, session, logout on 401
├── hooks/useApi.js     one-shot data loading with a fallback value
└── lib/api.js          typed API client and token storage
```

## How content loads

Each public section calls the API through `useApiData` and ships a hardcoded fallback,
so the page still renders sensible content if the backend is unreachable. Projects with
no image render a titled placeholder tile rather than a broken image.

## Auth

The JWT lives in `localStorage` under `portfolio_admin_token`. `ProtectedRoute` verifies
it against `GET /api/auth/me` before rendering anything under `/admin`, showing only a
spinner while it checks - the dashboard never flashes before a redirect. Any `401` from
the API clears the token and returns to the login page.
