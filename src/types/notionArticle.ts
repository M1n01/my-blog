export type NotionArticle = {
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
