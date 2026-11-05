"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import {
  abandonCheckout,
  completeCheckout,
  mockPay,
  startCheckout,
  type StartCheckoutResult,
} from "@/app/actions/checkout";
import { AddressText, type AddressData, NewAddress } from "@/components/account/AccountForms";
import { FormMessage } from "@/components/forms";
import { buttonClass, panelClass, secondaryButtonClass } from "@/components/ui";
import { formatPrice } from "@/lib/money";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

type Started = Extract<StartCheckoutResult, { ok: true }>;

export function CheckoutPanel({ addresses }: { addresses: AddressData[] }) {
  const router = useRouter();
  const [pickedId, setSelectedId] = useState<string>();
  // Falls back to the default, so an address added here is selected straight away
  const selectedId =
    addresses.find((address) => address.id === pickedId)?.id ??
    addresses.find((address) => address.isDefault)?.id ??
    addresses[0]?.id;
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mockOrder, setMockOrder] = useState<Started | null>(null);

  async function finish(payment: Parameters<typeof completeCheckout>[0]) {
    const result = await completeCheckout(payment);
    if (result.ok) {
      router.push(`/checkout/success/${result.orderNumber}`);
    } else {
      setError(result.error);
      setBusy(false);
    }
  }

  async function dismiss(orderNumber: string) {
    await abandonCheckout(orderNumber);
    setBusy(false);
    setMockOrder(null);
    setError("Payment wasn't completed, so you haven't been charged. Your cart is still here.");
    router.refresh();
  }

  async function pay() {
    if (!selectedId) return;
    setBusy(true);
    setError(null);

    const started = await startCheckout(selectedId);
    if (!started.ok) {
      setError(started.error);
      setBusy(false);
      return;
    }

    if (started.mock) {
      setMockOrder(started);
      return;
    }

    if (!window.Razorpay) {
      await abandonCheckout(started.orderNumber);
      setError("The payment window couldn't load. Please check your connection and try again.");
      setBusy(false);
      return;
    }

    new window.Razorpay({
      key: started.keyId,
      amount: started.amount,
      currency: "INR",
      name: "Bidri Craft",
      description: `Order ${started.orderNumber}`,
      order_id: started.razorpayOrderId,
      prefill: {
        name: started.customer.name,
        email: started.customer.email,
        contact: started.customer.phone,
      },
      theme: { color: "#e6d3b3" },
      handler: (response) =>
        finish({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      modal: { ondismiss: () => dismiss(started.orderNumber) },
    }).open();
  }

  return (
    <div className="space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {error && <FormMessage state={{ error }} />}

      <section>
        <h2 className="mb-4 font-serif text-[24px] text-ivory">Delivery address</h2>
        {addresses.length > 0 && (
          <fieldset className="mb-4 grid gap-4 md:grid-cols-2">
            <legend className="sr-only">Choose a delivery address</legend>
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`${panelClass} flex cursor-pointer gap-3 ${
                  address.id === selectedId ? "border-sand" : ""
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={address.id === selectedId}
                  onChange={() => setSelectedId(address.id)}
                  className="mt-1 accent-[var(--color-sand)]"
                />
                <AddressText address={address} />
              </label>
            ))}
          </fieldset>
        )}
        <NewAddress key={addresses.length} startOpen={addresses.length === 0} />
      </section>

      <button
        type="button"
        onClick={pay}
        disabled={busy || !selectedId}
        className={`${buttonClass} w-full sm:w-auto`}
      >
        {busy ? "Please wait…" : "Pay Securely"}
      </button>

      {mockOrder && (
        <div role="dialog" aria-modal="true" aria-label="Test payment" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className={`${panelClass} w-full max-w-[420px]`}>
            <p className="text-[13px] tracking-[0.2em] text-gold uppercase">Test payment</p>
            <h2 className="mt-2 font-serif text-[24px] text-ivory">
              Pay {formatPrice(mockOrder.amount)}
            </h2>
            <p className="mt-2 text-[15px] text-muted">
              This is a local stand-in for Razorpay. No money moves.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className={buttonClass}
                onClick={async () => finish(await mockPay(mockOrder.razorpayOrderId))}
              >
                Simulate Success
              </button>
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() => dismiss(mockOrder.orderNumber)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
