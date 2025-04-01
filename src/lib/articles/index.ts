import { NotionRepository } from "./repository";
import { ArticlePresenter } from "./presenter";
import { ArticleService } from "./service";
import type {
  ArticleListResult,
  ArticleServiceInterface,
  NotionRepositoryInterface,
  PaginationParams,
} from "./types";
import type { Article } from "../../types/notion/Article";

/**
 * 記事サービスのインスタンスを作成するファクトリー関数
 * 依存性の注入を行い、適切にサービスを構成する
 */
export function createArticleService(
  notionToken?: string,
  databaseId?: string,
): ArticleServiceInterface {
  // 依存関係を構築
  const repository: NotionRepositoryInterface = new NotionRepository(
    notionToken,
    databaseId,
  );
  const presenter = new ArticlePresenter();

  // サービスを作成して返却
  return new ArticleService(repository, presenter);
}

// 便利なユーティリティ関数
export async function getAllArticles(
  startCursor?: string,
  pageSize?: number,
): Promise<ArticleListResult> {
  const service = createArticleService();
  const result = await service.listArticles({ startCursor, pageSize });

  if (result.isErr()) {
    throw new Error(`Failed to get articles: ${JSON.stringify(result.error)}`);
  }

  return result.value;
}

export async function getArticle(id: string): Promise<Article> {
  const service = createArticleService();
  const result = await service.getArticle(id);

  if (result.isErr()) {
    throw new Error(`Failed to get article: ${JSON.stringify(result.error)}`);
  }

  return result.value;
}

export async function getArticleContent(
  id: string,
  article?: Article | null,
): Promise<Article> {
  const service = createArticleService();
  const result = await service.getArticleWithContent(id, article);

  if (result.isErr()) {
    throw new Error(
      `Failed to get article content: ${JSON.stringify(result.error)}`,
    );
  }

  return result.value;
}

// 型定義のエクスポート
export type { PaginationParams, ArticleListResult, ArticleServiceInterface };
