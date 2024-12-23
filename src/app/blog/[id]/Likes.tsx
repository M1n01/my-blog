"use client";

import { Text, ActionIcon, Group } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import useSWR from "swr";
import { useParams } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useLikes() {
  const params = useParams();
  const { data, error } = useSWR(`/api/likes/${params.id}`, fetcher);

  return {
    likes: data,
    isLoading: !error && !data,
    isError: error,
  };
}

// likesボタンを押したら、SWRを使っていいね数を取得する
export const Likes = () => {
  const { likes, isLoading } = useLikes();

  return (
    <Group align="center">
      <ActionIcon variant="outline" c="red" radius="xl" loading={isLoading}>
        <IconHeart size={18} stroke={1.5} />
      </ActionIcon>
      {isLoading ? <Text>Loading...</Text> : <Text>{likes}</Text>}
    </Group>
  );
};
