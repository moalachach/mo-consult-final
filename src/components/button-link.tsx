"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  ariaLabel?: string;
};

function isSpecialHref(href: string) {
  return href.startsWith("mailto:") || href.startsWith("tel:");
}

export function ButtonLink({
  href,
  children,
  variant,
  className,
  ariaLabel,
}: ButtonLinkProps) {
  // Important: keep "Link behaves like a button" composition in a Client Component.
  // Next.js' <Link> injects event handlers into its child; doing that from a Server Component
  // (Link wrapping a Client <Button/>) triggers:
  // "Event handlers cannot be passed to Client Component props".
  //
  // Also: avoid nesting a <button> inside <a> (invalid HTML). We render a styled <a>.

  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-beige)]";
  const styles = {
    primary: "bg-[var(--color-accent)] text-white shadow-soft-sm hover:bg-[var(--color-primary)]",
    secondary: "bg-[var(--color-primary)] text-white shadow-soft-sm hover:bg-[var(--color-accent)]",
    outline:
      "border border-sand bg-white/60 text-[var(--color-primary)] hover:bg-[var(--color-sand)]/60",
    ghost: "text-[var(--color-primary)] hover:text-[var(--color-accent)]",
  } as const;

  const v = variant ?? "primary";
  const cls = [base, styles[v], className].filter(Boolean).join(" ");

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
  } as const;

  if (isSpecialHref(href)) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        className={cls}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <Link href={href} legacyBehavior passHref>
      <motion.a aria-label={ariaLabel} className={cls} {...motionProps}>
        {children}
      </motion.a>
    </Link>
  );
}
