import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/content/policies";

export const metadata: Metadata = { title: policies.care.title };

export default function CarePage() {
  return <PolicyPage slug="care" />;
}
