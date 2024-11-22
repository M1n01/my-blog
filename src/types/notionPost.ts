export type NotionPost = {
  id: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags?: string[];
  content: string;
};
