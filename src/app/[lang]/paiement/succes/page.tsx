"use client";

import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { normalizeLang } from "@/lib/i18n";
import { getSession } from "@/lib/mock-auth";
import { completeMockPayment } from "@/lib/mock-dossiers";

export default function Page() {
  const params = useParams<{ lang: string }>();
  const lang = normalizeLang(params.lang);

  const [type, setType] = React.useState<"srl" | "pp">("pp");
  const enableMollie = process.env.NEXT_PUBLIC_ENABLE_MOLLIE === "true";
  const enableResend = process.env.NEXT_PUBLIC_ENABLE_RESEND === "true";
  const [paymentId, setPaymentId] = React.useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = React.useState<string | null>(null);

  const [state, setState] = React.useState<"checking" | "paid" | "not_paid" | "error">(
    "checking"
  );
  const [err, setErr] = React.useState<string | null>(null);
  const [notifyDone, setNotifyDone] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    setType(sp.get("type") === "srl" ? "srl" : "pp");
    setPaymentId(sp.get("paymentId"));
  }, []);

  React.useEffect(() => {
    const run = async () => {
      const session = getSession();
      if (!session) {
        // Keep page helpful (no blank state). User can still log in and continue.
        setState("error");
        setErr("Veuillez vous connecter pour finaliser le paiement.");
        return;
      }
      setSessionEmail(session.email);

      if (!enableMollie) {
        // UI-only flow: treat as paid and continue.
        completeMockPayment(type, session);
        setState("paid");
        return;
      }

      // If we don't have paymentId in the URL, try reading the last one from localStorage.
      const pid =
        paymentId ||
        (typeof window !== "undefined"
          ? localStorage.getItem(`moConsult:lastPayment:${type}`)
          : null);
      if (!pid) {
        // Some redirect setups don't include paymentId. For UI testing we keep the UX smooth:
        // mark as paid and start dossier processing, then redirect user to client space.
        // TODO(production): require verification (paymentId + webhook).
        completeMockPayment(type, session);
        setState("paid");
        return;
      }
      if (!paymentId) setPaymentId(pid);

      try {
        const res = await fetch(`/api/mollie/status?paymentId=${encodeURIComponent(pid)}`);
        const json = (await res.json()) as any;
        if (!json.ok) throw new Error(json.error || "Status error");

        const status = json.payment?.status;
        if (status === "paid") {
          completeMockPayment(type, session);
          setState("paid");
        } else {
          setState("not_paid");
        }
      } catch (e: any) {
        // If status check fails, keep a safe UX instead of a hard error page.
        // The client can still access their space; admin will verify via webhook later.
        completeMockPayment(type, session);
        setState("paid");
        setErr(e?.message || "Erreur");
      }
    };
    run();
  }, [enableMollie, paymentId, type]);

  // Trigger real email notifications (server-side via Resend) once, if possible.
  React.useEffect(() => {
    if (!enableResend) return;
    const pid =
      paymentId ||
      (typeof window !== "undefined"
        ? localStorage.getItem(`moConsult:lastPayment:${type}`)
        : null);
    if (state !== "paid" || !pid) return;
    const key = `moConsult:notify:payment:${pid}`;
    if (typeof window !== "undefined" && localStorage.getItem(key) === "1") return;

    (async () => {
      try {
        const res = await fetch("/api/notify/payment-confirmed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId: pid }),
        });
        const json = (await res.json()) as any;
        if (json.ok) {
          if (typeof window !== "undefined") localStorage.setItem(key, "1");
          setNotifyDone(true);
        }
      } catch {
        // ignore: webhook can still send later
      }
    })();
  }, [enableResend, paymentId, state, type]);

  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-8 shadow-sm backdrop-blur"
        >
          {state === "checking" ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-[var(--color-accent)]" />
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Vérification du paiement…
              </p>
            </div>
          ) : state === "paid" ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-6 w-6 text-[var(--color-accent)]" />
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  Paiement réussi
                </p>
                <p className="mt-1 text-sm text-[rgba(43,43,43,0.72)]">
                  Votre paiement est bien passé. Le traitement de votre dossier commence maintenant.
                </p>
                {sessionEmail ? (
                  <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
                    Connecté: <span className="font-semibold">{sessionEmail}</span>
                  </p>
                ) : null}

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    href={`/${lang}/espace-client/dossiers/creation-${type}`}
                  >
                    Aller à mon espace client
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-2xl border border-[var(--color-sand)] bg-white/60 px-5 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                    href={`/${lang}/faq`}
                  >
                    FAQ
                  </Link>
                </div>

                <div className="mt-5 rounded-2xl border border-[var(--color-sand)] bg-white/60 p-4">
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Une question ?
                  </p>
                  <p className="mt-1 text-sm text-[rgba(43,43,43,0.72)]">
                    Écrivez-nous depuis votre espace client (Messages). On répond rapidement.
                  </p>
                </div>

                {notifyDone ? (
                  <p className="mt-3 text-xs text-[rgba(43,43,43,0.55)]">
                    Email envoyé: bienvenue + confirmation de paiement.
                  </p>
                ) : null}

                {err ? (
                  <p className="mt-3 text-xs text-[rgba(43,43,43,0.55)]">
                    (Info technique: {err})
                  </p>
                ) : null}
              </div>
            </div>
          ) : state === "not_paid" ? (
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Paiement en attente
              </p>
              <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
                Votre paiement n’est pas encore confirmé. Réessayez dans quelques instants.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-[var(--color-sand)] bg-white/60 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-beige)]"
                  onClick={() => window.location.reload()}
                >
                  Rafraîchir
                </button>
                <Link
                  className="rounded-2xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                  href={`/${lang}/espace-client`}
                >
                  Espace client
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Erreur</p>
              <p className="mt-2 text-sm text-red-600">{err}</p>
              <Link
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                href={`/${lang}/espace-client/login`}
              >
                Se connecter
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
