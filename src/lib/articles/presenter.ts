import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { isFullPage } from "@notionhq/client";
import type { Article } from "../../types/notion/Article";
import type { Category } from "../../types/notion/Category";
import type { Tag } from "../../types/notion/Tag";
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
  convertToArticle(notionPage: PageObjectResponse): Article {
    // PageObjectResponseをNotionPageとして扱う
    const page = notionPage as unknown as NotionPage;

    return {
      id: page.id,
      thumbnail: this.extractThumbnail(page),
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
  convertToArticleList(response: QueryDatabaseResponse): ArticleListResult {
    const articles: Article[] = response.results
      .filter(isFullPage)
      .map((page) => this.convertToArticle(page));

    return {
      articles,
      nextCursor: response.next_cursor,
      hasMore: response.has_more,
    };
  }

  // 以下、プライベートヘルパーメソッド
  private extractThumbnail(page: NotionPage): string {
    if (page.cover?.type === "external") {
      return page.cover.external.url;
    } else if (page.cover?.type === "file") {
      return page.cover.file.url;
    }
    return "";
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
