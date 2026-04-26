# River Run Condo — Handoff

## Admin access

- **Admin URL**: `/admin`
- **Login URL**: `/admin/login`
- **Allowed email**: `rrcboardemail@gmail.com`
- **Password**: set via environment variable **`ADMIN_PASSWORD`**

### What the admin can do

- **Update board members**
- **Update recent announcements**
- **Export backup** (downloads `river-run-backup.json`)

## Setup checklist (Vercel)

- **Project access**
  - Ensure the Association (or board account) is an **Owner/Admin** of the Vercel project.
  - Confirm correct GitHub repo is connected.

- **Domain**
  - Domain is in the Association’s registrar account.
  - DNS points to Vercel and SSL is issued.

- **Environment variables**
  - **`ADMIN_PASSWORD`** set (strong password; store it in the board’s password manager).
  - Redis/KV env vars present from Vercel storage integration (Upstash Redis / KV).

- **Storage**
  - Verify admin edits persist across deployments (edit an announcement, save, refresh).

- **Deploy**
  - Confirm latest commit is deployed and “Build” succeeds.

## Operational runbook

### Reset admin password

1. In Vercel project settings → Environment Variables.
2. Update `ADMIN_PASSWORD`.
3. Redeploy (or trigger a new deployment).

### Add / update board members

1. Visit `/admin`.
2. Add/edit rows under **Board members**.
3. Click **Save changes**.

### Add / update announcements

1. Visit `/admin`.
2. Add/edit under **Recent announcements**.
3. Click **Save changes**.

### Export backup

1. Visit `/admin`.
2. Click **Export backup**.
3. Save the JSON file in the Association’s shared drive.

## Monitoring (Sentry) — approved, but not enabled by default

If you want live error monitoring, add Sentry DSN environment variables in Vercel:

- `SENTRY_DSN`
- (optional) `SENTRY_AUTH_TOKEN` for source maps

Then enable alerts in Sentry for error spikes.

