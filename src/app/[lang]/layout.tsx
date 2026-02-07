import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supportedLangs, normalizeLang } from "@/lib/i18n";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = normalizeLang(rawLang);

  return (
    <>
      <SiteHeader lang={lang} />
      {children}
      <SiteFooter lang={lang} />
    </>
  );
}

export function generateStaticParams() {
  return supportedLangs.map((lang) => ({ lang }));
}
