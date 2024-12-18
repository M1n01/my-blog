"use client";

import { Article } from "@/types/notion/Article";
import React, { createContext, useContext, useState, Dispatch } from "react";

export const BlogContext = createContext<{
  articles: Article[] | null;
  setArticles: Dispatch<React.SetStateAction<Article[] | null>>;
}>({
  articles: null,
  setArticles: () => {},
});

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  return (
    <BlogContext.Provider value={{ articles, setArticles }}>
      {children}
    </BlogContext.Provider>
  );
};

export function useBlogContext() {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlogContext must be used within a BlogProvider");
  }
  return context;
}
