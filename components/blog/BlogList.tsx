import BlogCard from "./BlogCard";
import type { PostMeta } from "@/lib/markdown/types";

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="space-y-6">
      {posts.map((p, i) => (
        <BlogCard
          key={p.slug ?? i}
          title={p.title}
          slug={p.slug}
          excerpt={p.excerpt}
          date={p.date}
          coverImage={p.coverImage}
        />
      ))}
    </div>
  );
}
