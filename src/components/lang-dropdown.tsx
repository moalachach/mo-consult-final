"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { supportedLangs, type Lang, normalizeLang } from "@/lib/i18n";
import { ChevronDown } from "lucide-react";

const labels: Record<Lang, { flag: string; short: string }> = {
  fr: { flag: "🇫🇷", short: "FR" },
  nl: { flag: "🇳🇱", short: "NL" },
  en: { flag: "🇬🇧", short: "EN" },
};

function buildHref(pathname: string, query: string, nextLang: Lang) {
  const parts = pathname.split("/");
  // pathname usually begins with "/{lang}/..." in this app.
  // On non-locale routes (e.g. /admin), fall back to the locale home.
  const first = parts[1] || "";
  if (supportedLangs.includes(first as any)) {
    parts[1] = nextLang;
    const base = parts.join("/") || `/${nextLang}`;
    return query ? `${base}?${query}` : base;
  }
  const base = `/${nextLang}`;
  return query ? `${base}?${query}` : base;
}

export function LangDropdown({
  currentLang,
  className,
  align = "right",
}: {
  currentLang: string;
  className?: string;
  align?: "left" | "right";
}) {
  const router = useRouter();
  const pathname = usePathname() || "/fr";
  const lang = normalizeLang(currentLang);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    // Avoid useSearchParams() to keep static builds happy (Vercel/Next can require Suspense).
    // Read the current query from the browser only.
    if (typeof window === "undefined") return;
    setQuery(window.location.search.replace(/^\?/, ""));
  }, [pathname]);

  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const current = labels[lang];

  return (
    <div ref={rootRef} className={["relative", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "inline-flex items-center gap-2 rounded-2xl border border-sand bg-white/60 px-3 py-2 text-xs font-semibold text-[rgba(43,43,43,0.76)] shadow-soft-sm transition",
          "hover:bg-[var(--color-sand)]/50 hover:scale-[1.02]",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span aria-hidden>{current.flag}</span>
        <span>{current.short}</span>
        <ChevronDown className="h-4 w-4 text-[rgba(43,43,43,0.6)]" strokeWidth={2.2} />
      </button>

      {open && (
        <div
          role="menu"
          className={[
            "absolute z-50 mt-2 min-w-[140px] overflow-hidden rounded-2xl border border-sand bg-white shadow-soft-sm",
            align === "right" ? "right-0" : "left-0",
          ].join(" ")}
        >
          {supportedLangs.map((l) => {
            const isActive = l === lang;
            const href = buildHref(pathname, query, l);
            return (
              <button
                key={l}
                className={[
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition",
                  "hover:bg-[var(--color-sand)]/45",
                  isActive ? "text-[var(--color-accent)]" : "text-[rgba(43,43,43,0.78)]",
                ].join(" ")}
                role="menuitem"
                type="button"
                onClick={() => {
                  // Preserve hash when switching language (usePathname() doesn't include it).
                  const hash = typeof window !== "undefined" ? window.location.hash : "";
                  setOpen(false);
                  router.push(hash ? `${href}${hash}` : href);
                }}
              >
                <span aria-hidden>{labels[l].flag}</span>
                <span>{labels[l].short}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
