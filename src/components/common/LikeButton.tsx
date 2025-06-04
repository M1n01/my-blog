"use client";

import { Button, Group, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart } from "@tabler/icons-react";
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
      });
    } catch (error) {
      console.error("いいね処理中にエラーが発生しました:", error);
      notifications.show({
        title: "エラー",
        message: "いいねを送信できませんでした",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tooltip
      label={hasLiked ? "すでにいいね済みです" : "この記事にいいねする"}
      position="top"
    >
      <Button
        variant={hasLiked ? "filled" : "outline"}
        color="pink"
        leftSection={<IconHeart size={20} />}
        onClick={handleLike}
        loading={isLoading || isValidating}
        disabled={hasLiked}
        fullWidth
      >
        <Group gap="xs">
          <Text>いいね</Text>
          <Text fw={700}>{data?.likes ?? 0}</Text>
        </Group>
      </Button>
    </Tooltip>
  );
};
