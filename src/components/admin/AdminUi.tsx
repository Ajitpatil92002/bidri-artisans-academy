import Link from "next/link";
import { buttonClass, panelClass } from "@/components/ui";

export function AdminHeading({
  title,
  href,
  action,
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="font-serif text-[32px] text-ivory">{title}</h1>
      {href && action && (
        <Link href={href} className={buttonClass}>
          {action}
        </Link>
      )}
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={panelClass}>
      <p className="text-[14px] text-muted">{label}</p>
      <p className="mt-1 font-serif text-[30px] text-ivory">{value}</p>
    </div>
  );
}

export function AdminTable({
  headings,
  children,
}: {
  headings: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-[8px] border border-line">
      <table className="w-full min-w-[560px] text-left text-[15px]">
        <thead className="bg-ink-2 text-[13px] text-muted">
          <tr>
            {headings.map((heading) => (
              <th key={heading} scope="col" className="px-4 py-3 font-normal">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-3 text-ivory/85">{children}</td>;
}
