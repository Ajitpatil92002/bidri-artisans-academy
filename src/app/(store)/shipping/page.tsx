import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/content/policies";

export const metadata: Metadata = { title: policies.shipping.title };

export default function ShippingPage() {
  return <PolicyPage slug="shipping" />;
}
