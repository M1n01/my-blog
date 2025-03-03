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
  content?: Block[];
  likes: number;
  noindex_nofollow: boolean;
};

export type Block = PartialBlockObjectResponse | BlockObjectResponse;

export type TextProps = {
  component: "span";
  fw?: 400 | 700;
  fs?: "italic" | "normal";
  td?: "line-through" | "underline" | "none";
  ff?: "monospace";
  c?: string;
};

export type TableOfContentsItem = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};
