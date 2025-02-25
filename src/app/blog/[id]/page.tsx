import React, { Suspense } from "react";
import {
  Container,
  Text,
  Title,
  Image,
  Stack,
  Badge,
  Group,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconRefresh,
  IconCategory,
  IconTags,
} from "@tabler/icons-react";
import { type Article } from "../../../types/notion/Article";

import LoadingContent from "./loading";
import { getArticleContent } from "@/lib/notion";
import { blockToJsx } from "@/lib/blocks";

export const runtime = "edge";

function convertContent(article: Article): React.ReactNode {
  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    "ja-JP",
  );
  const updatedDate = new Date(article.updatedAt).toLocaleDateString("ja-JP");
  const isUpdated = article.publishedAt < article.updatedAt;

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
      {/* コンテンツ */}
      <Stack gap="xs">
        {article.content?.map((block, index) => {
          return blockToJsx(block, index);
        })}
      </Stack>
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
