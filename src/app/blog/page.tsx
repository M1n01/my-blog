"use client";
import { FC, useEffect, useState } from "react";
import {
  Container,
  Title,
  Grid,
  Skeleton,
  Group,
  Pagination,
  GridCol,
} from "@mantine/core";
import { BadgeCard } from "../../components/BadgeCard";

import Layout from "./_layout";
import { type NotionArticle } from "../../types/notionArticle";

const BlogList: FC = () => {
  const [posts, setPosts] = useState<NotionArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log("Fetching posts...");
        const fetchedArticles = await fetch("/api/notion", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => data.results);
        const articles = fetchedArticles.map((post: any) => {
          return {
            id: post.id,
            title: post.properties.title.title[0].plain_text,
            description: post.properties.description.rich_text[0].plain_text,
            slug: post.properties.slug.rich_text[0].plain_text,
            publishedAt: post.properties.publishedAt.date.start,
            tags: post.properties.tags.multi_select.map((tag: any) => ({
              id: tag.id,
              name: tag.name,
              color: tag.color,
            })),
          };
        });
        console.log("Fetched articles:", articles);
        setPosts(articles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setPosts([]); // エラー時は空配列を設定
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const paginatedPosts = posts.slice(
    (activePage - 1) * postsPerPage,
    activePage * postsPerPage,
  );

  return (
    <Layout>
      <Container size="lg" py="xl">
        <Title order={1}>Blog</Title>
        <Grid>
          {loading
            ? Array(3)
                .fill(0)
                .map((_, index) => (
                  <GridCol
                    key={`skeleton-${index}`}
                    span={{ base: 12, sm: 6, md: 4 }}
                  >
                    <Skeleton height={200} radius="md" mb="xl" />
                  </GridCol>
                ))
            : posts.map((post) => (
                <GridCol key={post.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <BadgeCard post={post} />
                </GridCol>
              ))}
        </Grid>

        {!loading && Math.ceil(posts.length / postsPerPage) > 1 && (
          <Group justify="center" mt="xl">
            <Pagination
              value={activePage}
              onChange={setActivePage}
              total={Math.ceil(posts.length / postsPerPage)}
            />
          </Group>
        )}
      </Container>
    </Layout>
  );
};

export default BlogList;
