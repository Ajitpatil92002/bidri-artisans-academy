import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/account/AuthForms";
import { PageContainer, PageHeader, panelClass } from "@/components/ui";
import { getSessionUser, safeRedirectPath } from "@/lib/session";

export const metadata: Metadata = { title: "Create Account", robots: { index: false } };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  if (await getSessionUser()) redirect(safeRedirectPath(next));
  const target = next ? safeRedirectPath(next) : undefined;

  return (
    <PageContainer narrow>
      <PageHeader title="Create Account" />
      <div className={panelClass}>
        <RegisterForm next={target} />
      </div>
    </PageContainer>
  );
}
