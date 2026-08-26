# Portfolio Website

A personal portfolio with a content-managed backend. The public site reads all of its
content from a REST API, and the owner edits that content from a password-protected
admin dashboard - no code changes needed.

```
my-portfolio/
├── client/    React + Vite frontend (public site + admin dashboard)
└── server/    Node.js + Express + MongoDB API
```

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind CSS, sonner |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | JWT (7 day expiry) + bcrypt |
| Email | Nodemailer over Gmail SMTP |
| Images | Cloudinary |

## Running it locally

From the repo root, two commands:

```bash
npm install     # installs the root tooling, then client/ and server/
npm run dev     # API on :5000 and site on :8080, in one terminal
```

`npm run dev` starts both halves side by side with prefixed output (`[api]`, `[web]`),
and stopping one stops the other, so `Ctrl+C` leaves nothing behind. A preflight check
runs first and explains anything that would make startup fail - a missing `.env`, a
missing `node_modules`, or a port still held by a previous session.

Before the first run, both folders need their own `.env`; copy the matching
`.env.example` and fill it in. `server/README.md` explains every server variable,
including how to get a MongoDB URI, a Gmail app password, and Cloudinary keys.

### Root scripts

| Command | What it does |
|---|---|
| `npm run dev` | Both dev servers together |
| `npm run dev:server` / `npm run dev:client` | One half on its own |
| `npm run stop` | Free ports 5000 and 8080 if a previous run was left behind |
| `npm run build` | Production build of the client into `client/dist` |
| `npm start` | Run the API alone (production mode) |
| `npm run seed` | Seed the admin account and starter content |
| `npm run lint` | Lint the client |

You can still work inside `client/` or `server/` directly; the root scripts only
forward to them.

## First-time database setup

From the repo root:

```bash
npm run seed:admin      # creates the admin account from ADMIN_EMAIL + ADMIN_PASSWORD_HASH
npm run seed:content    # fills skills, projects and profile with starter content
```

`npm run seed` runs both.

## Admin dashboard

| URL | What it is |
|---|---|
| `/` | The public portfolio |
| `/admin/login` | Owner login (`/login` redirects here) |
| `/admin/dashboard` | Projects, Skills, Messages and Profile management |

The dashboard manages:

- **Projects** - add, edit, delete, reorder, upload an image or paste an image URL
- **Skills** - add, edit, delete, reorder (names only, no percentages)
- **Messages** - everything submitted through the contact form, with read/unread and reply
- **Profile** - hero text, about paragraphs, contact blurb, social links
- **Security** - change the admin password (current password must be verified first)

Changes appear on the public site on its next load.

## Security

Both layers are enforced independently:

- **Backend** - `requireAuth` middleware rejects any request to a create/update/delete
  route without a valid JWT, so the API cannot be driven by bypassing the frontend.
  Public `GET` routes stay open for the site itself.
- **Frontend** - `ProtectedRoute` verifies the stored token before rendering anything
  under `/admin`, and any `401` from the API logs the session out immediately.

Also in place: bcrypt password hashing (cost 12), zod validation on every write,
CORS limited to `CLIENT_URL`, helmet headers, rate limits on login and password
changes (10 per 15 min each) and on the contact form (5 per hour), and a honeypot
field against bots.

## Deploying

1. **Backend** to Render or Railway - set every variable from `server/.env.example`,
   set `CLIENT_URL` to the deployed frontend origin, and `NODE_ENV=production`.
2. **Frontend** to Vercel or Netlify - set `VITE_API_URL` to the deployed API URL
   including the `/api` suffix. Build command `npm run build`, output `dist`.
3. In MongoDB Atlas, replace the `0.0.0.0/0` network rule with your host's IP range
   once you know it.
