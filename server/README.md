# Portfolio API

Express + MongoDB backend for the portfolio site and its admin dashboard.

```
src/
├── config/       env loading, database connection, Cloudinary
├── models/       Mongoose schemas (Admin, Skill, Project, Message, Profile)
├── controllers/  route logic
├── routes/       Express routers
├── middleware/   auth guard, validation, uploads, error handling
├── validation/   zod schemas
├── utils/        email sending, JWT helpers, error types
├── scripts/      seeding and password hashing
└── server.js     entry point
```

## Commands

```bash
npm run dev            # start with file watching
npm start              # start once
npm run seed:admin     # create or update the single admin account
npm run seed:content   # fill empty collections with starter content
npm run seed:content -- --force   # wipe skills/projects/profile and reseed
npm run hash -- "new password"    # print a bcrypt hash for ADMIN_PASSWORD_HASH
```

## Endpoints

Base path: `/api`. Routes marked **admin** require `Authorization: Bearer <token>`.

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/health` | public | Liveness check |
| POST | `/auth/login` | public | Log in, returns a JWT |
| GET | `/auth/me` | admin | Current account |
| POST | `/auth/change-password` | admin | Change the admin password (verifies the current one) |
| GET | `/skills` | public | List skills |
| POST | `/skills` | admin | Create a skill |
| PUT | `/skills/:id` | admin | Update a skill |
| DELETE | `/skills/:id` | admin | Delete a skill |
| PATCH | `/skills/reorder` | admin | Reorder from an array of ids |
| GET | `/projects` | public | List projects |
| GET | `/projects/:id` | public | One project |
| POST | `/projects` | admin | Create a project |
| PUT | `/projects/:id` | admin | Update a project |
| DELETE | `/projects/:id` | admin | Delete a project |
| PATCH | `/projects/reorder` | admin | Reorder from an array of ids |
| POST | `/contact` | public | Submit the contact form |
| GET | `/contact` | admin | List messages |
| PATCH | `/contact/:id/read` | admin | Mark read or unread |
| DELETE | `/contact/:id` | admin | Delete a message |
| GET | `/profile` | public | Site profile content |
| PUT | `/profile` | admin | Update profile content |
| POST | `/upload` | admin | Upload an image to Cloudinary (field `image`) |
| DELETE | `/upload?publicId=` | admin | Delete a Cloudinary image |

Every response is `{ success, ... }`; failures add `message` and sometimes a
`details` array of `{ field, message }` from validation.

## Environment variables

Copy `.env.example` to `.env`. `DB_URL` is the connection string name this project
uses; `MONGO_URI` is accepted as an alias.

### MongoDB Atlas

1. Create a free account at <https://www.mongodb.com/cloud/atlas/register>.
2. Create a project, then a free **M0** cluster.
3. Under **Database Access**, add a database user (separate from your Atlas login).
4. Under **Network Access**, allow `0.0.0.0/0` for development; tighten it later.
5. **Connect -> Drivers -> Node.js** and copy the connection string.
6. Replace `<username>` and `<password>`, and add the database name after `.net/`:
   `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`
7. Paste it as `DB_URL`.

If the SRV lookup that `mongodb+srv://` needs fails with `querySrv ECONNREFUSED`,
your local DNS resolver is refusing to answer it. The server notices this and
retries once through `8.8.8.8` and `1.1.1.1` on its own, logging that it did so.
Set `DNS_SERVERS=8.8.8.8,1.1.1.1` in `.env` to pin those resolvers up front and
skip the failed first attempt.

### Gmail app password

A normal Gmail password will not work.

1. Google Account -> **Security**, turn on **2-Step Verification**.
2. Go to <https://myaccount.google.com/apppasswords>.
3. Create one named e.g. "Portfolio Contact Form".
4. Put the 16-character result in `SMTP_PASS` (spaces are stripped automatically) and
   the Gmail address in `SMTP_USER`. `OWNER_RECEIVING_EMAIL` is where messages land,
   and defaults to `SMTP_USER`.

Contact submissions are stored in MongoDB first and emailed second, so a mail outage
never loses a message - the dashboard shows the delivery error on the message itself.

### Cloudinary

From the Cloudinary dashboard, copy **Cloud name**, **API Key** and **API Secret**
into `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.
Uploads are limited to 5MB and to image mime types, and are resized to fit
1600x1000 on the way in. If these are unset, `/api/upload` returns 503 and the
dashboard can still take image URLs.

### Admin account

`ADMIN_EMAIL` plus either `ADMIN_PASSWORD_HASH` (a bcrypt hash) or `ADMIN_PASSWORD`
(plaintext, hashed by the seed script). To change the password later, either:

- Sign in and use **Security -> Change password** in the dashboard (`POST /auth/change-password`),
  which verifies the current password and writes the new hash straight to the database, or
- Regenerate it from the environment:

  ```bash
  npm run hash -- "your new password"   # paste the output into ADMIN_PASSWORD_HASH
  npm run seed:admin                    # apply it
  ```

Note that re-running `npm run seed:admin` always resets the password to whatever
`ADMIN_PASSWORD`/`ADMIN_PASSWORD_HASH` currently holds, so update `.env` too if you
want a dashboard-changed password to survive a reseed.
