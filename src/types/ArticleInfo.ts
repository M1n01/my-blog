export type ArticleInfo = {
  id: string;
  thumbnail: string;
  title: string;
  description?: string;
  publishedAt: string;
  tags?: {
    id: string;
    name: string;
    color?: string;
  }[];
};
