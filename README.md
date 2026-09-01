# Ember Journal — Next.js + MySQL Blog (Hostinger Node.js)

Full blog website:

- Public journal with pagination, categories, search, and comments
- Admin dashboard to create/edit/delete posts and categories
- Cookie session auth (JWT via `jose`)
- MySQL schema ready for Hostinger phpMyAdmin

## Local setup

1. Create a MySQL database and import `schema.sql`.
2. Copy `.env.example` to `.env.local` and fill in values.
3. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

First visit to `/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD` creates the admin user automatically.

## Hostinger Git deployment (Node.js + MySQL)

1. In hPanel create a **MySQL database** and user. Import `schema.sql` with phpMyAdmin.
2. Create a **Node.js app** (Node 20 if available) and connect this GitHub repo.
3. Set environment variables in the Node.js app panel:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
AUTH_SECRET=long-random-secret
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=strong-password
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

4. Build and start commands:

- Install: `npm install`
- Build: `npm run build`
- Start: `npm start`

5. Point the domain / subdomain to the Node.js app.

## Writing posts

Content is stored as HTML.

Comments are hidden until approved (`comments.approved`).
