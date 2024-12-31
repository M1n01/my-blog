import { type Tag } from "./Tag";
import { type Category } from "./Category";
import {
  type PartialBlockObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Article = {
  id: string;
  thumbnail?: string;
  title: string;
  description?: string;
  publishedAt: string;
  updatedAt: string;
  category: Category;
  tags: Tag[];
  content?: (PartialBlockObjectResponse | BlockObjectResponse)[];
  likes: number;
  noindex_nofollow: boolean;
};
