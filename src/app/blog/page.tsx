import { getAllArticles } from "@/lib/notion";
import { Text, Container, Title } from "@mantine/core";

export default async function Page() {
  const articles = await getAllArticles();
  console.log(articles);
  return (
    <Container>
      <Title order={1}>Blog</Title>
      {articles.map((article) => (
        <Text key={article.id}>{article.title}</Text>
      ))}
    </Container>
  );
}
