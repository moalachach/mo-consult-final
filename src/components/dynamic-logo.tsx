"use client";

import React from "react";

const LOGO_STORAGE_KEY = "moconsult.logo.dataUrl";

function readLogo(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(LOGO_STORAGE_KEY);
    return v && v.trim().length > 0 ? v : null;
  } catch {
    return null;
  }
}

export function DynamicLogo() {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const sync = () => setDataUrl(readLogo());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("moconsult:logo", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("moconsult:logo", sync as EventListener);
    };
  }, []);

  if (!dataUrl) {
    return (
      <span
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-extrabold text-white"
        aria-hidden="true"
      >
        MC
      </span>
    );
  }

  // Intentionally use <img> (not Next/Image): we want explicit width control and no wrapper styling.
  // Logo is stored as a data URL for now (admin/settings).
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={dataUrl}
      alt="Mo Consult logo"
      className="block h-11 w-11 object-contain"
      loading="eager"
      decoding="async"
    />
  );
}

export { LOGO_STORAGE_KEY };
