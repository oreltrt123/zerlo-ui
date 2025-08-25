// src/components/BlogCard.tsx
import Link from "next/link";

type Props = {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  coverImage?: string;
};

export default function BlogCard({ title, slug, excerpt, date, coverImage }: Props) {
  return (
    <article className="p-6 transition">
      {coverImage ? (
        <Link href={`/blog/${slug}`} className="block mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt="" className="w-full h-48 object-cover rounded-lg" />
        </Link>
      ) : null}

      <h2 className="text-2xl font-semibold mb-2">
        <Link href={`/blog/${slug}`} className="hover:underline">
          {title}
        </Link>
      </h2>

      <p className="text-gray-600 mb-3">{excerpt}</p>

      {/* Problem line: this can throw "Invalid Date" */}
      <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</span>
    </article>
  );
}
