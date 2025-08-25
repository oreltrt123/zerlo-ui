import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Post } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(raw);
    const processed = await remark().use(html).process(content);
    const htmlContent = processed.toString();

    return {
      title: data.title,
      slug: data.slug,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags ?? [],
      author: data.author ?? "Zerlo",
      coverImage: data.coverImage ?? undefined,
      content,
      html: htmlContent,
    };
  } catch {
    return null;
  }
}
