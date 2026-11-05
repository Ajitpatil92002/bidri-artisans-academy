import { PostForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { requireAdmin } from "@/lib/session";

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeading title="Add post" />
      <PostForm />
    </>
  );
}
