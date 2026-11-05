import { EmptyState, PageContainer } from "@/components/ui";

export default function NotFound() {
  return (
    <PageContainer narrow>
      <EmptyState
        title="We couldn't find that page"
        text="It may have moved, or the piece may no longer be available."
        href="/shop"
        action="Browse the collection"
      />
    </PageContainer>
  );
}
