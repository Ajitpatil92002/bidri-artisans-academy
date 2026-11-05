"use client";

import { type FormEvent, startTransition, useActionState, useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/components/icons";
import { buttonClass, inputClass } from "@/components/ui";

export type FormState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

/**
 * Runs a server action without React's automatic form reset, so people keep what they
 * typed when validation fails.
 */
export function useSubmit(action: (state: FormState, formData: FormData) => Promise<FormState>) {
  const [state, dispatch, pending] = useActionState(action, {});
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  };
  return [state, onSubmit, pending] as const;
}

export function SubmitButton({
  children,
  pending,
  className = buttonClass,
}: {
  children: React.ReactNode;
  pending: boolean;
  className?: string;
}) {
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-[8px] border border-red-400/40 bg-red-950/40 px-4 py-3 text-[15px] text-red-200">
        {state.error}
      </p>
    );
  }
  if (state.success) {
    return (
      <p role="status" className="rounded-[8px] border border-gold/40 bg-gold/10 px-4 py-3 text-[15px] text-sand">
        {state.success}
      </p>
    );
  }
  return null;
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  state?: FormState;
  hint?: string;
};

export function Field({ label, name, state, hint, id, type, ...props }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? name;
  const error = state?.fieldErrors?.[name]?.[0];
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-[14px] text-ivory/85">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`${inputClass} ${isPassword ? "pr-12" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted hover:text-gold"
          >
            {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1 text-[13px] text-muted">{hint}</p>}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-[13px] text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  state?: FormState;
  hint?: string;
};

export function TextAreaField({ label, name, state, hint, ...props }: TextAreaProps) {
  const error = state?.fieldErrors?.[name]?.[0];
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[14px] text-ivory/85">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        className={`${inputClass} h-auto min-h-[120px] py-3`}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-[13px] text-muted">{hint}</p>}
      {error && <p className="mt-1 text-[13px] text-red-300">{error}</p>}
    </div>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  state?: FormState;
  options: { value: string; label: string }[];
};

export function SelectField({ label, name, state, options, ...props }: SelectProps) {
  const error = state?.fieldErrors?.[name]?.[0];
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[14px] text-ivory/85">
        {label}
      </label>
      <select id={name} name={name} aria-invalid={Boolean(error)} className={inputClass} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-[13px] text-red-300">{error}</p>}
    </div>
  );
}
