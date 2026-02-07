"use client";

import React from "react";

type BaseProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  showError?: boolean;
  helperText?: string;
  className?: string;
  onBlur?: () => void;
};

const inputBase =
  "w-full rounded-2xl border bg-white px-4 py-3 text-[var(--color-text)] outline-none transition";

function borderClass(showError?: boolean) {
  return showError
    ? "border-red-300 focus:border-red-400"
    : "border-[var(--color-sand)] focus:border-[var(--color-accent)]";
}

function Label({ label, required, id }: { label: string; required?: boolean; id: string }) {
  return (
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-[var(--color-text)]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function ErrorText({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-2 text-sm text-red-600">{error}</p>;
}

export function InputField(
  props: BaseProps & {
    value: string;
    type?: React.HTMLInputTypeAttribute;
    placeholder?: string;
    onChange: (v: string) => void;
  }
) {
  const showErr = !!props.error && !!props.showError;
  return (
    <div className={props.className}>
      <Label id={props.id} label={props.label} required={props.required} />
      <input
        id={props.id}
        className={[inputBase, borderClass(showErr)].join(" ")}
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        aria-invalid={showErr ? "true" : "false"}
      />
      {props.helperText && !showErr && (
        <p className="mt-2 text-xs text-[rgba(43,43,43,0.65)]">{props.helperText}</p>
      )}
      <ErrorText error={showErr ? props.error : undefined} />
    </div>
  );
}

export function TextareaField(
  props: BaseProps & {
    value: string;
    placeholder?: string;
    minHeightClass?: string;
    onChange: (v: string) => void;
  }
) {
  const showErr = !!props.error && !!props.showError;
  return (
    <div className={props.className}>
      <Label id={props.id} label={props.label} required={props.required} />
      <textarea
        id={props.id}
        className={[
          inputBase,
          borderClass(showErr),
          props.minHeightClass ?? "min-h-[130px]",
        ].join(" ")}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        aria-invalid={showErr ? "true" : "false"}
      />
      {props.helperText && !showErr && (
        <p className="mt-2 text-xs text-[rgba(43,43,43,0.65)]">{props.helperText}</p>
      )}
      <ErrorText error={showErr ? props.error : undefined} />
    </div>
  );
}

export function SelectField(
  props: BaseProps & {
    value: string;
    options: Array<{ label: string; value: string }>;
    onChange: (v: string) => void;
  }
) {
  const showErr = !!props.error && !!props.showError;
  return (
    <div className={props.className}>
      <Label id={props.id} label={props.label} required={props.required} />
      <select
        id={props.id}
        className={[inputBase, borderClass(showErr)].join(" ")}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        aria-invalid={showErr ? "true" : "false"}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ErrorText error={showErr ? props.error : undefined} />
    </div>
  );
}

