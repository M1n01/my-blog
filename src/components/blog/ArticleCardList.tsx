import { FC } from "react";
import { SimpleGrid } from "@mantine/core";
import ArticleCard from "./ArticleCard";
import { type Article } from "@/types/notion/Article";

interface ArticleCardListProps {
  articles: Article[];
}

export const ArticleCardList: FC<ArticleCardListProps> = ({ articles }) => {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, lg: 3 }}
      spacing={{ base: "md", sm: "lg" }}
      verticalSpacing={{ base: "md", sm: "lg" }}
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} post={article} />
      ))}
    </SimpleGrid>
  );
};
