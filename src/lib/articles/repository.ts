import { Client, isFullPage } from "@notionhq/client";
import {
  isNotionClientError,
  ClientErrorCode,
  APIErrorCode,
} from "@notionhq/client/build/src/errors";
import {
  QueryDatabaseResponse,
  PageObjectResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Result, ok, err } from "neverthrow";
import {
  NotionError,
  NotionRepositoryInterface,
  PaginationParams,
} from "./types";

/**
 * Notion APIと通信するリポジトリクラス
 */
export class NotionRepository implements NotionRepositoryInterface {
  private client: Client;
  private databaseId: string | undefined;

  constructor(authToken?: string, databaseId?: string) {
    this.client = new Client({
      auth: authToken || process.env.NEXT_PUBLIC_NOTION_TOKEN,
    });
    this.databaseId = databaseId || process.env.NEXT_PUBLIC_DATABASE_ID;
  }

  /**
   * Notionデータベースから記事リストを取得する
   */
  async getArticles(
    params: PaginationParams | null,
  ): Promise<Result<QueryDatabaseResponse, NotionError>> {
    // paramsがnullの場合は、全てのページを取得する
    if (!params) {
      const all = await this.client.databases.query({
        database_id: this.databaseId!,
        filter: {
          property: "publishedAt",
          date: {
            is_not_empty: true,
          },
        },
        sorts: [
          {
            property: "publishedAt",
            direction: "descending",
          },
        ],
      });
      return ok(all);
    }

    const { startCursor, pageSize = 9 } = params;

    if (!this.databaseId) {
      return err({
        type: "OBJECT_NOT_FOUND",
        message:
          "NEXT_PUBLIC_DATABASE_ID is not defined in environment variables",
      });
    }

    try {
      const response = await this.client.databases.query({
        database_id: this.databaseId,
        start_cursor: startCursor,
        page_size: pageSize,
        filter: {
          property: "publishedAt",
          date: {
            is_not_empty: true,
          },
        },
        sorts: [
          {
            property: "publishedAt",
            direction: "descending",
          },
        ],
      });
      return ok(response);
    } catch (error: unknown) {
      return this.handleNotionError(error);
    }
  }

  /**
   * Notionから特定の記事ページを取得する
   */
  async getArticle(
    id: string,
  ): Promise<Result<PageObjectResponse, NotionError>> {
    try {
      const response = await this.client.pages.retrieve({
        page_id: id,
      });

      if (!isFullPage(response)) {
        return err({
          type: "VALIDATION_ERROR",
          message: "Retrieved page is not a full page",
        });
      }

      return ok(response as PageObjectResponse);
    } catch (error: unknown) {
      return this.handleNotionError(error);
    }
  }

  /**
   * 特定の記事のブロックコンテンツを取得する
   */
  async getArticleBlocks(
    id: string,
  ): Promise<Result<ListBlockChildrenResponse, NotionError>> {
    try {
      const response = await this.client.blocks.children.list({
        block_id: id,
      });
      return ok(response);
    } catch (error: unknown) {
      return this.handleNotionError(error);
    }
  }

  /**
   * Notion APIのエラーをハンドリングする
   */
  private handleNotionError(error: unknown): Result<never, NotionError> {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          return err({
            type: "REQUEST_TIMEOUT",
            message:
              "Notion APIの認証に失敗しました。環境変数NEXT_PUBLIC_NOTION_TOKENが正しく設定されているか確認してください。",
          });
        case APIErrorCode.ObjectNotFound:
          return err({
            type: "OBJECT_NOT_FOUND",
            message:
              "Notion APIのデータベースが見つかりませんでした。環境変数NEXT_PUBLIC_DATABASE_IDが正しく設定されているか確認してください。",
          });
        case APIErrorCode.Unauthorized:
          return err({
            type: "UNAUTHORIZED",
            message:
              "Notion APIの認証に失敗しました。環境変数NEXT_PUBLIC_NOTION_TOKENが正しく設定されているか確認してください。",
          });
        default:
          return err({
            type: "UNKNOWN",
            message: "Notion APIのリクエストに失敗しました。",
            originalError: error,
          });
      }
    }
    return err({
      type: "UNKNOWN",
      message: "Notion APIのリクエストに失敗しました。",
      originalError: error,
    });
  }
}
