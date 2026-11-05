import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/account/AuthForms";
import { EmptyState, PageContainer, PageHeader, panelClass } from "@/components/ui";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false } };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;

  return (
    <PageContainer narrow>
      <PageHeader title="Choose a new password" />
      {token && !error ? (
        <div className={panelClass}>
          <ResetPasswordForm token={token} />
        </div>
      ) : (
        <EmptyState
          title="This link isn't valid"
          text="Reset links expire after an hour. Please request a new one."
          href="/forgot-password"
          action="Request a new link"
        />
      )}
    </PageContainer>
  );
}
