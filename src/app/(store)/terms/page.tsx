import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/content/policies";

export const metadata: Metadata = { title: policies.terms.title };

export default function TermsPage() {
  return <PolicyPage slug="terms" />;
}
