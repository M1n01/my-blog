import { FC } from "react";
import { Badge, Card, CardSection, Image, Text, Group } from "@mantine/core";
import { type Article } from "../../types/notion/Article";
import classes from "./ArticleCard.module.css";

const ArticleCard: FC<{ post: Article }> = ({ post }) => {
  const { id, thumbnail, title, description, publishedAt, category, tags } =
    post;
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
        <Group justify="space-between" mb="sm">
          <Badge size="sm" variant="light">
            {publishedAt}
          </Badge>
          <Badge size="sm" variant="light" color={category.color || "blue"}>
            {category.name}
          </Badge>
        </Group>
        <Text size="sm" fz="lg" fw={500}>
          {title}
        </Text>
        <Text size="xs" fz="sm" mt="xs">
          {description}
        </Text>
      </CardSection>

      <CardSection className={classes.section} mih={90}>
        <Text mt="md" mb="lg" className={classes.label} c="dimmed">
          Tags
        </Text>
        <Group gap={7}>{labels}</Group>
      </CardSection>
    </Card>
  );
};

export default ArticleCard;
