import React, { Suspense } from "react";
import {
  Container,
  Text,
  Title,
  Image,
  Stack,
  Badge,
  Group,
  Divider,
  Box,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconRefresh,
  IconCategory,
  IconTags,
} from "@tabler/icons-react";
import { type Article } from "../../../types/notion/Article";
import {
  BlockObjectResponse,
  ParagraphBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Metadata } from "next";

import LoadingContent from "./loading";
import { getArticleContent } from "@/lib/notion";
import { renderBlocks } from "@/lib/blocks";
import { ShareButtons } from "@/components/common/ShareButtons";

export const runtime = "edge";

// 動的メタデータを生成する関数
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // IDからスラッグを取得
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  try {
    // 記事データを取得
    const article = await getArticleContent(slug, null);

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
        url: canonicalUrl, // og:urlを追加
        images: [
          {
            url: article.thumbnail || "/assets/avatar.jpg", // デフォルト画像をフォールバックとして使用
            width: 1200,
            height: 630,
            alt: article.title,
          },
        ],
        type: "article",
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt,
        // 記事のカテゴリとタグを追加
        tags: article.tags.map((tag) => tag.name),
        // articlesは配列として定義されているのでsectionとしてカテゴリを設定
        section: article.category.name,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: description || article.title,
        images: [article.thumbnail || "/assets/avatar.jpg"],
      },
      // noindex_nofollow が true の場合、robots に noindex, nofollow を設定
      robots: article.noindex_nofollow
        ? {
            index: false,
            follow: false,
          }
        : undefined,
      // 正規URLを設定
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    console.error("メタデータの生成に失敗しました:", error);
    // エラー時のフォールバックメタデータ
    return {
      title: "記事",
      description: "ブログ記事",
    };
  }
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
    <Container size="md" py="xl">
      <Image
        src={article.thumbnail}
        alt={article.title}
        radius="md"
        mah={350}
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

      {/* SNSシェアボタン */}
      <Divider my="xl" />
      <ShareButtons
        url={articleUrl}
        title={article.title}
        description={article.description || ""}
      />
    </Container>
  );
}

export default async function BlogContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ post: string }>;
}) {
  const slug = (await params).id;
  const { post: postParam } = await searchParams;
  let fetchedArticle: Article;

  // 一覧ページから流入した場合
  if (postParam) {
    const postData = JSON.parse(
      Array.isArray(postParam) ? postParam[0] : postParam,
    ) as Article;
    fetchedArticle = await getArticleContent(slug, postData);
  }
  // クエリパラメータがない場合は従来通りAPIから取得
  else {
    fetchedArticle = await getArticleContent(slug, null);
  }

  return (
    <Suspense fallback={<LoadingContent />}>
      {convertContent(fetchedArticle)}
    </Suspense>
  );
}
