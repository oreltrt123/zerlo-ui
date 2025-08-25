// src/lib/getPosts.ts
import { Post } from "@/types/post";

export async function getPosts(): Promise<Post[]> {
  return [
    {
      id: "1",
      title: "Getting Started with Next.js",
      slug: "getting-started-nextjs",
      excerpt: "Learn how to set up a modern app using Next.js 13.",
      date: "2025-08-26",
      content:
        "This is the full content of the Next.js getting started article. Here you explain setup, routing, and deployment...",
    },
    {
      id: "2",
      title: "Why TypeScript Improves Your Code",
      slug: "typescript-benefits",
      excerpt:
        "Discover how TypeScript makes your apps safer and easier to maintain.",
      date: "2025-08-25",
      content:
        "TypeScript is a superset of JavaScript that adds static typing. This helps catch errors early and improves developer productivity...",
    },
  ];
}
