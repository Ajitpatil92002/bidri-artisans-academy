import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/AuthForms";
import { PageContainer, PageHeader, panelClass } from "@/components/ui";

export const metadata: Metadata = { title: "Forgot Password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <PageContainer narrow>
      <PageHeader title="Forgot your password?" intro="We'll email you a link to choose a new one." />
      <div className={panelClass}>
        <ForgotPasswordForm />
      </div>
    </PageContainer>
  );
}
