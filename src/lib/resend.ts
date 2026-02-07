type ResendEmailPayload = {
  from: string;
  to: string[];
  subject: string;
  text: string;
};

function assertResendConfigured() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key) throw new Error("RESEND_API_KEY is missing");
  if (!from) throw new Error("RESEND_FROM_EMAIL is missing");
  return { key, from };
}

export async function resendSendEmail(input: {
  to: string;
  subject: string;
  text: string;
}) {
  const { key, from } = assertResendConfigured();

  const payload: ResendEmailPayload = {
    from,
    to: [input.to],
    subject: input.subject,
    text: input.text,
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend send failed (${res.status}): ${text}`);
  }

  return res.json();
}

