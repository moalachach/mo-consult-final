import { NextResponse } from "next/server";
import { mollieGetPayment } from "@/lib/mollie";
import { resendSendEmail } from "@/lib/resend";
import { markPaymentNotified, wasPaymentNotified } from "@/lib/notify-store";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PUBLIC_ENABLE_RESEND !== "true") {
      return NextResponse.json({ ok: false, error: "Resend disabled" }, { status: 503 });
    }

    const body = (await req.json()) as { paymentId?: string };
    const paymentId = body.paymentId;
    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "paymentId missing" }, { status: 400 });
    }

    if (await wasPaymentNotified(paymentId)) {
      return NextResponse.json({ ok: true, alreadyNotified: true });
    }

    const payment = await mollieGetPayment(paymentId);
    if (payment.status !== "paid") {
      return NextResponse.json({ ok: false, error: `payment not paid (${payment.status})` }, { status: 409 });
    }

    const email = String(payment.metadata?.customerEmail || "");
    const name = String(payment.metadata?.customerName || "");
    if (!email || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "customer email missing in payment metadata" }, { status: 400 });
    }

    const safeName = name || "client";

    await resendSendEmail({
      to: email,
      subject: "Bienvenue sur Mo Consult",
      text: `Bonjour ${safeName}, bienvenue sur Mo Consult. Votre espace client est actif.`,
    });

    await resendSendEmail({
      to: email,
      subject: "Confirmation de paiement",
      text: "Votre paiement est bien passé. Le traitement de votre dossier commence.",
    });

    await markPaymentNotified(paymentId);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}
