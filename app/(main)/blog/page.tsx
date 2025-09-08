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
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        // backgroundImage: 'url("/bg_blog/blogtree.png")',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center top",
        backgroundSize: "cover",
        backgroundAttachment: "fixed", // image stays fixed
      }}
    >
      <main className="max-w-3xl mx-auto px-8 py-12 relative z-10 bg-white backdrop-blur-md">
        <h1 style={{fontSize: "50px"}} className="text-black text-lg font-sans font-light leading-relaxed max-w-3xl mx-auto text-center">Zerlo Blog</h1>
        <BlogList posts={posts} />
      </main>
    </div>
  );
}
