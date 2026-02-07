"use client";

import React from "react";
import { motion } from "framer-motion";

const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

// React's `onDrag` (HTML DragEvent) conflicts with Framer Motion's `onDrag` (pointer-based).
// Omit it so we can safely spread standard button props onto `motion.button`.
type SafeButtonProps = Omit<
  ButtonProps,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export function Button({ variant = "primary", className, ...props }: SafeButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-beige)]";
  const styles = {
    primary: "bg-[var(--color-accent)] text-white shadow-soft-sm hover:bg-[var(--color-primary)]",
    secondary: "bg-[var(--color-primary)] text-white shadow-soft-sm hover:bg-[var(--color-accent)]",
    outline:
      "border border-sand bg-white/60 text-[var(--color-primary)] hover:bg-[var(--color-sand)]/60",
    ghost: "text-[var(--color-primary)] hover:text-[var(--color-accent)]",
  } as const;

  const motionProps = props.disabled
    ? {}
    : {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.98 },
      };

  return (
    <motion.button
      className={cx(base, styles[variant], className)}
      {...motionProps}
      {...props}
    />
  );
}

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "accent";
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  const tones = {
    neutral: "bg-sand text-primary",
    accent: "bg-[rgba(31,143,95,0.16)] text-[var(--color-accent)]",
  } as const;

  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  accent?: boolean;
};

type SafeCardProps = Omit<
  CardProps,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

export function Card({ accent, className, ...props }: SafeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cx(
        "rounded-3xl border border-sand bg-white p-6 shadow-soft-sm",
        accent && "border-[rgba(31,143,95,0.25)] bg-white/90",
        className
      )}
      {...props}
    />
  );
}
