import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/content/policies";

export const metadata: Metadata = { title: policies.privacy.title };

export default function PrivacyPage() {
  return <PolicyPage slug="privacy" />;
}
