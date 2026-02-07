"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { supportedLangs } from "@/lib/i18n";

function langFromPath(pathname: string) {
  const seg = pathname.split("/")[1] || "";
  return supportedLangs.includes(seg as any) ? seg : undefined;
}

export function AnalyticsTracker() {
  const pathname = usePathname() || "/";
  const lastRef = React.useRef<string>("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const key = `${pathname}|${window.location.search}`;
    if (lastRef.current === key) return;
    lastRef.current = key;

    const payload = {
      path: `${pathname}${window.location.search}${window.location.hash || ""}`,
      lang: langFromPath(pathname),
      referrer: document.referrer || undefined,
    };

    try {
      const body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/pageview", blob);
      } else {
        fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // never break navigation
    }
  }, [pathname]);

  return null;
}

