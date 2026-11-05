"use client";

import Link from "next/link";
import { forgotPassword, login, register, resetPassword } from "@/app/actions/auth";
import { Field, FormMessage, SubmitButton, useSubmit } from "@/components/forms";

const linkClass = "text-ivory underline hover:text-gold";

export function LoginForm({ next }: { next?: string }) {
  const [state, onSubmit, pending] = useSubmit(login);
  const registerHref = next ? `/register?next=${encodeURIComponent(next)}` : "/register";
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" name="email" type="email" autoComplete="email" required state={state} />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        state={state}
      />
      <SubmitButton pending={pending}>Log In</SubmitButton>
      <p className="text-[15px] text-muted">
        <Link href="/forgot-password" className={linkClass}>
          Forgot your password?
        </Link>
      </p>
      <p className="text-[15px] text-muted">
        New here?{" "}
        <Link href={registerHref} className={linkClass}>
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next?: string }) {
  const [state, onSubmit, pending] = useSubmit(register);
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Full name" name="name" autoComplete="name" required state={state} />
      <Field label="Email" name="email" type="email" autoComplete="email" required state={state} />
      <Field
        label="Mobile number"
        name="phone"
        type="tel"
        autoComplete="tel-national"
        hint="10 digits, for delivery updates."
        required
        state={state}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        required
        state={state}
      />
      <Field
        label="Confirm password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        state={state}
      />
      <SubmitButton pending={pending}>Create Account</SubmitButton>
      <p className="text-[15px] text-muted">
        Already have an account?{" "}
        <Link href={loginHref} className={linkClass}>
          Log in
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, onSubmit, pending] = useSubmit(forgotPassword);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <Field label="Email" name="email" type="email" autoComplete="email" required state={state} />
      <SubmitButton pending={pending}>Send Reset Link</SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, onSubmit, pending] = useSubmit(resetPassword);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <input type="hidden" name="token" value={token} />
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        required
        state={state}
      />
      <SubmitButton pending={pending}>Set New Password</SubmitButton>
    </form>
  );
}
