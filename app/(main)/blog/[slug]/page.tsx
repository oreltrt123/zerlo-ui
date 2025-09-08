// src/app/(main)/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getAllSlugs } from "@/lib/markdown/getAllPosts";
import { getPostBySlug } from "@/lib/markdown/getPostBySlug";

type Props = {
  params: Promise<{ slug: string }>; // Fix: params is a Promise
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0)
    .map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params; // Await the params Promise to access slug
  if (!slug) notFound();

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <main className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-black mb-2 text-3xl font-sans font-light leading-relaxed max-w-3xl mx-auto">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {formattedDate} · {post.author}
      </p>

      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          className="w-full rounded-xl mb-8"
        />
      )}

      <article
        className="prose prose-zinc max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </main>
  );
}