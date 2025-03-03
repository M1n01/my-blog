"use client";

import React from "react";
import { Card, Text, Group, Stack } from "@mantine/core";
import { BookmarkBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * ブックマークブロックコンポーネント
 *
 * NotionのブックマークブロックをMantineのCardコンポーネントとして表示します。
 * 現在はOGP取得を行わず、URLとホスト名のみ表示するシンプルな実装です。
 */
export const BookmarkBlock = ({
  block,
  index,
}: {
  block: BookmarkBlockObjectResponse;
  index: number;
}) => {
  // URLからホスト名を取得
  const hostname = new URL(block.bookmark.url).hostname;

  return (
    <Card
      key={index}
      withBorder
      radius="md"
      p="md"
      component="a"
      href={block.bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Group align="flex-start" style={{ gap: "1rem" }}>
        <Stack style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">
            {hostname}
          </Text>
          <Text size="lg" fw={500} lineClamp={2}>
            {block.bookmark.url}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {hostname}からのリンク
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};
