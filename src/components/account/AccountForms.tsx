"use client";

import { useEffect, useState, useTransition } from "react";
import { deleteAddress, saveAddress, updateProfile } from "@/app/actions/account";
import { changePassword } from "@/app/actions/auth";
import {
  Field,
  FormMessage,
  SelectField,
  SubmitButton,
  useSubmit,
} from "@/components/forms";
import { panelClass, secondaryButtonClass } from "@/components/ui";
import { INDIAN_STATES } from "@/lib/validation";

export function ProfileForm({ name, phone, email }: { name: string; phone: string; email: string }) {
  const [state, onSubmit, pending] = useSubmit(updateProfile);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <Field label="Email" name="email" value={email} readOnly disabled />
      <Field label="Full name" name="name" defaultValue={name} required state={state} />
      <Field label="Mobile number" name="phone" type="tel" defaultValue={phone} required state={state} />
      <SubmitButton pending={pending}>Save Profile</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, onSubmit, pending] = useSubmit(changePassword);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <Field
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        required
        state={state}
      />
      <Field
        label="New password"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        required
        state={state}
      />
      <SubmitButton pending={pending} className={secondaryButtonClass}>Change Password</SubmitButton>
    </form>
  );
}

export type AddressData = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const stateOptions = [
  { value: "", label: "Choose a state" },
  ...INDIAN_STATES.map((state) => ({ value: state, label: state })),
];

export function AddressForm({
  address,
  onSaved,
}: {
  address?: AddressData;
  onSaved?: () => void;
}) {
  const [state, onSubmit, pending] = useSubmit(saveAddress);

  useEffect(() => {
    if (state.success) onSaved?.();
  }, [state, onSaved]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <input type="hidden" name="id" value={address?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="fullName" defaultValue={address?.fullName} required state={state} />
        <Field label="Mobile number" name="phone" type="tel" defaultValue={address?.phone} required state={state} />
      </div>
      <Field label="Address line 1" name="line1" defaultValue={address?.line1} required state={state} />
      <Field label="Address line 2 (optional)" name="line2" defaultValue={address?.line2 ?? ""} state={state} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" name="city" defaultValue={address?.city} required state={state} />
        <SelectField
          label="State"
          name="state"
          defaultValue={address?.state ?? ""}
          options={stateOptions}
          required
          state={state}
        />
        <Field
          label="PIN code"
          name="pincode"
          inputMode="numeric"
          defaultValue={address?.pincode}
          required
          state={state}
        />
      </div>
      <label className="flex items-center gap-2 text-[15px] text-ivory/85">
        <input type="checkbox" name="isDefault" defaultChecked={address?.isDefault} className="size-4 accent-[var(--color-sand)]" />
        Use as my default address
      </label>
      <SubmitButton pending={pending}>Save Address</SubmitButton>
    </form>
  );
}

export function AddressText({ address }: { address: AddressData }) {
  return (
    <address className="text-[15px] leading-[1.6] text-ivory/85 not-italic">
      {address.fullName}
      <br />
      {address.line1}
      {address.line2 && (
        <>
          <br />
          {address.line2}
        </>
      )}
      <br />
      {address.city}, {address.state} {address.pincode}
      <br />
      {address.phone}
    </address>
  );
}

export function AddressCard({ address }: { address: AddressData }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <div className={panelClass}>
        <AddressForm address={address} onSaved={() => setEditing(false)} />
        <button type="button" onClick={() => setEditing(false)} className="mt-3 text-[15px] text-muted hover:text-gold">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      {address.isDefault && <p className="mb-2 text-[13px] text-gold">Default address</p>}
      <AddressText address={address} />
      <div className="mt-4 flex gap-4 text-[15px]">
        <button type="button" onClick={() => setEditing(true)} className="text-ivory underline hover:text-gold">
          Edit
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => deleteAddress(address.id))}
          className="text-muted underline hover:text-red-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function NewAddress({ startOpen = false }: { startOpen?: boolean }) {
  const [open, setOpen] = useState(startOpen);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={secondaryButtonClass}>
        Add a New Address
      </button>
    );
  }
  return (
    <div className={panelClass}>
      <AddressForm onSaved={() => setOpen(false)} />
    </div>
  );
}
