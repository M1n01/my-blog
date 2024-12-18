import { FC } from "react";
import { Badge, Card, CardSection, Image, Text, Group } from "@mantine/core";
import { type Article } from "../../types/notion/Article";
import classes from "./BadgeCard.module.css";

const BadgeCard: FC<{ post: Article }> = ({ post }) => {
  const { id, thumbnail, title, description, publishedAt, tags } = post;
  console.log("post:", post);
  const labels = tags?.map((tag) => (
    <Badge key={`${tag.id}`} color={`${tag.color!}`} variant="light">
      {tag.name}
    </Badge>
  ));

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      p="md"
      className={classes.card}
      component="a"
      href={`/blog/${id}`}
    >
      <CardSection>
        <Image src={thumbnail} alt={title} height={180} />
      </CardSection>
      <CardSection className={classes.section} mt="md" style={{ height: 200 }}>
        <Group justify="space-between">
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
      </CardSection>

      <CardSection className={classes.section}>
        <Text mt="md" mb="md" className={classes.label} c="dimmed">
          Tags
        </Text>
        <Group gap={7}>{labels}</Group>
      </CardSection>
    </Card>
  );
};

export default BadgeCard;
