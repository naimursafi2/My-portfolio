# Portfolio Website – Backend & Admin CMS Build Plan

## 1. Project Overview

This is a personal portfolio website. The frontend already exists. The goal now is to:

1. Reorganize the project into **two separate folders**: `client` (frontend) and `server` (backend).
2. Build a **backend + database (MongoDB)** so the site content is no longer hardcoded.
3. Add an **Admin Portal**: when the owner visits the site's `/login` (or similar) route and logs in, they land on an **Admin Dashboard** where they can edit the site content (skills, projects, contact info, etc.) without touching any code.
4. Make the **Contact form** actually work — messages submitted by visitors should be emailed to the site owner.
5. Make a few content/UX changes to the current frontend (details below).

This document is meant to be handed to an AI coding assistant (or a developer) as the full specification for the work.

---

## 2. Folder Structure

```
my-portfolio/
├── client/              # Existing frontend (React/Next.js), moved here
│   ├── src/
│   ├── public/
│   └── ...
└── server/              # New backend
    ├── src/
    │   ├── config/       # DB connection, env config
    │   ├── models/       # Mongoose schemas
    │   ├── controllers/  # Route logic
    │   ├── routes/       # Express routes
    │   ├── middleware/   # Auth middleware, error handling
    │   ├── utils/        # Helpers (email sender, token generator, etc.)
    │   └── server.js     # Entry point
    ├── .env
    └── package.json
```

The frontend (`client`) should call the backend (`server`) via a REST API instead of using hardcoded arrays/objects for skills, projects, etc.

---

## 3. Tech Stack

- **Frontend:** existing stack (React / Next.js — keep as is)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose (ODM)
- **Authentication:** JWT (JSON Web Token) + bcrypt for password hashing
- **Email sending:** Nodemailer (using Gmail SMTP or a service like Resend/SendGrid)
- **File/Image uploads (for project thumbnails):** Multer + Cloudinary (or local `uploads/` folder if keeping it simple)

---

## 4. Frontend Content Changes

These are changes to make on the existing frontend while connecting it to the new backend:

### 4.1 Skills Section
- **Remove the percentage bars/numbers** (e.g. "HTML 95%"). Just show the skill name (optionally with an icon), no proficiency percentage.
- Add the newly learned skills to the list: **MongoDB, Node.js, Express.js, Mongoose**.
- This list should be **fully editable from the Admin Dashboard** (add / edit / delete a skill).

### 4.2 Projects Section
- Add support for **more projects** — currently only one row is shown; there should be an additional row (i.e. more project cards, not just 3).
- Projects should be **manageable from the Admin Dashboard**: add new project, edit title/description/image/links, delete a project, reorder if possible.

### 4.3 Services & Pricing Section
- **Remove the pricing information entirely** (Basic $199 / Standard $499 / Advanced $999 cards). The user prefers not to display pricing publicly.
- If a "Services" section is still wanted, it can simply list *what services are offered* (without price tags) — otherwise this section can be removed completely. Confirm with the site owner which of these two is preferred before implementing.

### 4.4 Contact Section
- Rename the section heading from **"Get In Touch"** to something warmer/more user-friendly, e.g.:
  - **"Let's Connect"**
  - **"Say Hello"**
  - **"Start a Conversation"**
  
  (Pick one — "Let's Connect" is a solid, professional default.)
- The contact form (Name, Email, Message) should actually submit to the backend, and the backend should **send an email to the site owner's inbox** with the submitted details.
- Optionally store submitted messages in the database too, so they're visible inside the Admin Dashboard (in case the email fails or for record-keeping).

---

## 5. Admin Portal (CMS)

### 5.1 Login
- A dedicated login page (e.g. `/admin/login`) with **email + password**.
- Only one admin account is needed (the site owner) — no public sign-up.
- On successful login, issue a **JWT token** (store it in an httpOnly cookie or localStorage) and redirect to `/admin/dashboard`.
- Protect all admin routes/pages so they can't be accessed without a valid token.

### 5.2 Dashboard
The dashboard should let the owner manage:
| Section | Actions |
|---|---|
| Skills | Add / Edit / Delete skill (name + optional icon) |
| Projects | Add / Edit / Delete project (title, description, image, live link, GitHub link) |
| Contact Messages | View messages submitted through the contact form |
| Profile / About | Edit name, title, bio, social links (optional but recommended) |

The dashboard should give the owner **full control over site content** so they never need to edit code directly again.

---

## 6. Database Models (Mongoose Schemas)

### Admin
```js
{
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed with bcrypt
}
```

### Skill
```js
{
  name: String,        // e.g. "React"
  icon: String,         // optional icon name/URL
  order: Number,        // for display ordering
}
```

### Project
```js
{
  title: String,
  description: String,
  image: String,         // image URL
  liveLink: String,
  githubLink: String,
  order: Number,
  createdAt: Date,
}
```

### Message (Contact Form Submissions)
```js
{
  name: String,
  email: String,
  message: String,
  createdAt: Date,
}
```

---

## 7. API Endpoints

### Auth
- `POST /api/auth/login` – admin login, returns JWT

### Skills
- `GET /api/skills` – public, get all skills
- `POST /api/skills` – admin only, create skill
- `PUT /api/skills/:id` – admin only, update skill
- `DELETE /api/skills/:id` – admin only, delete skill

### Projects
- `GET /api/projects` – public, get all projects
- `POST /api/projects` – admin only, create project
- `PUT /api/projects/:id` – admin only, update project
- `DELETE /api/projects/:id` – admin only, delete project

### Contact
- `POST /api/contact` – public, submits the contact form → saves message + sends email to owner
- `GET /api/contact` – admin only, view all messages

All admin-only routes must be protected by a JWT auth middleware.

---

## 8. MongoDB Setup (Step-by-Step)

The owner needs to set up a free MongoDB database and provide the connection string via `.env`. Steps:

1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)** and create a free account (or log in if already registered).
2. Create a new **Project**, then create a free **Cluster** (the free "M0" tier is enough for a portfolio site).
3. Under **Database Access**, create a database user (username + password) — this is *not* the same as the Atlas login, it's a separate DB user.
4. Under **Network Access**, add an IP whitelist entry. For simplicity during development, allow access from anywhere: `0.0.0.0/0` (this can be tightened later for production).
5. Once the cluster is ready, click **Connect → Drivers**, choose **Node.js**, and copy the connection string. It will look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the database user credentials created in step 3, and add a database name after `.net/`, e.g.:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/portfolio-db?retryWrites=true&w=majority
   ```
7. Paste this full string as the value of `MONGO_URI` in `server/.env`.

The AI/developer building the backend should use `mongoose.connect(process.env.MONGO_URI)` in `server/src/config/db.js` and call it once when the server starts.

---

## 9. Email (Nodemailer) Setup — Getting a Gmail App Password

To let the backend send contact-form emails from a Gmail address, a regular Gmail password will **not** work — an **App Password** is required. Steps:

1. Go to your Google Account → **Security**.
2. Make sure **2-Step Verification** is turned ON (it's required before app passwords can be created).
3. In the Security page, search for **"App passwords"** (or go directly to `myaccount.google.com/apppasswords`).
4. Create a new app password — give it a name like "Portfolio Contact Form" — and Google will generate a 16-character password.
5. Copy that 16-character password (spaces don't matter) and use it as `EMAIL_PASS` in `server/.env`. Use the actual Gmail address as `EMAIL_USER`.
6. This app password is what Nodemailer will use to authenticate and send mail — never use the real Google account password here.

Example Nodemailer transporter setup (for the developer/AI to implement):
```js
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```
Every time someone submits the contact form, the backend sends an email using this transporter to `OWNER_RECEIVING_EMAIL`.

*(Alternative: if Gmail app passwords feel like a hassle, a transactional email service like **Resend** or **SendGrid** can be used instead — just swap the transporter config. Gmail is the simplest option to start with.)*

---

## 10. Admin Route Protection (Middleware) — Important

This is a required piece, not optional: **every admin-only page and every admin-only API route must be protected**, so that random visitors can never reach the dashboard, add/edit/delete content, or view contact messages — only the logged-in owner can.

### Backend side
- Create an `authMiddleware.js` in `server/src/middleware/`.
- It should:
  1. Read the JWT token from the request (from the `Authorization: Bearer <token>` header, or an httpOnly cookie).
  2. Verify the token using `JWT_SECRET`.
  3. If the token is missing or invalid → respond with `401 Unauthorized` and stop the request from reaching the controller.
  4. If valid → attach the admin's info to `req.admin` and call `next()`.
- Apply this middleware to **all** admin-only routes:
  - `POST/PUT/DELETE /api/skills`
  - `POST/PUT/DELETE /api/projects`
  - `GET /api/contact` (viewing messages)
  - Any future "About/Profile" edit routes
- Public `GET` routes (like `GET /api/skills` and `GET /api/projects` for the public-facing site) stay **open**, no auth needed — only the create/edit/delete actions require the admin token.

### Frontend side
- Create a **protected route wrapper** around all `/admin/*` pages (except `/admin/login`).
- On page load, check if a valid token exists (e.g. in localStorage or an httpOnly cookie sent automatically).
- If **no valid token** → immediately redirect to `/admin/login`. The dashboard content should never even flash on screen before the redirect.
- If a request to the backend ever returns `401` (e.g. token expired), automatically log the admin out and redirect to `/admin/login` again.

This two-layer protection (frontend redirect + backend middleware) is important: the frontend redirect is for user experience, but the **backend middleware is what actually secures the data** — without it, someone could call the API directly and bypass the frontend entirely.

---

## 11. Full Control Over Projects — Make Sure This Is Solid

Since managing **Projects** from the dashboard is one of the most important features, make sure the implementation fully supports, from the Admin Dashboard alone (no code editing ever required):

- **Add** a brand new project (title, description, image upload or image URL, live link, GitHub link).
- **Edit** any existing project's details.
- **Delete** a project.
- **Reorder** projects if possible (drag-and-drop or an `order` number field is enough).
- Newly added/edited/deleted projects should reflect on the **public Projects section immediately** (or after a refresh) — the frontend should always fetch the live list from `GET /api/projects`, never a hardcoded array.

This should be treated as a core requirement, not an optional nice-to-have — double-check this flow works end-to-end during testing (Section 10 of the build order).

---

## 12. Environment Variables (`server/.env`)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=your_login_email
ADMIN_PASSWORD_HASH=your_hashed_password
EMAIL_USER=your_email_for_sending
EMAIL_PASS=your_email_app_password
OWNER_RECEIVING_EMAIL=where_contact_messages_should_arrive
```

---

## 13. Security Notes

- Hash all passwords with **bcrypt** before saving — never store plain text passwords.
- Use **JWT** with a reasonable expiry (e.g. 7 days) and refresh/re-login when expired.
- Validate and sanitize all form inputs (both contact form and admin CMS forms) to prevent injection attacks.
- Enable **CORS** on the backend, restricted to the frontend's domain.
- Rate-limit the `/api/contact` endpoint to prevent spam submissions.

---

## 14. Suggested Build Order

1. Set up `server/` with Express, connect to MongoDB.
2. Build the Admin model + login endpoint + JWT middleware.
3. Build Skill and Project models + full CRUD API.
4. Build the Contact endpoint with Nodemailer email sending.
5. Connect the existing frontend to these APIs (replace hardcoded skills/projects arrays with API calls).
6. Remove the pricing cards from the Services section.
7. Rename "Get In Touch" to "Let's Connect" (or chosen alternative).
8. Build the Admin Login page + protected Admin Dashboard UI in the frontend.
9. Test end-to-end: adding/editing/deleting skills & projects from the dashboard reflects live on the public site; contact form emails arrive correctly.
10. Deploy backend (e.g. Render/Railway) and frontend (e.g. Vercel/Netlify), update environment variables for production.

---

## Summary of What the Owner Wants (Plain Language)

> "I'm building my portfolio. The frontend is mostly done. I want to add a backend so I can log into an admin panel and manage everything myself — no need to edit code. Split the project into `client` and `server` folders. Remove the skill percentages, add my new skills (MongoDB, Node.js, Express.js, Mongoose), add more projects, remove the pricing section, and make the contact form actually send me an email. Also rename 'Get In Touch' to something friendlier like 'Let's Connect'."

