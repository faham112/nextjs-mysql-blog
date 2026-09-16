import { query } from "@/lib/db";
export type CommentRow = { id: number; author_name: string; content: string; created_at: Date | string };
export async function listApprovedComments(postId: number) {
  return query<CommentRow>("SELECT id, author_name, content, created_at FROM comments WHERE post_id = ? AND approved = 1 ORDER BY created_at ASC", [postId]);
}
