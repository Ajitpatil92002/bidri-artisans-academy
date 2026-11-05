import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/account/AuthForms";
import { PageContainer, PageHeader, panelClass } from "@/components/ui";
import { getSessionUser, safeRedirectPath } from "@/lib/session";

export const metadata: Metadata = { title: "Log In", robots: { index: false } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reset?: string }>;
}) {
  const { next, reset } = await searchParams;
  if (await getSessionUser()) redirect(safeRedirectPath(next));
  const target = next ? safeRedirectPath(next) : undefined;

  return (
    <PageContainer narrow>
      <PageHeader title="Log In" />
      <div className={panelClass}>
        {reset && <p className="mb-4 text-[15px] text-sand">Password updated. Please log in.</p>}
        <LoginForm next={target} />
      </div>
    </PageContainer>
  );
}
