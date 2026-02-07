"use client";

import React from "react";

export type LogoSlot = "header" | "footer";

// Back-compat (older builds stored a single logo for the whole site).
const LEGACY_LOGO_STORAGE_KEY = "moconsult.logo.dataUrl";

export const LOGO_STORAGE_KEYS = {
  header: "moconsult.logo.header.dataUrl",
  footer: "moconsult.logo.footer.dataUrl",
} as const;

function readLogo(slot: LogoSlot): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LOGO_STORAGE_KEYS[slot]);
    if (v && v.trim().length > 0) return v;
    // Fall back to legacy key if the slot-specific one isn't set yet.
    const legacy = window.localStorage.getItem(LEGACY_LOGO_STORAGE_KEY);
    if (legacy && legacy.trim().length > 0) return legacy;
    return v && v.trim().length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function DynamicLogo({
  slot = "header",
  className,
}: {
  slot?: LogoSlot;
  className?: string;
}) {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sync = () => setDataUrl(readLogo(slot));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("moconsult:logo", sync as EventListener);
    window.addEventListener(`moconsult:logo:${slot}`, sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("moconsult:logo", sync as EventListener);
      window.removeEventListener(`moconsult:logo:${slot}`, sync as EventListener);
    };
  }, [slot]);

  if (!dataUrl) {
    return (
      <span
        className={[
          "inline-flex items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-extrabold text-white",
          slot === "footer" ? "h-12 w-12" : "h-11 w-11",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-hidden="true"
      >
        MC
      </span>
    );
  }

  const defaultSize =
    slot === "footer"
      ? "h-12 w-auto max-w-[180px]"
      : "h-11 w-auto max-w-[72px]";

  // Intentionally use <img> (not Next/Image): we want explicit width control and no wrapper styling.
  // Logo is stored as a data URL for now (admin/settings).
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={dataUrl}
      alt={slot === "footer" ? "Mo Consult logo (footer)" : "Mo Consult logo"}
      className={["block object-contain", defaultSize, className].filter(Boolean).join(" ")}
      loading="eager"
      decoding="async"
    />
  );
}

export { LEGACY_LOGO_STORAGE_KEY };
