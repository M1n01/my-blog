import { ArticleServiceInterface } from "./types";
import { createArticleService } from "./";

let articleServiceInstance: ArticleServiceInterface | null = null;

/**
 * ArticleServiceのシングルトンインスタンスを取得する
 * @throws Error 環境変数が設定されていない場合
 */
export function getArticleService(): ArticleServiceInterface {
  if (
    !process.env.NEXT_PUBLIC_NOTION_TOKEN ||
    !process.env.NEXT_PUBLIC_DATABASE_ID
  ) {
    throw new Error(
      "環境変数 NEXT_PUBLIC_NOTION_TOKEN または NEXT_PUBLIC_DATABASE_ID が設定されていません",
    );
  }

  if (!articleServiceInstance) {
    articleServiceInstance = createArticleService(
      process.env.NEXT_PUBLIC_NOTION_TOKEN,
      process.env.NEXT_PUBLIC_DATABASE_ID,
    );
  }

  return articleServiceInstance;
}

/**
 * テスト用: ArticleServiceのインスタンスをリセットする
 */
export function resetArticleService(): void {
  articleServiceInstance = null;
}

/**
 * テスト用: ArticleServiceのモックを設定する
 */
export function setMockArticleService(mock: ArticleServiceInterface): void {
  articleServiceInstance = mock;
}
