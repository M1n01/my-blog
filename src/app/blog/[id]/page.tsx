import { LikeButton } from "@/components/article/LikeButton";
import { ShareButtons } from "@/components/article/ShareButtons";
import { SupportButton } from "@/components/article/SupportButton";
import { getArticleService } from "@/lib/articles/singleton";
import { renderBlocks } from "@/lib/blocks";
import {
  Alert,
  Badge,
  Box,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  BlockObjectResponse,
  ParagraphBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import {
  IconCalendarTime,
  IconCategory,
  IconRefresh,
  IconTags,
} from "@tabler/icons-react";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { type Article } from "../../../types/notion/Article";
import LoadingContent from "./loading";

// Edge runtime disabled for static export compatibility

export async function generateStaticParams() {
  const articleService = getArticleService();

  // 全記事のリストを取得してIDを返す
  const result = await articleService.listArticles(null);

  if (result.isErr()) {
    console.error("Failed to generate static params:", result.error);
    return [];
  }

  return result.value.articles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;
  const articleService = getArticleService();

  // 記事データを取得
  const result = await articleService.getArticleWithContent(slug, null);

  // エラーの場合はデフォルトのメタデータを返す
  if (result.isErr()) {
    console.error("メタデータの生成に失敗しました:", result.error);
    return {
      title: "記事",
      description: "ブログ記事",
    };
  }

  const article = result.value;
  // 記事の最初の150文字を説明文として使用
  let description = "";
  if (article.content) {
    const textBlocks = article.content.filter(
      (block): block is ParagraphBlockObjectResponse =>
        "type" in block &&
        block.type === "paragraph" &&
        block.paragraph?.rich_text?.length > 0,
    );

    if (textBlocks.length > 0) {
      const firstBlock = textBlocks[0];
      description = firstBlock.paragraph.rich_text
        .map((text: { plain_text: string }) => text.plain_text)
        .join("")
        .slice(0, 150);

      if (description.length === 150) {
        description += "...";
      }
    }
  }

  // 現在のURLを生成
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const canonicalUrl = `${baseUrl}/blog/${slug}`;

  return {
    title: article.title,
    description: description || article.title,
    openGraph: {
      title: article.title,
      description: description || article.title,
      url: canonicalUrl,
      images: [
        {
          url: article.thumbnail || "/assets/avatar.jpg",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.tags.map((tag) => tag.name),
      section: article.category.name,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description || article.title,
      images: [article.thumbnail || "/assets/avatar.jpg"],
    },
    robots: article.noindex_nofollow
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

function convertContent(article: Article): React.ReactNode {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    "ja-JP",
  );
  const updatedDate = new Date(article.updatedAt).toLocaleDateString("ja-JP");
  const isUpdated = article.publishedAt < article.updatedAt;

  // 現在のURLを取得（クライアントサイドで実行される部分用）
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const articleUrl = `${baseUrl}/blog/${article.id}`;

  return (
    <>
      <Image
        src={article.thumbnail}
        alt={article.title}
        radius="md"
        mah={360}
        mb="md"
      />
      <Title order={1} mb="md">
        {article.title}
      </Title>
      <Stack mb="lg">
        <Group gap="xs">
          <Text size="sm">
            <IconCalendarTime size={20} /> 公開日 {publishedDate}
            {isUpdated && (
              <>
                {" "}
                / <IconRefresh size={20} /> 更新日 {updatedDate}
              </>
            )}
          </Text>
        </Group>
        <Group gap="xs">
          <Text size="sm">
            <IconCategory size={20} /> カテゴリー
          </Text>
          <Badge color="violet" variant="filled">
            {article.category.name}
          </Badge>
        </Group>
        {article.tags.length > 0 && (
          <Group gap="xs">
            <Text size="sm">
              <IconTags size={20} /> タグ
            </Text>
            {article.tags.map((tag) => (
              <Badge key={tag.id} color={tag.color} variant="filled">
                {tag.name}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
      {/* コンテンツ - article-contentクラスを追加 */}
      <Box className="article-content">
        <Stack gap="xs">
          {article.content &&
            renderBlocks(
              article.content.filter(
                (block): block is BlockObjectResponse =>
                  "type" in block && block.type !== undefined,
              ),
            )}
        </Stack>
      </Box>

      <Divider my="xl" />
      <LikeButton articleId={article.id} />

      {/* SNSシェアボタン */}
      <Divider my="xl" />
      <ShareButtons
        url={articleUrl}
        title={article.title}
        description={article.description || ""}
      />

      <Divider my="xl" />
      <SupportButton />
    </>
  );
}

export default async function BlogContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const slug = (await params).id;
  const articleService = getArticleService();

  // 静的生成の場合は常にAPIから取得
  const articleResult = await articleService.getArticleWithContent(slug, null);

  if (articleResult.isErr()) {
    return (
      <Alert color="red" title="エラーが発生しました">
        {articleResult.error.type === "NOTION_ERROR"
          ? articleResult.error.error.message
          : articleResult.error.message}
      </Alert>
    );
  }

  return (
    <Suspense fallback={<LoadingContent />}>
      {convertContent(articleResult.value)}
    </Suspense>
  );
}
