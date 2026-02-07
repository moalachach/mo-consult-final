import { NextResponse } from "next/server";
import { mollieCreatePayment } from "@/lib/mollie";

export const runtime = "nodejs";

function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) throw new Error("NEXT_PUBLIC_APP_URL is missing (e.g. http://localhost:3001)");
  return url.replace(/\/+$/, "");
}

export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PUBLIC_ENABLE_MOLLIE !== "true") {
      return NextResponse.json(
        { ok: false, error: "Mollie is disabled (enable later when site config is finished)" },
        { status: 503 }
      );
    }

    const body = (await req.json()) as {
      type?: "srl" | "pp";
      lang?: string;
      customer?: { name?: string; email?: string };
    };
    const type = body.type === "srl" ? "srl" : "pp";
    const lang = typeof body.lang === "string" ? body.lang : "fr";
    const customerName = body.customer?.name ? String(body.customer.name) : "";
    const customerEmail = body.customer?.email ? String(body.customer.email) : "";

    const amountEur = type === "srl" ? 1250 : 200;

    const appUrl = getAppUrl();
    // We'll attach paymentId via Mollie's redirect? Not guaranteed, so we include only type here.
    // The client will poll payment status by id returned from this endpoint.
    const redirectUrl = `${appUrl}/${lang}/paiement/succes?type=${encodeURIComponent(type)}`;
    const cancelUrl = `${appUrl}/${lang}/paiement/annule?type=${encodeURIComponent(type)}`;
    const webhookUrl = process.env.MOLLIE_WEBHOOK_URL; // optional (use ngrok in dev)

    const payment = await mollieCreatePayment({
      amountEur,
      description: type === "srl" ? "Mo Consult - Création SRL" : "Mo Consult - Indépendant (PP)",
      redirectUrl,
      webhookUrl,
      metadata: { type, lang, customerEmail, customerName },
    });

    const checkoutUrl = payment._links?.checkout?.href;
    if (!checkoutUrl) {
      return NextResponse.json(
        { ok: false, error: "No checkout URL returned by Mollie" },
        { status: 500 }
      );
    }

    // In case Mollie supports passing cancelUrl (some setups do), keep it in response for future UI.
    return NextResponse.json({ ok: true, paymentId: payment.id, checkoutUrl, cancelUrl });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
