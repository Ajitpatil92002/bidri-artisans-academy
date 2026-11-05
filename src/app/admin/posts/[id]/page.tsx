import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const post = await db.post.findUnique({ where: { id: (await params).id } });
  if (!post) notFound();

  return (
    <>
      <AdminHeading title={post.title} />
      <PostForm key={post.updatedAt.toISOString()} post={post} />
    </>
  );
}
