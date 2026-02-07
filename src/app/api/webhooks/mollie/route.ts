import { NextResponse } from "next/server";
import { mollieGetPayment } from "@/lib/mollie";
import { resendSendEmail } from "@/lib/resend";
import { markPaymentNotified, wasPaymentNotified } from "@/lib/notify-store";

export const runtime = "nodejs";

// UI-only: we log and validate that Mollie calls us.
// Later: update DB dossier/payment status + generate documents, etc.
export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PUBLIC_ENABLE_MOLLIE !== "true") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const contentType = req.headers.get("content-type") || "";
    const raw = await req.text();

    // Mollie usually posts form-encoded: id=tr_xxx
    let paymentId: string | null = null;
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const params = new URLSearchParams(raw);
      paymentId = params.get("id");
    } else {
      // fallback
      try {
        const json = JSON.parse(raw) as any;
        paymentId = json?.id ?? null;
      } catch {
        paymentId = null;
      }
    }

    if (!paymentId) {
      console.warn("[mollie-webhook] missing payment id");
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const payment = await mollieGetPayment(paymentId);
    console.log("[mollie-webhook] payment", {
      id: payment.id,
      status: payment.status,
      metadata: payment.metadata ?? null,
    });

    // Send real emails once when payment is paid (only if Resend is enabled & configured).
    if (process.env.NEXT_PUBLIC_ENABLE_RESEND === "true" && payment.status === "paid") {
      const already = await wasPaymentNotified(payment.id);
      if (!already) {
        const email = String(payment.metadata?.customerEmail || "");
        const name = String(payment.metadata?.customerName || "");
        if (email && email.includes("@")) {
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
          await markPaymentNotified(payment.id);
        } else {
          console.warn("[mollie-webhook] missing metadata email for paid payment", payment.id);
        }
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error("[mollie-webhook] error", err?.message || err);
    // Mollie expects 200 to stop retries; but for dev we still respond 200.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
