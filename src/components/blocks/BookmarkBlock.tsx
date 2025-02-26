"use client";

import React, { useEffect, useState } from "react";
import { Card, Image, Text, Group, Stack, Skeleton } from "@mantine/core";
import { BookmarkBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface OGPData {
  title: string;
  description: string;
  image: string;
}

export const BookmarkBlock = ({
  block,
  index,
}: {
  block: BookmarkBlockObjectResponse;
  index: number;
}) => {
  const [ogpData, setOgpData] = useState<OGPData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOGPData = async () => {
      try {
        const response = await fetch(
          `/api/ogp?url=${encodeURIComponent(block.bookmark.url)}`,
        );
        if (!response.ok) throw new Error("OGP取得に失敗しました");
        const data = await response.json();
        setOgpData(data);
      } catch (error) {
        console.error("OGP取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOGPData();
  }, [block.bookmark.url]);

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
        {loading ? (
          <>
            <Stack style={{ flex: 1 }}>
              <Skeleton height={20} radius="sm" />
              <Skeleton height={40} radius="sm" />
              <Skeleton height={15} width="70%" radius="sm" />
            </Stack>
            <Skeleton height={90} width={90} radius="sm" />
          </>
        ) : (
          <>
            <Stack style={{ flex: 1 }}>
              <Text size="sm" c="dimmed">
                {new URL(block.bookmark.url).hostname}
              </Text>
              <Text size="lg" fw={500} lineClamp={2}>
                {ogpData?.title || "無題"}
              </Text>
              <Text size="sm" c="dimmed" lineClamp={2}>
                {ogpData?.description || "No description"}
              </Text>
            </Stack>
            {ogpData?.image && (
              <Image
                src={ogpData.image}
                alt={ogpData.title || ""}
                width={90}
                height={90}
                radius="sm"
                fit="cover"
              />
            )}
          </>
        )}
      </Group>
    </Card>
  );
};
