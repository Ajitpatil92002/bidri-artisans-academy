"use client";

import { sendContactMessage } from "@/app/actions/contact";
import { Field, FormMessage, SubmitButton, TextAreaField, useSubmit } from "@/components/forms";

export function ContactForm() {
  const [state, onSubmit, pending] = useSubmit(sendContactMessage);

  if (state.success) return <FormMessage state={state} />;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <Field label="Your name" name="name" autoComplete="name" required state={state} />
      <Field label="Email" name="email" type="email" autoComplete="email" required state={state} />
      <TextAreaField label="Message" name="message" rows={6} required state={state} />
      {/* Hidden from people; catches bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      <SubmitButton pending={pending}>Send Message</SubmitButton>
    </form>
  );
}
