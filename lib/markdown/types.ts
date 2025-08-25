export type PostMeta = {
  title: string;
  slug: string;
  date: string;       // ISO yyyy-mm-dd
  excerpt: string;
  tags?: string[];
  author?: string;
  coverImage?: string;
};

export type Post = PostMeta & {
  content: string;    // raw markdown
  html: string;       // rendered HTML
};
