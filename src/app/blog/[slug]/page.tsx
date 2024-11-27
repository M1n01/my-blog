"use client";
import { FC, useEffect, useState } from "react";
import {
  Container,
  Skeleton,
  Text,
  Title,
  Stack,
  Badge,
  Group,
} from "@mantine/core";
import { IconCalendar, IconTag } from "@tabler/icons-react";
import Layout from "../_layout";
import { type NotionArticle } from "../../../types/notionArticle";

const BlogPost: FC = () => {
  const [post, setPost] = useState<NotionArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("Fetching post...");
        const id = window.location.pathname.split("/").pop();
        console.log("articleID:", id);
        const fetchedPost = await fetch(`/api/notion/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => data.results[0]);
        console.log("Fetched post:", fetchedPost);
        setPost({
          id: fetchedPost.id,
          title: fetchedPost.properties.title.title[0].plain_text,
          description:
            fetchedPost.properties.description.rich_text[0].plain_text,
          slug: fetchedPost.properties.slug.rich_text[0].plain_text,
          publishedAt: fetchedPost.properties.publishedAt.date.start,
          tags: fetchedPost.properties.tags.multi_select.map((tag: any) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          })),
          content: fetchedPost.properties.content.rich_text[0].plain_text,
        });
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  });

  if (loading)
    return (
      <Layout>
        <Container size="md" py="xl">
          <Skeleton height={50} mb="xl" />
          <Skeleton height={30} mb="md" />
          <Skeleton height={400} />
        </Container>
      </Layout>
    );

  if (!post)
    return (
      <Layout>
        <Container size="md" py="xl">
          <Title order={1}>Post not found</Title>
          <Text>The requested post could not be found.</Text>
        </Container>
      </Layout>
    );

  return (
    <Layout>
      <Container size="md" py="xl">
        <Stack gap="xl">
          <div>
            <Title order={1} mb="md">
              {post.title}
            </Title>

            <Group mb="xl">
              <Badge leftSection={<IconCalendar size={14} />} variant="light">
                {new Date(post.publishedAt).toLocaleDateString()}
              </Badge>
              {post.tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  leftSection={<IconTag size={14} />}
                  variant="outline"
                >
                  {tag.name}
                </Badge>
              ))}
            </Group>

            {post.description && (
              <Text size="lg" c="dimmed" mb="xl">
                {post.description}
              </Text>
            )}
          </div>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Stack>
      </Container>
    </Layout>
  );
};

export default BlogPost;
