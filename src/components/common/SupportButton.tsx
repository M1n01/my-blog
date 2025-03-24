"use client";
import { Button, Tooltip } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

/**
 * サポートボタン（Buy Me Coffee）コンポーネント
 * 一定間隔で軽く震えるアニメーション効果を持つ
 */
export const SupportButton = () => {
  return (
    <Tooltip
      label="最後まで読んでいただき、ありがとうございます！"
      opened
      color="gray"
      arrowOffset={10}
      arrowSize={8}
      withArrow
    >
      <Button
        variant="outline"
        color="pink"
        leftSection={<IconHeart size={20} />}
        size="lg"
        fullWidth
        onClick={() => window.open("https://buymeacoffee.com/m1n01", "_blank")}
      >
        おいしいコーヒー飲みたいです！
      </Button>
    </Tooltip>
  );
};
