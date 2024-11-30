import { ArticleInfo } from "./ArticleInfo";
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export type Article = {
  info: ArticleInfo | null;
  contents: (PartialBlockObjectResponse | BlockObjectResponse)[];
};
