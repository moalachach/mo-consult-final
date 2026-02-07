# Mo Consult – Company Creation Platform (Belgium)

UI-first prototype (Next.js App Router + TypeScript + TailwindCSS + Framer Motion).

## Run locally

```bash
npm install
npm run dev -- --port 3001
```

Open:
- `http://localhost:3001/fr`

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
