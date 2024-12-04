"use client";
import { FC } from "react";
import Link from "next/link";
import { Badge, Card, Image, Text, Group } from "@mantine/core";
import { type Article } from "../../types/notion/Article";
import classes from "./BadgeCard.module.css";

const BadgeCard: FC<{ post: Article }> = ({ post }) => {
  const { id, thumbnail, title, description, tags } = post;
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
            {/* <Badge size="sm" variant="light">
              {publishedAt}
            </Badge> */}
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
};

export default BadgeCard;
