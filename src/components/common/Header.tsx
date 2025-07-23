"use client";
import { FC, useState, useEffect } from "react";
import { AppShell, Burger, Button, Flex, Group, Title } from "@mantine/core";
import classes from "./Header.module.css";
import Link from "next/link";
import { useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

const Header: FC<{ opened: boolean; toggle: () => void }> = ({
  opened,
  toggle,
}) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  // 初回マウント時にOSのカラースキームを反映
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setColorScheme(isDark ? "dark" : "light");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 切り替えハンドラ
  const handleToggleColorScheme = () => {
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <AppShell.Header className={classes.header} style={{ padding: "5px" }}>
      <Flex
        justify="space-between"
        align="center"
        mih={40}
        gap="sm"
        direction="row"
        wrap="wrap"
      >
        <Link href="/">
          <Title mb="lg" ff={"Butler"}>
            Minabe&apos;s Blog
          </Title>
        </Link>
        {/* カラースキーム切り替えボタン */}
        <Button
          onClick={handleToggleColorScheme}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Toggle color scheme"
        >
          {colorScheme === "dark" ? (
            <IconSun size={20} />
          ) : (
            <IconMoon size={20} />
          )}
        </Button>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Flex>
    </AppShell.Header>
  );
};

export default Header;
