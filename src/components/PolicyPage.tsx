import { PageContainer, PageHeader, Prose } from "@/components/ui";
import { policies, type PolicySlug } from "@/content/policies";

export function PolicyPage({ slug }: { slug: PolicySlug }) {
  const policy = policies[slug];
  return (
    <PageContainer narrow>
      <PageHeader title={policy.title} />
      {policy.draft && (
        <p role="note" className="mb-6 rounded-[8px] border border-gold/40 bg-gold/10 px-4 py-3 text-[14px] text-sand">
          Draft: this page is awaiting final review.
        </p>
      )}
      <Prose text={policy.body} />
    </PageContainer>
  );
}
