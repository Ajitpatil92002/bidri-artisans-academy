import Link from "next/link";
import { AdminHeading, AdminTable, Td } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await db.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <>
      <AdminHeading title="Journal" href="/admin/posts/new" action="Add Post" />
      <AdminTable headings={["Title", "Status", "Published"]}>
        {posts.map((post) => (
          <tr key={post.id}>
            <Td>
              <Link href={`/admin/posts/${post.id}`} className="text-ivory underline hover:text-gold">
                {post.title}
              </Link>
            </Td>
            <Td>{post.status}</Td>
            <Td>{post.publishedAt?.toLocaleDateString("en-IN", { dateStyle: "medium" }) ?? "—"}</Td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}
