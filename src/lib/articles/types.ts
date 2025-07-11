import {
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Result } from "neverthrow";
import type { Article } from "../../types/notion/Article";

/**
 * エラー型の定義
 */
export type NotionError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "OBJECT_NOT_FOUND"; message: string }
  | { type: "REQUEST_TIMEOUT"; message: string }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "FETCH_ERROR"; message: string }
  | { type: "UNKNOWN"; message: string; originalError?: unknown };

export type ApplicationError =
  | { type: "NOTION_ERROR"; error: NotionError }
  | { type: "VALIDATION_ERROR"; message: string }
  | { type: "NOT_FOUND"; message: string };

/**
 * Repository層のインターフェース定義
 */
export interface PaginationParams {
  startCursor?: string;
  pageSize?: number;
}

export interface NotionRepositoryInterface {
  getArticles(
    params: PaginationParams | null,
  ): Promise<Result<QueryDatabaseResponse, NotionError>>;
  getArticle(id: string): Promise<Result<PageObjectResponse, NotionError>>;
  fetchBlockWithChildren(
    blockId: string,
  ): Promise<Result<ListBlockChildrenResponse, NotionError>>;
}

/**
 * Service層のインターフェース定義
 */
export interface ArticleListResult {
  articles: Article[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ArticleServiceInterface {
  listArticles(
    params: PaginationParams | null,
  ): Promise<Result<ArticleListResult, ApplicationError>>;
  getArticleInfo(id: string): Promise<Result<Article, ApplicationError>>;
  getArticleWithContent(
    id: string,
    article?: Article | null,
  ): Promise<Result<Article, ApplicationError>>;
}

/**
 * Presenter層のインターフェース定義
 */
export interface ArticlePresenterInterface {
  convertToArticleInfo(notionPage: PageObjectResponse): Promise<Article>;
  convertToArticleList(
    response: QueryDatabaseResponse,
  ): Promise<ArticleListResult>;
  processArticleContent(
    content: ListBlockChildrenResponse,
    articleId: string,
  ): Promise<ListBlockChildrenResponse>;
}
