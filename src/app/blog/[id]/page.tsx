"use client";
import React, { FC, useEffect, useState } from "react";
import {
  Container,
  Skeleton,
  Text,
  Title,
  Image,
  Stack,
  Anchor,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import Layout from "../_layout";
import { type Article } from "../../../types/notion/Article";
import { useSearchParams } from "next/navigation";
import { isFullBlock } from "@notionhq/client";

const renderRichText = (text: any) => {
  const props: Record<string, any> = {
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
      <Anchor href={text.href} target="_blank" {...props}>
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
        w="auto"
        fit="contain"
        radius="md"
        h={450}
        mb="md"
      />
      <Title order={1} mb="xs">
        {article.title}
      </Title>
      <Text mb="md">{article.description}</Text>
      <Stack gap="md">
        {article.content?.map((block, index) => {
          if (!isFullBlock(block)) return null;
          switch (block.type) {
            case "heading_1":
              return (
                <Title key={index} order={2} mb="md">
                  {block.heading_1.rich_text[0].plain_text}
                </Title>
              );
            case "heading_2":
              return (
                <Title key={index} order={3} mb="md">
                  {block.heading_2.rich_text[0].plain_text}
                </Title>
              );
            case "heading_3":
              return (
                <Title key={index} order={4} mb="md">
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
            default:
              return null;
          }
        })}
      </Stack>
    </Container>
  );
}

const BlogContents: FC = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // クエリパラメータがある場合はそれ��使う
        console.log("Fetching contents with query params...");
        const postParam = searchParams.get("post");
        let fetchedArticle: Article;
        if (postParam) {
          const postData = JSON.parse(postParam) as Article;
          fetchedArticle = await fetch(
            `/api/notion/${postData.id}?post=${postParam}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          ).then((res) => res.json());
        }
        // クエリパラメータがない場合は従来通りAPIから取得
        else {
          console.log("Fetching contents without query params...");
          const id = window.location.pathname.split("/").pop();
          console.debug("articleID:", id);

          fetchedArticle = await fetch(`/api/notion/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res.json());
        }

        console.info("Fetched content:", fetchedArticle);
        setContent(convertContent(fetchedArticle));
      } catch (error) {
        console.error("Failed to fetch contents:", error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [searchParams]);

  return (
    <Layout>
      {loading ? (
        <Container size="md" py="xl">
          <Skeleton height={450} mb="xl" />
          <Skeleton height={50} mb="xl" />
          <Skeleton height={30} mb="md" />
          <Skeleton height={300} mb="md" />
        </Container>
      ) : (
        content
      )}
    </Layout>
  );
};

export default BlogContents;
