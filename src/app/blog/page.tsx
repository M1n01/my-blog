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
import { getAllPosts } from "../../lib/notion/notion";

const BlogList: FC = () => {
  const [posts, setPosts] = useState<NotionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
      setLoading(false);
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
