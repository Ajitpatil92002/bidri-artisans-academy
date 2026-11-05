import type { Metadata } from "next";
import { PolicyPage } from "@/components/PolicyPage";
import { policies } from "@/content/policies";

export const metadata: Metadata = { title: policies.returns.title };

export default function ReturnsPage() {
  return <PolicyPage slug="returns" />;
}
