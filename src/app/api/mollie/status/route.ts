import { NextResponse } from "next/server";
import { mollieGetPayment } from "@/lib/mollie";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    if (process.env.NEXT_PUBLIC_ENABLE_MOLLIE !== "true") {
      return NextResponse.json(
        { ok: false, error: "Mollie is disabled (enable later when site config is finished)" },
        { status: 503 }
      );
    }

    const url = new URL(req.url);
    const paymentId = url.searchParams.get("paymentId");
    if (!paymentId) {
      return NextResponse.json({ ok: false, error: "paymentId missing" }, { status: 400 });
    }

    const payment = await mollieGetPayment(paymentId);
    return NextResponse.json({
      ok: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        metadata: payment.metadata ?? null,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
