export type NotionPost = {
  id: string;
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  tags?: {
    id: string;
    name: string;
    color?: string;
  }[];
  content: string;
};
