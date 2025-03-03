"use client";

import { Article, TableOfContentsItem } from "@/types/notion/Article";
import React, { createContext, useContext, useState, Dispatch } from "react";

type BlogContextType = {
  articles: Article[] | null;
  setArticles: Dispatch<React.SetStateAction<Article[] | null>>;
  tableOfContents: TableOfContentsItem[];
  setTableOfContents: Dispatch<React.SetStateAction<TableOfContentsItem[]>>;
};

export const BlogContext = createContext<BlogContextType>({
  articles: null,
  setArticles: () => {},
  tableOfContents: [],
  setTableOfContents: () => {},
});

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    [],
  );

  return (
    <BlogContext.Provider
      value={{ articles, setArticles, tableOfContents, setTableOfContents }}
    >
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
