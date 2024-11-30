"use client";
import { FC, useEffect, useState } from "react";
import { Container, Skeleton, Text, Title, Image } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import Layout from "../_layout";
import { type NotionArticle } from "../../../types/notionArticle";
import { MdBlock } from "notion-to-md/build/types";
import { useSearchParams } from "next/navigation";

function convertContent(contentBlocks: MdBlock[]) {
  return contentBlocks
    .map((block, index) => {
      switch (block.type) {
        case "heading_1":
          return (
            <Title key={`h1-${index}`} order={1}>
              {block.parent}
            </Title>
          );
        case "heading_2":
          return (
            <Title key={`h2-${index}`} order={2}>
              {block.parent}
            </Title>
          );
        case "heading_3":
          return (
            <Title key={`h3-${index}`} order={3}>
              {block.parent}
            </Title>
          );
        case "paragraph":
          return <Text key={`p-${index}`}>{block.parent}</Text>;
        case "table_of_contents":
          return <div key={`toc-${index}`} />;
        case "image":
          return <img key={`img-${index}`} src={block.parent} alt="" />;
        // case "code":
        //   return <CodeHighlight key={`code-${index}`} language={block.code.language} code={block.code} />
        default:
          return null;
      }
    })
    .filter(Boolean);
}

const BlogContents: FC = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<NotionArticle | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const postParam = searchParams.get("post");
        if (postParam) {
          const postData = JSON.parse(postParam) as NotionArticle;
          setContent(postData);
          setLoading(false);
          return;
        }

        // クエリパラメータがない場合は従来通りAPIから取得
        console.log("Fetching contents...");
        const id = window.location.pathname.split("/").pop();
        console.debug("articleID:", id);

        const fetchedContent = await fetch(`/api/notion/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json());
        console.debug("Fetched content:", fetchedContent);
        setContent(fetchedContent);
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
      {!loading && content ? (
        <Container size="md" py="xl">
          <Skeleton height={50} mb="xl" />
          <Skeleton height={30} mb="md" />
          <Skeleton height={400} />
        </Container>
      ) : (
        <Title order={1}>{content?.title}</Title>
      )}
    </Layout>
  );
};

export default BlogContents;
