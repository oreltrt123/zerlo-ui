// src/lib/getPostBySlug.ts
import { getPosts } from "./getPosts";
import { Post } from "@/types/post";

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}
