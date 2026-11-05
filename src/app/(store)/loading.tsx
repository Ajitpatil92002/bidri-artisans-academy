export default function Loading() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-[1536px] px-4 py-16 lg:px-[80px]">
      <div role="status" aria-label="Loading" className="animate-pulse space-y-4">
        <div className="h-[36px] w-[280px] rounded bg-line" />
        <div className="h-[18px] w-[420px] max-w-full rounded bg-line" />
      </div>
    </main>
  );
}
