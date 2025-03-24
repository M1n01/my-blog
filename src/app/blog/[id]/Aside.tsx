"use client";

import { AppShell, Text, ScrollArea, Box } from "@mantine/core";
import { TableOfContents } from "@mantine/core";
import { useEffect, useState } from "react";

/**
 * 目次の項目を表す型定義
 * Mantine v7.14.3 の TableOfContents で使用する形式に合わせた型
 */
interface TocLink {
  /** 目次の表示テキスト */
  label: string;

  /** アンカーリンク (例: #section-1) */
  link: string;

  /** ネストレベル (0 = h1, 1 = h2, etc.) */
  order: number;

  /** 子項目 (必要に応じて) */
  children?: TocLink[];
}

/**
 * ブログ記事の目次を表示するサイドバーコンポーネント
 * 記事内のh2〜h4要素を検出し、クリックで該当箇所にスクロールする機能を提供
 */
export default function BlogContentAside() {
  const [links, setLinks] = useState<TocLink[]>([]);
  const [loading, setLoading] = useState(true);

  // 目次を構築する
  useEffect(() => {
    const buildTableOfContents = () => {
      const articleHeadings = document.querySelectorAll(
        ".article-content h2, .article-content h3, .article-content h4",
      );

      if (articleHeadings.length === 0) {
        return;
      }

      const tocLinks: TocLink[] = [];

      articleHeadings.forEach((heading) => {
        const id = heading.id;
        const text = heading.textContent || "";
        const level = parseInt(heading.tagName.charAt(1));

        tocLinks.push({
          label: text,
          link: `#${id}`,
          order: level - 1, // Mantineの目次レベルに合わせて調整
        });
      });

      setLinks(tocLinks);
      setLoading(false);
    };

    // 遅延実行してDOMが完全に構築されてから実行
    const timer = setTimeout(() => {
      buildTableOfContents();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppShell.Aside p="md" w={280}>
      <Box>
        <Text fw={700} mb="xs">
          目次
        </Text>
        <ScrollArea h="calc(100vh - 200px)" type="auto" offsetScrollbars>
          {loading ? (
            <Text size="sm" c="dimmed">
              読み込み中...
            </Text>
          ) : links.length > 0 ? (
            <TableOfContents
              variant="filled"
              color="blue"
              size="sm"
              radius="sm"
              scrollSpyOptions={{
                selector: ".article-content :is(h2, h3, h4)",
              }}
              getControlProps={({ active, data }) => ({
                component: "a",
                href: `#${data.id}`,
                style: { color: active ? "blue" : "gray" },
                children: data.value,
              })}
            />
          ) : (
            <Text size="sm" c="dimmed">
              この記事には目次がありません
            </Text>
          )}
        </ScrollArea>
      </Box>
    </AppShell.Aside>
  );
}
