"use client";

import { Card, Group, Image, Loader, Stack, Text } from "@mantine/core";
import { BookmarkBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import React, { useEffect, useState } from "react";

interface OGPData {
  title: string;
  description: string;
  image: string;
  url: string;
}

/**
 * ブックマークブロックコンポーネント
 *
 * NotionのブックマークブロックをMantineのCardコンポーネントとして表示します。
 * blog-ogp APIからOGPデータを取得して表示します。
 */
export const BookmarkBlock = ({
  block,
  index,
}: {
  block: BookmarkBlockObjectResponse;
  index: number;
}) => {
  const [ogpData, setOgpData] = useState<OGPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // URLからホスト名を取得
  const hostname = new URL(block.bookmark.url).hostname;

  useEffect(() => {
    const fetchOGP = async () => {
      try {
        const response = await fetch(
          `/api/blog-ogp?url=${encodeURIComponent(block.bookmark.url)}`,
        );
        if (response.ok) {
          const data = (await response.json()) as OGPData;
          setOgpData(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOGP();
  }, [block.bookmark.url]);

  if (loading) {
    return (
      <Card key={index} withBorder radius="md" p="md">
        <Group align="center" justify="center" style={{ minHeight: 100 }}>
          <Loader size="sm" />
        </Group>
      </Card>
    );
  }

  if (error || !ogpData) {
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
  }

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
        {ogpData.image && (
          <Image
            src={ogpData.image}
            alt={ogpData.title}
            width={120}
            height={80}
            radius="sm"
            style={{ flexShrink: 0 }}
          />
        )}
        <Stack style={{ flex: 1 }}>
          <Text size="sm" c="dimmed">
            {hostname}
          </Text>
          <Text size="lg" fw={500} lineClamp={2}>
            {ogpData.title || block.bookmark.url}
          </Text>
          <Text size="sm" c="dimmed" lineClamp={2}>
            {ogpData.description || `${hostname}からのリンク`}
          </Text>
        </Stack>
      </Group>
    </Card>
  );
};
