import { NextResponse } from "next/server";
import { resendSendEmail } from "@/lib/resend";

export const runtime = "nodejs";

function assertAdminToken(req: Request) {
  if (process.env.NODE_ENV !== "production") return;
  const token = process.env.NOTIFY_ADMIN_TOKEN;
  if (!token) throw new Error("NOTIFY_ADMIN_TOKEN is missing in production");
  const got = req.headers.get("x-admin-token");
  if (got !== token) throw new Error("Unauthorized");
}

export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PUBLIC_ENABLE_RESEND !== "true") {
      return NextResponse.json({ ok: false, error: "Resend disabled" }, { status: 503 });
    }

    assertAdminToken(req);
    const body = (await req.json()) as { to?: string; subject?: string; text?: string };
    const to = String(body.to || "");
    const subject = String(body.subject || "");
    const text = String(body.text || "");
    if (!to || !to.includes("@")) {
      return NextResponse.json({ ok: false, error: "Invalid 'to' email" }, { status: 400 });
    }
    if (!subject || !text) {
      return NextResponse.json({ ok: false, error: "Missing subject/text" }, { status: 400 });
    }

    await resendSendEmail({ to, subject, text });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    const status = msg === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ ok: false, error: msg }, { status });
  }
}
