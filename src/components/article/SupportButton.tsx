"use client";
import { Button, Tooltip } from "@mantine/core";
import { IconCoffee } from "@tabler/icons-react";

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
        variant="filled"
        color="green"
        leftSection={<IconCoffee size={25} />}
        size="lg"
        radius="xl"
        fullWidth
        onClick={() => window.open("https://buymeacoffee.com/m1n01", "_blank")}
      >
        支援していただけると嬉しいです！
      </Button>
    </Tooltip>
  );
};
