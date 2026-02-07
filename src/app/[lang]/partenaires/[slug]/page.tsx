import { normalizeLang } from "@/lib/i18n";
import { getPartnerBySlugServer } from "@/lib/partners";
import { PartnerProfileClient } from "./partner-profile-client";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = normalizeLang(rawLang);

  const partner = await getPartnerBySlugServer(slug);
  if (!partner) {
    return (
      <main className="min-h-screen bg-[var(--color-beige)]">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="rounded-3xl border border-sand bg-white/70 p-8 shadow-soft-sm backdrop-blur">
            <p className="text-sm font-semibold text-[var(--color-text)]">Partenaire introuvable</p>
            <p className="mt-2 text-sm text-[rgba(43,43,43,0.72)]">
              Ce partenaire n’existe pas (encore).
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <PartnerProfileClient lang={lang} partner={partner} />;
}
