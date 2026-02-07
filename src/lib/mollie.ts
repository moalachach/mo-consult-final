type MollieAmount = { currency: "EUR"; value: string };

export type MolliePayment = {
  id: string;
  status: string;
  amount: MollieAmount;
  description?: string;
  metadata?: Record<string, any>;
  _links?: { checkout?: { href: string } };
};

function assertMollieConfigured() {
  const key = process.env.MOLLIE_API_KEY;
  if (!key) throw new Error("MOLLIE_API_KEY is missing");

  // Safety: never ship with test keys in production.
  if (process.env.NODE_ENV === "production" && key.startsWith("test_")) {
    throw new Error("MOLLIE_API_KEY is a test key in production. Replace with live key.");
  }

  return key;
}

function apiBase() {
  // Payments API v2
  return "https://api.mollie.com/v2";
}

function formatEur(amount: number): string {
  // Mollie expects string with 2 decimals.
  return amount.toFixed(2);
}

export async function mollieCreatePayment(input: {
  amountEur: number;
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
}) {
  const key = assertMollieConfigured();

  const res = await fetch(`${apiBase()}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: { currency: "EUR", value: formatEur(input.amountEur) },
      description: input.description,
      redirectUrl: input.redirectUrl,
      // Webhook is optional in local dev (needs a public URL like ngrok).
      ...(input.webhookUrl ? { webhookUrl: input.webhookUrl } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mollie create payment failed (${res.status}): ${text}`);
  }

  return (await res.json()) as MolliePayment;
}

export async function mollieGetPayment(paymentId: string) {
  const key = assertMollieConfigured();
  const res = await fetch(`${apiBase()}/payments/${encodeURIComponent(paymentId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mollie get payment failed (${res.status}): ${text}`);
  }

  return (await res.json()) as MolliePayment;
}

