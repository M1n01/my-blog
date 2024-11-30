import { type Tag } from "./Tag";
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
  tags: Tag[];
  content?: (PartialBlockObjectResponse | BlockObjectResponse)[];
};
