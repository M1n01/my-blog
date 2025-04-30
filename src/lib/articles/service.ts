import { Result, err, ok } from "neverthrow";
import type { Article } from "../../types/notion/Article";
import {
  ApplicationError,
  ArticleListResult,
  ArticlePresenterInterface,
  ArticleServiceInterface,
  NotionRepositoryInterface,
  PaginationParams,
} from "./types";

/**
 * 記事関連のビジネスロジックを担当するサービスクラス
 */
export class ArticleService implements ArticleServiceInterface {
  constructor(
    private repository: NotionRepositoryInterface,
    private presenter: ArticlePresenterInterface,
  ) {}

  /**
   * 記事のリストを取得する
   */
  async listArticles(
    params: PaginationParams | null,
  ): Promise<Result<ArticleListResult, ApplicationError>> {
    const result = await this.repository.getArticles(params);

    if (result.isErr()) {
      return err({
        type: "NOTION_ERROR",
        error: result.error,
      });
    }

    try {
      const articlesResult = this.presenter.convertToArticleList(result.value);
      return ok(articlesResult);
    } catch (error) {
      return err({
        type: "VALIDATION_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to convert article list",
      });
    }
  }

  /**
   * 単一の記事コンテンツを取得する
   */
  async getContent(id: string): Promise<Result<Article, ApplicationError>> {
    const result = await this.repository.getArticle(id);

    if (result.isErr()) {
      return err({
        type: "NOTION_ERROR",
        error: result.error,
      });
    }

    try {
      const article = this.presenter.convertToArticle(result.value);
      return ok(article);
    } catch (error) {
      return err({
        type: "VALIDATION_ERROR",
        message:
          error instanceof Error ? error.message : "Failed to convert article",
      });
    }
  }

  /**
   * コンテンツ付きの記事を取得する
   */
  async getArticleWithContent(
    id: string,
    article?: Article | null,
  ): Promise<Result<Article, ApplicationError>> {
    // 記事データがなければ取得
    let articleData = article;
    if (!articleData) {
      const articleResult = await this.getContent(id);
      if (articleResult.isErr()) {
        return articleResult;
      }
      articleData = articleResult.value;
    }

    // 記事のコンテンツを取得
    const blocksResult = await this.repository.getArticleBlocks(id);

    if (blocksResult.isErr()) {
      return err({
        type: "NOTION_ERROR",
        error: blocksResult.error,
      });
    }

    // コンテンツを記事に追加
    return ok({
      ...articleData,
      content: blocksResult.value.results,
    });
  }
}
