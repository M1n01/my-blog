"use client";

import React from "react";
import { Grid } from "@mantine/core";

import { Article } from "@/types/notion/Article";
import ArticleCard from "./ArticleCard";

export default function ArticleCards({ posts }: { posts: Article[] }) {
  return (
    <Grid>
      {posts.map((post) => (
        <Grid.Col key={post.id} span={{ base: 12, sm: 6, md: 4 }}>
          <ArticleCard post={post} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
