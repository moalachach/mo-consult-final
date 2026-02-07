# Mo Consult – Company Creation Platform (Belgium)

UI-first prototype (Next.js App Router + TypeScript + TailwindCSS + Framer Motion).

## Run locally

```bash
npm install
npm run dev -- --port 3001
```

Open:
- `http://localhost:3001/fr`

## Supabase (Auth + Database) — required for launch

This project can run UI-only without Supabase, but for a real launch you should connect:
- Supabase Auth (email/password)
- Postgres tables (dossiers, messages, promo codes, partners)
- RLS policies

### 1) Create a Supabase project

In Supabase dashboard:
- Create a project
- Copy:
  - Project URL
  - Anon public key
  - Service role key (server-only)

### 2) Run the SQL schema

Open Supabase **SQL Editor** and run:
- `supabase/schema.sql`

### 3) Configure env vars

Create `.env.local` (do not commit it):

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3001

NEXT_PUBLIC_SUPABASE_URL=<SUPABASE_PROJECT_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

NEXT_PUBLIC_ENABLE_MOLLIE=false
NEXT_PUBLIC_ENABLE_RESEND=false
```

Then restart `npm run dev`.

### 4) Create an admin user

After signing up, set your role to ADMIN in Supabase SQL Editor:

```sql
update public.profiles set role = 'ADMIN' where id = '<USER_UUID>';
```

## Mollie (test) - payment setup

Add a `.env.local` file in this folder with:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_ENABLE_MOLLIE=false
MOLLIE_API_KEY=your_test_key_here

# Optional (recommended for webhooks in dev):
# expose your local server (ngrok) and set:
# MOLLIE_WEBHOOK_URL=https://YOUR_PUBLIC_URL/api/webhooks/mollie
```

Where to get your Mollie test API key:

```text
https://my.mollie.com/dashboard/developers/api-keys
```

Important:
- Use `test_...` keys for local development/testing.
- Before going live, switch to a `live_...` key. The code will throw an error if it detects a test key in production.

## Resend (real emails)

Add to `.env.local`:

```bash
NEXT_PUBLIC_ENABLE_RESEND=false
RESEND_API_KEY=your_key_here
RESEND_FROM_EMAIL=Mo Consult <no-reply@your-domain.com>
```

Resend dashboard:

```text
https://resend.com/api-keys
```

Dev note:
- In local dev, email notifications are triggered from:
  - `/[lang]/paiement/succes` (client-side call to `/api/notify/payment-confirmed`)
  - AND from Mollie webhook (if `MOLLIE_WEBHOOK_URL` is set to a public URL).
