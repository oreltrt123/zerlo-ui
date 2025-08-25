import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { PostMeta } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(BLOG_DIR);
  const posts: PostMeta[] = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const fullPath = path.join(BLOG_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data } = matter(raw);

    const meta: PostMeta = {
      title: data.title,
      slug: data.slug,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags ?? [],
      author: data.author ?? "Zerlo",
      coverImage: data.coverImage ?? undefined,
    };

    posts.push(meta);
  }

  // newest first
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
