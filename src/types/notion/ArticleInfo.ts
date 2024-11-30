import { type Tag } from "./Tag";

export type ArticleInfo = {
  id: string;
  thumbnail: string;
  title: string;
  description?: string;
  publishedAt: string;
  tags: Tag[];
};
