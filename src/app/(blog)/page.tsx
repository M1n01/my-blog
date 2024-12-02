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
import { BadgeCard } from "@/components/blog/BadgeCard";

import Layout from "./_layout";
import { type Article } from "../../types/notion/Article";

const BlogList: FC = () => {
  const [posts, setPosts] = useState<Article[]>([]);
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
        }).then((res) => res.json());
        console.debug("fetchedArticles:", fetchedArticles);

        setPosts(fetchedArticles);
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
