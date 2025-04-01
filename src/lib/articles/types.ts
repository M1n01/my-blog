import { Result } from "neverthrow";
import {
  QueryDatabaseResponse,
  PageObjectResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Article } from "../../types/notion/Article";

/**
 * エラー型の定義
 */
export type NotionError =
  | { type: "UNAUTHORIZED"; message: string }
  | { type: "OBJECT_NOT_FOUND"; message: string }
  | { type: "REQUEST_TIMEOUT"; message: string }
  | { type: "VALIDATION_ERROR"; message: string }
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
  getArticleBlocks(
    id: string,
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
  getArticle(id: string): Promise<Result<Article, ApplicationError>>;
  getArticleWithContent(
    id: string,
    article?: Article | null,
  ): Promise<Result<Article, ApplicationError>>;
}

/**
 * Presenter層のインターフェース定義
 */
export interface ArticlePresenterInterface {
  convertToArticle(notionPage: PageObjectResponse): Article;
  convertToArticleList(response: QueryDatabaseResponse): ArticleListResult;
}
