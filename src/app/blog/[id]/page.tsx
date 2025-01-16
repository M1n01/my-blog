import React, { Suspense } from "react";
import {
  Container,
  Text,
  Title,
  Image,
  Stack,
  Anchor,
  Blockquote,
  Badge,
  Group,
} from "@mantine/core";
import {
  IconCalendarTime,
  IconRefresh,
  IconCategory,
  IconTags,
} from "@tabler/icons-react";
import { CodeHighlight } from "@mantine/code-highlight";
import { type Article } from "../../../types/notion/Article";
import { isFullBlock } from "@notionhq/client";
import { type RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import LoadingContent from "./loading";
import { getArticleContent } from "@/lib/notion";

export const runtime = "edge";

type TextProps = {
  component: "span";
  fw?: 400 | 700;
  fs?: "italic" | "normal";
  td?: "line-through" | "underline" | "none";
  ff?: "monospace";
  c?: string;
};

const renderRichText = (text: RichTextItemResponse) => {
  const props: TextProps = {
    component: "span",
    fw: text.annotations.bold ? 700 : 400,
    fs: text.annotations.italic ? "italic" : "normal",
    td: text.annotations.strikethrough
      ? "line-through"
      : text.annotations.underline
        ? "underline"
        : "none",
    ff: text.annotations.code ? "monospace" : undefined,
    c:
      text.annotations.color !== "default" ? text.annotations.color : undefined,
  };

  if (text.href) {
    return (
      <Anchor
        href={text.href}
        target="_blank"
        fw={props.fw}
        fs={props.fs}
        td={props.td}
        ff={props.ff}
        c={props.c}
      >
        {text.plain_text}
      </Anchor>
    );
  }

  return <Text {...props}>{text.plain_text}</Text>;
};

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
      <Stack gap="xs">
        {article.content?.map((block, index) => {
          if (!isFullBlock(block)) return null;
          switch (block.type) {
            case "heading_1":
              return (
                <Title key={index} order={2} mb="xs" mt="lg">
                  {block.heading_1.rich_text[0].plain_text}
                </Title>
              );
            case "heading_2":
              return (
                <Title key={index} order={3} mb="xs" mt="lg" td="underline">
                  {block.heading_2.rich_text[0].plain_text}
                </Title>
              );
            case "heading_3":
              return (
                <Title key={index} order={4} mb="xs" mt="lg">
                  {block.heading_3.rich_text[0].plain_text}
                </Title>
              );
            case "paragraph":
              return (
                <Text key={index}>
                  {block.paragraph.rich_text.map((text, i) => (
                    <React.Fragment key={i}>
                      {renderRichText(text)}
                    </React.Fragment>
                  ))}
                </Text>
              );
            case "code":
              return (
                <CodeHighlight
                  key={index}
                  code={block.code.rich_text
                    .map((text) => text.plain_text)
                    .join("")}
                  copyLabel="Copy button code"
                  copiedLabel="Copied!"
                  language={block.code.language}
                  mb="md"
                />
              );
            case "image":
              return (
                <Image
                  key={index}
                  src={
                    block.image.type === "external"
                      ? block.image.external.url
                      : block.image.file.url
                  }
                  alt={block.image.caption
                    .map((text) => text.plain_text)
                    .join(" ")}
                  w="auto"
                  fit="contain"
                  radius="md"
                  mah={300}
                  mb="md"
                />
              );
            case "bulleted_list_item":
              return null;
            case "numbered_list_item":
              return null;
            case "quote":
              return (
                <Blockquote key={index} color="violet">
                  {block.quote.rich_text.map((text) => text.plain_text)}
                </Blockquote>
              );
            case "embed":
              return null;
            default:
              return null;
          }
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
