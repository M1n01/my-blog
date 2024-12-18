import React, { Suspense } from "react";
import { Container, Text, Title, Image, Stack, Anchor } from "@mantine/core";
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
  console.log("Converting content:", article);
  return (
    <Container size="md" py="xl">
      <Image
        src={article.thumbnail}
        alt={article.title}
        radius="md"
        h={300}
        mb="md"
      />
      <Title order={1} mb="md">
        {article.title}
      </Title>
      <Text mb="lg">{article.description}</Text>
      <Stack gap="xs">
        {article.content?.map((block, index) => {
          if (!isFullBlock(block)) return null;
          switch (block.type) {
            case "heading_1":
              return (
                <Title key={index} order={2} mb="xs">
                  {block.heading_1.rich_text[0].plain_text}
                </Title>
              );
            case "heading_2":
              return (
                <Title key={index} order={3} mb="xs">
                  {block.heading_2.rich_text[0].plain_text}
                </Title>
              );
            case "heading_3":
              return (
                <Title key={index} order={4} mb="xs">
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
                  h={450}
                  mb="md"
                />
              );
            case "bulleted_list_item":
              return null;
            case "numbered_list_item":
              return null;
            case "quote":
              return null;
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
