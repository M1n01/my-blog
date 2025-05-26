"use client";

import { Button, Group, Text, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconHeart } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface LikeButtonProps {
  articleId: string;
  initialLikes: number;
}

/**
 * いいねボタンコンポーネント
 * - 記事に対するいいねを管理
 * - 同じユーザーからの重複いいねをローカルストレージで防止
 * - いいね数をNotionデータベースに反映
 */
export const LikeButton = ({ articleId, initialLikes }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ページ読み込み時にローカルストレージからいいね状態を取得
  useEffect(() => {
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

      const data = await response.json();
      setLikes(data.likes);

      // ローカルストレージにいいね状態を保存
      const likedArticles = JSON.parse(
        localStorage.getItem("likedArticles") || "{}",
      );
      likedArticles[articleId] = true;
      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));

      setHasLiked(true);

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
        loading={isLoading}
        disabled={hasLiked}
        fullWidth
      >
        <Group gap="xs">
          <Text>いいね</Text>
          <Text fw={700}>{likes}</Text>
        </Group>
      </Button>
    </Tooltip>
  );
};
