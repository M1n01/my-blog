"use client";
import { FC, useEffect, useState } from "react";
import {
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
        const fetchedPosts = await fetch("/api/notion", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => data.results);
        setPosts(fetchedPosts);
        console.log("fetchedPosts", fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setPosts([]); // エラー時は空配列を設定
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  console.log("posts", posts);

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
                  <GridCol key={index} span={{ base: 12, sm: 6, md: 4 }}>
                    <Skeleton height={200} radius="md" mb="xl" />
                  </GridCol>
                ))
            : paginatedPosts.map((post) => (
                <GridCol key={post.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <Card key={post.slug} shadow="xs" padding="xl">
                    <Title order={3}>{post.title}</Title>
                    <Text>{post.description}</Text>
                    <Group mt="md">
                      {post.tags?.map((tag) => (
                        <Badge key={tag} color="teal" variant="light">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </Card>
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
