import { useEffect } from "react";
import { useBlogContext } from "../context/article.context";
import { TableOfContentsItem } from "@/types/notion/Article";

declare global {
  interface Window {
    initialTableOfContents?: TableOfContentsItem[];
  }
}

export function useTableOfContents() {
  const { setTableOfContents } = useBlogContext();

  useEffect(() => {
    // 初期データがある場合は、コンテキストに設定
    if (window.initialTableOfContents) {
      setTableOfContents(window.initialTableOfContents);
    }
  }, [setTableOfContents]);
}
