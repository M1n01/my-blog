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
      const articlesResult = await this.presenter.convertToArticleList(
        result.value,
      );
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
  async getArticleInfo(id: string): Promise<Result<Article, ApplicationError>> {
    const result = await this.repository.getArticle(id);

    if (result.isErr()) {
      return err({
        type: "NOTION_ERROR",
        error: result.error,
      });
    }

    try {
      const article = await this.presenter.convertToArticleInfo(result.value);
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
    articleId: string,
    article?: Article | null,
  ): Promise<Result<Article, ApplicationError>> {
    // 記事データがなければ取得
    let articleData = article;
    if (!articleData) {
      const articleInfoResult = await this.getArticleInfo(articleId);
      if (articleInfoResult.isErr()) {
        return articleInfoResult;
      }
      articleData = articleInfoResult.value;
    }

    // 記事のコンテンツを取得
    const blocksResult =
      await this.repository.fetchBlockWithChildren(articleId);

    if (blocksResult.isErr()) {
      return err({
        type: "NOTION_ERROR",
        error: blocksResult.error,
      });
    }

    // コンテンツ内の画像をダウンロードしてURLを置き換え
    const processedBlocksResult = await this.presenter.processArticleContent(
      blocksResult.value,
      articleId,
    );

    // コンテンツを記事に追加
    return ok({
      ...articleData,
      content: processedBlocksResult.results,
    });
  }
}
