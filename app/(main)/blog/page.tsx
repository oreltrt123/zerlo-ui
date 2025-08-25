import type { Metadata } from "next";
import { getAllPosts } from "@/lib/markdown/getAllPosts";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog | Zerlo",
  description: "Updates and engineering notes from the Zerlo team.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Zerlo Blog</h1>
      <BlogList posts={posts} />
    </main>
  );
}
