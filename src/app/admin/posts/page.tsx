import Link from "next/link";
import { Plus } from "lucide-react";
import { listAllPosts } from "@/lib/posts";
import PageHeader from "@/components/admin/PageHeader";
import PostsTable from "@/components/admin/PostsTable";
import { toAdminRows, type AdminPostStatus } from "@/components/admin/rows";

export const dynamic = "force-dynamic";

const VALID: AdminPostStatus[] = ["published", "draft", "scheduled"];

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const initial = VALID.includes(sp?.status as AdminPostStatus) ? (sp.status as AdminPostStatus) : "all";
  let posts: Awaited<ReturnType<typeof listAllPosts>> = [];
  try {
    posts = await listAllPosts();
  } catch (e) {
    console.error(e);
  }
  return (
    <div>
      <PageHeader
        title="Posts"
        description="Search, filter and edit every article on the site."
        actions={
          <Link href="/admin/posts/new" className="btn">
            <Plus size={16} strokeWidth={2.4} /> New article
          </Link>
        }
      />
      <PostsTable key={initial} rows={toAdminRows(posts)} initialStatus={initial} syncUrl />
    </div>
  );
}
