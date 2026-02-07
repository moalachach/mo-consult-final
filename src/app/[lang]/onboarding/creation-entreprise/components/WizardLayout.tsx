"use client";

import React from "react";

export function WizardLayout({
  title,
  subtitle,
  stepper,
  children,
  footer,
  banner,
}: {
  title: string;
  subtitle?: string;
  stepper: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
  banner?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-beige)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        {banner}
        <div className="mb-6">
          <div className="rounded-3xl border border-[var(--color-sand)] bg-white/70 p-6 backdrop-blur">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-[var(--color-text)]">{title}</h1>
              {subtitle && (
                <p className="text-sm text-[rgba(43,43,43,0.72)]">{subtitle}</p>
              )}
            </div>
            <div className="mt-5">{stepper}</div>
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--color-sand)] bg-white/80 p-6 shadow-soft-sm backdrop-blur">
          {children}
          <div className="mt-8 border-t border-[var(--color-sand)] pt-6">{footer}</div>
        </div>
      </div>
    </div>
  );
}

