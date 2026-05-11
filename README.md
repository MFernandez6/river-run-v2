# River Run Condominium site

Next.js site for [riverrunmiami.com](https://riverrunmiami.com).

## Editing announcements & board (no database)

Content lives in **`data/site-content.json`** in this repository.

- **Local development:** With no GitHub variables set, the admin dashboard reads and writes that file on disk (`npm run dev`).
- **Production (Vercel):** Set the GitHub variables below. Saving from `/admin` uses the [GitHub Contents API](https://docs.github.com/en/rest/repos/contents) to commit an update to `data/site-content.json`. The live site reads the same file from GitHub on each request—no separate database and no Supabase.

### Required environment variables

| Variable | Purpose |
|----------|---------|
| `ADMIN_SITE_PASSWORD` | Shared password for `/admin/login` (store only in Vercel / `.env.local`). |
| `ADMIN_SESSION_SECRET` | Signs the HTTP-only admin session cookie (e.g. `openssl rand -hex 32`). |
| `GITHUB_CONTENT_TOKEN` | Fine-grained PAT with **Contents: Read and write** for this repo only. |
| `GITHUB_REPO_OWNER` | GitHub org or user that owns the repo. |
| `GITHUB_REPO_NAME` | Repository name (e.g. `river-run-condo`). |

Optional: `GITHUB_CONTENT_BRANCH` (default `main`), `SITE_CONTENT_PATH` (default `data/site-content.json`).

### Board handoff checklist

1. Transfer the **GitHub** repo and rotate or re-scope the **GitHub PAT** if the previous token could have been exposed.
2. Transfer the **Vercel** project (or reconnect the repo) and copy all env vars; set a new `ADMIN_SITE_PASSWORD` and `ADMIN_SESSION_SECRET`.
3. Confirm production has GitHub env vars so saves from the admin UI succeed (watch the repo for commits to `data/site-content.json`).
4. Share **`/admin/login`** and the admin password only with current officers; rotate the password when the board turns over.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For admin, open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) after setting `ADMIN_SITE_PASSWORD` and `ADMIN_SESSION_SECRET` in `.env.local`.

## Build

```bash
npm run build
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to load [Geist](https://vercel.com/font).
