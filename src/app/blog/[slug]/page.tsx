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
import { MdBlock } from "notion-to-md/build/types";

const BlogContents: FC = () => {
  const [contents, setContents] = useState<MdBlock[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchcontents = async () => {
      try {
        console.log("Fetching contents...");
        const id = window.location.pathname.split("/").pop();
        console.log("articleID:", id);
        const fetchedcontents = await fetch(`/api/notion/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => data.results[0]);
        console.log("Fetched contents:", fetchedcontents);
        setContents({});
      } catch (error) {
        console.error("Failed to fetch contents:", error);
        setContents(null);
      } finally {
        setLoading(false);
      }
    };

    fetchcontents();
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

  if (!contents)
    return (
      <Layout>
        <Container size="md" py="xl">
          <Title order={1}>contents not found</Title>
          <Text>The requested contents could not be found.</Text>
        </Container>
      </Layout>
    );

  return (
    <Layout>
      <Container size="md" py="xl">
        <Stack gap="xl">
          <div>
            <Title order={1} mb="md">
              {contents.title}
            </Title>

            <Group mb="xl">
              <Badge leftSection={<IconCalendar size={14} />} variant="light">
                {new Date(contents.publishedAt).toLocaleDateString()}
              </Badge>
              {contents.tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  leftSection={<IconTag size={14} />}
                  variant="outline"
                >
                  {tag.name}
                </Badge>
              ))}
            </Group>

            {contents.description && (
              <Text size="lg" c="dimmed" mb="xl">
                {contents.description}
              </Text>
            )}
          </div>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: contents.content }}
          />
        </Stack>
      </Container>
    </Layout>
  );
};

export default BlogContents;
