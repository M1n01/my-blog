import { FC } from "react";
import {
  Badge,
  Card,
  CardSection,
  Image,
  Text,
  Title,
  Group,
  Stack,
} from "@mantine/core";
import { type Article } from "../../types/notion/Article";
import classes from "./ArticleCard.module.css";
import { IconCalendarTime } from "@tabler/icons-react";

const ArticleCard: FC<{ post: Article }> = ({ post }) => {
  const { id, thumbnail, title, description, publishedAt, category, tags } =
    post;
  console.log("post:", post);
  const labels = tags?.map((tag) => (
    <Badge key={`${tag.id}`} color={`${tag.color!}`} variant="dot">
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
      <CardSection className={classes.section} style={{ height: 250 }}>
        <Group justify="space-between" mb="sm">
          <Badge size="md" variant="light">
            <IconCalendarTime size={12} /> {publishedAt}
          </Badge>
          <Badge
            size="md"
            variant="transparent"
            color={category.color || "blue"}
          >
            {category.name}
          </Badge>
        </Group>
        <Title order={4} mt="xs" mb="sm">
          {title}
        </Title>
        <Stack mt="sm" gap="xs">
          <Text size="xs">【内容】</Text>
          <Text size="xs" fz="sm">
            {description}
          </Text>
        </Stack>
      </CardSection>

      <CardSection className={classes.section} mih={90}>
        <Text mb="lg" className={classes.label} c="dimmed">
          Tags
        </Text>
        <Group gap={7}>{labels}</Group>
      </CardSection>
    </Card>
  );
};

export default ArticleCard;
