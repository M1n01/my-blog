"use client";

import { FC } from "react";
import classes from "./ArticleCard.module.css";
import { type Article } from "../../types/notion/Article";

const ArticleCard: FC<{ post: Article }> = ({ post }) => {
  const { id, title, description, publishedAt, tags } = post;
  console.log("post:", post);
  const labels = tags?.map((tag) => (
    <span key={`${tag.id}`} style={{ backgroundColor: tag.color }}>
      {tag.name}
    </span>
  ));

  return (
    <div className={classes.card}>
      <div>{title}</div>
      <div>{publishedAt}</div>
      <div>{description}</div>
      <div>Tags: {labels}</div>
    </div>
  );
};

export default ArticleCard;
