import { HandledToggle } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { panelClass } from "@/components/ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await db.contactMessage.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <>
      <AdminHeading title="Messages" />
      {messages.length === 0 && <p className="text-[15px] text-muted">No messages yet.</p>}
      <ul className="max-w-[820px] space-y-4">
        {messages.map((message) => (
          <li key={message.id} className={`${panelClass} ${message.handled ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap justify-between gap-3">
              <p className="text-[16px] text-ivory">
                {message.name} ·{" "}
                <a href={`mailto:${message.email}`} className="underline hover:text-gold">
                  {message.email}
                </a>
              </p>
              <HandledToggle id={message.id} handled={message.handled} />
            </div>
            <p className="mt-2 text-[15px] leading-[1.6] whitespace-pre-wrap text-ivory/85">
              {message.message}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
