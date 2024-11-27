"use client";
import { FC, useEffect, useState } from "react";
import {
  Anchor,
  Container,
  Title,
  Card,
  Text,
  Grid,
  Skeleton,
  Badge,
  Group,
  Pagination,
  GridCol,
} from "@mantine/core";

import Layout from "./_layout";
import { type NotionPost } from "../../types/notionPost";

const BlogList: FC = () => {
  const [posts, setPosts] = useState<NotionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching posts...");
        const fetchedPosts = await fetch("/api/notion", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => data.results);
        const articles = fetchedPosts.map((post: any) => {
          return {
            id: post.id,
            title: post.properties.title.title[0].plain_text,
            description: post.properties.description.rich_text[0].plain_text,
            slug: post.properties.slug.rich_text[0].plain_text,
            publishedAt: post.properties.publishedAt.date.start,
            tag: post.properties.tags.multi_select.map((tag: any) => ({
              id: tag.id,
              name: tag.name,
              color: tag.color,
            })),
          };
        });
        console.log("Fetched posts:", articles);
        setPosts(articles);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]); // エラー時は空配列を設定
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
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
                  <Anchor href={`/blog/${post.id}`}>
                    <Card shadow="xs" padding="xl">
                      <Title order={3}>{post.title}</Title>
                      <Text>{post.description}</Text>
                      <Group mt="md">
                        {post.tags?.map((tag) => (
                          <Badge
                            key={`${post.id}-${tag.id}`}
                            color="teal"
                            variant="light"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </Group>
                    </Card>
                  </Anchor>
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
