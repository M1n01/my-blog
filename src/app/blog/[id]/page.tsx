"use client";
import { FC, useEffect, useState } from "react";
import { Container, Skeleton, Text, Title, Image } from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import Layout from "../_layout";
import { type ArticleInfo } from "../../../types/notion/ArticleInfo";
import { type Article } from "../../../types/notion/Article";
import { useSearchParams } from "next/navigation";

function convertContent(article: Article): React.ReactNode {
  console.log("Converting content:", article);
  return <Title>{article.info?.title}</Title>;
}

const BlogContents: FC = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // クエリパラメータがある場合はそれを使う
        console.log("Fetching contents with query params...");
        const postParam = searchParams.get("post");
        let fetchedArticle: Article;
        if (postParam) {
          const postData = JSON.parse(postParam) as ArticleInfo;
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
          <Skeleton height={50} mb="xl" />
          <Skeleton height={30} mb="md" />
          <Skeleton height={400} />
        </Container>
      ) : (
        content
      )}
    </Layout>
  );
};

export default BlogContents;
