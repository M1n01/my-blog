import { isFullPage } from "@notionhq/client";
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { Article } from "../../types/notion/Article";
import type { Category } from "../../types/notion/Category";
import type { Tag } from "../../types/notion/Tag";
import { downloadImage, downloadThumbnail } from "./image-downloader";
import { ArticleListResult, ArticlePresenterInterface } from "./types";

// Notionのプロパティの型定義
interface NotionTitleProperty {
  type: "title";
  title: Array<{
    type: string;
    text?: {
      content: string;
    };
    plain_text: string;
  }>;
}

interface NotionRichTextProperty {
  type: "rich_text";
  rich_text: Array<{
    type: string;
    text?: {
      content: string;
    };
    plain_text: string;
  }>;
}

interface NotionDateProperty {
  type: "date";
  date: {
    start: string;
    end: string | null;
  } | null;
}

interface NotionSelectProperty {
  type: "select";
  select: {
    id: string;
    name: string;
    color: string;
  } | null;
}

interface NotionMultiSelectProperty {
  type: "multi_select";
  multi_select: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}

interface NotionNumberProperty {
  type: "number";
  number: number | null;
}

interface NotionCheckboxProperty {
  type: "checkbox";
  checkbox: boolean;
}

// Notionページのプロパティ型
interface NotionPageProperties {
  title?: NotionTitleProperty;
  description?: NotionRichTextProperty;
  publishedAt?: NotionDateProperty;
  category?: NotionSelectProperty;
  tags?: NotionMultiSelectProperty;
  likes?: NotionNumberProperty;
  noindex_nofollow?: NotionCheckboxProperty;
}

// Notionページの型 - PageObjectResponseを完全に拡張せず、必要なプロパティのみ型付けする
type NotionPage = {
  id: string;
  last_edited_time: string;
  properties: NotionPageProperties;
  cover:
    | {
        type: "external";
        external: { url: string };
      }
    | {
        type: "file";
        file: { url: string; expiry_time: string };
      }
    | null;
};

/**
 * Notionデータをアプリケーションモデルへ変換するプレゼンタークラス
 */
export class ArticlePresenter implements ArticlePresenterInterface {
  /**
   * NotionのページデータからArticleモデルへ変換する
   */
  async convertToArticleInfo(notionPage: PageObjectResponse): Promise<Article> {
    // PageObjectResponseをNotionPageとして扱う
    const page = notionPage as unknown as NotionPage;

    const thumbnail = await this.extractThumbnail(page);

    return {
      id: page.id,
      thumbnail,
      title: this.extractTitle(page),
      description: this.extractDescription(page),
      publishedAt: this.extractPublishedAt(page),
      updatedAt: page.last_edited_time,
      category: this.extractCategory(page),
      tags: this.extractTags(page),
      likes: this.extractLikes(page),
      noindex_nofollow: this.extractNoindexNofollow(page),
    };
  }

  /**
   * NotionのデータベースレスポンスからArticleのリストへ変換する
   */
  async convertToArticleList(
    response: QueryDatabaseResponse,
  ): Promise<ArticleListResult> {
    const articles: Article[] = await Promise.all(
      response.results
        .filter(isFullPage)
        .map((page) => this.convertToArticleInfo(page)),
    );

    return {
      articles,
      nextCursor: response.next_cursor,
      hasMore: response.has_more,
    };
  }

  /**
   * 記事のコンテンツ内の画像URLをローカルパスに置き換える
   */
  async processArticleContent(
    content: ListBlockChildrenResponse,
    articleId: string,
  ): Promise<ListBlockChildrenResponse> {
    const newBlocks = await this.processBlocks(content.results, articleId);

    return {
      ...content,
      results: newBlocks,
    };
  }

  private async processBlocks(
    blocks: (Partial<BlockObjectResponse> | BlockObjectResponse)[],
    articleId: string,
  ): Promise<BlockObjectResponse[]> {
    const processedBlocks = [];

    for (const block of blocks) {
      if (!("type" in block)) {
        processedBlocks.push(block as BlockObjectResponse); // 型アサーション
        continue;
      }

      let newBlock: BlockObjectResponse = block as BlockObjectResponse;

      // 画像ブロックの処理
      if (newBlock.type === "image" && newBlock.image.type === "file") {
        const imageUrl = newBlock.image.file.url;
        // 記事本文の画像用にWebP変換を有効にしてダウンロード
        const downloadResult = await downloadImage(imageUrl, articleId, {
          convertToWebP: true,
          quality: 80,
          width: 1200,
          height: 800,
        });

        if (downloadResult.isOk()) {
          const { caption } = newBlock.image;
          // @ts-ignore TODO: 型を正しくする
          newBlock = {
            ...newBlock,
            image: {
              caption,
              type: "external",
              external: {
                url: downloadResult.value,
              },
            },
          };
        } else {
          console.error(
            `Failed to download image in content for article ${articleId}:`,
            downloadResult.error,
          );
        }
      }

      // 子ブロックがある場合の再帰処理
      if ("children" in newBlock && newBlock.children) {
        // @ts-ignore
        const newChildren = await this.processBlocks(
          // @ts-ignore
          newBlock.children,
          articleId,
        );
        newBlock.children = newChildren;
      } else if (newBlock.has_children) {
        // fetchBlockWithChildrenで子要素が取得済みなので、このパスは通常通らないはず
        // 'children' in blockがfalseでもhas_childrenがtrueの場合のフォールバック
      }

      processedBlocks.push(newBlock);
    }
    return processedBlocks;
  }

  // 以下、プライベートヘルパーメソッド
  private async extractThumbnail(page: NotionPage): Promise<string> {
    const imageUrl =
      page.cover?.type === "external"
        ? page.cover.external.url
        : page.cover?.type === "file"
          ? page.cover.file.url
          : null;

    if (!imageUrl) {
      return "";
    }

    // fileタイプの画像（Notionにアップロードされた画像）のみダウンロード
    if (page.cover?.type === "file") {
      // サムネイル専用関数を使用してWebP変換
      const downloadResult = await downloadThumbnail(
        imageUrl,
        page.id
      );
      if (downloadResult.isOk()) {
        return downloadResult.value;
      } else {
        // エラーの場合は元のURLを返すか、空文字を返す
        console.error(
          `Failed to download thumbnail for article ${page.id}:`,
          downloadResult.error,
        );
        return imageUrl; // フォールバック
      }
    }

    // externalの画像はそのままURLを返す
    return imageUrl;
  }

  private extractTitle(page: NotionPage): string {
    if (
      page.properties.title?.type === "title" &&
      page.properties.title.title.length > 0
    ) {
      return page.properties.title.title[0].plain_text;
    }
    return "";
  }

  private extractDescription(page: NotionPage): string {
    if (
      page.properties.description?.type === "rich_text" &&
      page.properties.description.rich_text.length > 0
    ) {
      return page.properties.description.rich_text[0].plain_text;
    }
    return "";
  }

  private extractPublishedAt(page: NotionPage): string {
    if (
      page.properties.publishedAt?.type === "date" &&
      page.properties.publishedAt.date
    ) {
      return page.properties.publishedAt.date.start || "";
    }
    return "";
  }

  private extractCategory(page: NotionPage): Category {
    if (
      page.properties.category?.type === "select" &&
      page.properties.category.select
    ) {
      return {
        id: page.properties.category.select.id,
        name: page.properties.category.select.name,
        color: page.properties.category.select.color,
      };
    }
    return {
      id: "",
      name: "",
      color: "",
    };
  }

  private extractTags(page: NotionPage): Tag[] {
    if (page.properties.tags?.type === "multi_select") {
      return page.properties.tags.multi_select.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
      }));
    }
    return [];
  }

  private extractLikes(page: NotionPage): number {
    if (
      page.properties.likes?.type === "number" &&
      page.properties.likes.number !== null
    ) {
      return page.properties.likes.number;
    }
    return 0;
  }

  private extractNoindexNofollow(page: NotionPage): boolean {
    if (page.properties.noindex_nofollow?.type === "checkbox") {
      return page.properties.noindex_nofollow.checkbox;
    }
    return false;
  }
}
