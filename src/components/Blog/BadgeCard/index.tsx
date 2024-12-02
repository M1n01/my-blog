"use client";
import Link from "next/link";
import { Badge, Card, Image, Text, Group } from "@mantine/core";
import { Article } from "../../../types/notion/Article";
import classes from "./BadgeCard.module.css";

export function BadgeCard({ post }: { post: Article }) {
  const { id, thumbnail, title, description, publishedAt, tags } = post;
  console.log("post:", post);
  console.log("tags:", tags);
  const labels = tags?.map((tag) => (
    <Badge key={`${tag.id}`} color={`${tag.color!}`} variant="light">
      {tag.name}
    </Badge>
  ));

  return (
    <Card withBorder shadow="sm" radius="md" p="md" className={classes.card}>
      <Link
        href={{
          pathname: `/blog/${id}`,
          query: { post: JSON.stringify(post) },
        }}
      >
        <Card.Section>
          <Image src={thumbnail} alt={title} height={180} />
        </Card.Section>
        <Card.Section className={classes.section} mt="md">
          <Group justify="apart">
            <Text fz="lg" fw={500}>
              {title}
            </Text>
            <Badge size="sm" variant="light">
              {publishedAt}
            </Badge>
          </Group>
          <Text fz="sm" mt="xs">
            {description}
          </Text>
        </Card.Section>
      </Link>

      <Card.Section className={classes.section}>
        <Text mt="md" mb="md" className={classes.label} c="dimmed">
          Labels
        </Text>
        <Group gap={7}>{labels}</Group>
      </Card.Section>
    </Card>
  );
}
