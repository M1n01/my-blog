"use client";

import { ActionIcon, Group, Stack, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface LikeButtonProps {
  articleId: string;
}

/**
 * いいねボタンコンポーネント
 * - 記事に対するいいねを管理
 * - 同じユーザーからの重複いいねをローカルストレージで防止
 * - いいね数をNotionデータベースに反映
 */
export const LikeButton = ({ articleId }: LikeButtonProps) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // SWRでいいね数を取得
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("いいね数の取得に失敗しました");
    return (await res.json()) as { likes: number };
  };
  const { data, mutate, isValidating } = useSWR(
    `/api/articles/like?articleId=${articleId}`,
    fetcher,
  );

  // ページ読み込み時にローカルストレージからいいね状態を取得
  useEffect(() => {
    if (typeof window === "undefined") return;
    const likedArticles = JSON.parse(
      localStorage.getItem("likedArticles") || "{}",
    );
    setHasLiked(!!likedArticles[articleId]);
  }, [articleId]);

  const handleLike = async () => {
    if (hasLiked || isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/articles/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ articleId }),
      });
      if (!response.ok) {
        throw new Error("いいねの更新に失敗しました");
      }

      // ローカルストレージにいいね状態を保存
      const likedArticles = JSON.parse(
        localStorage.getItem("likedArticles") || "{}",
      );
      likedArticles[articleId] = true;
      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
      setHasLiked(true);
      // SWRのキャッシュを更新
      mutate();
      notifications.show({
        title: "ありがとうございます！",
        message: "いいねが送信されました",
        color: "pink",
        withCloseButton: true,
        icon: <IconHeart style={{ color: "pink" }} />,
      });
    } catch (error) {
      console.error("いいね処理中にエラーが発生しました:", error);
      notifications.show({
        title: "エラー",
        message: "いいねを送信できませんでした",
        color: "red",
        withCloseButton: true,
        icon: <IconX style={{ color: "red" }} />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip
      label={
        hasLiked ? "いいね ありがとうございます！" : "この記事にいいねする"
      }
      opened={hasLiked}
      withArrow={hasLiked}
      arrowOffset={20}
      position="top-start"
      offset={5}
      color={hasLiked ? "pink" : "gray"}
    >
      <Group gap="xs">
        <ActionIcon
          variant="filled"
          color="pink"
          onClick={handleLike}
          loading={isLoading || isValidating}
          loaderProps={{
            type: "dots",
          }}
          disabled={hasLiked}
          size="xl"
          radius="xl"
        >
          <IconHeart style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
        <Group gap="xs">
          <Text fw={700}>{data?.likes ?? 0}</Text>
          <Text>いいね！</Text>
        </Group>
      </Group>
    </Tooltip>
  );
};
