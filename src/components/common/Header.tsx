"use client";
import { FC, useState } from "react";
import {
  AppShell,
  Burger,
  Flex,
  Group,
  Title,
  Menu,
  ActionIcon,
  SegmentedControl,
  Slider,
  Text,
  Box,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import classes from "./Header.module.css";
import Link from "next/link";
import { useBlogSettings } from "@/contexts/BlogSettingsContext";

const links = [{ link: "/", label: "TOP" }];

const SettingsMenu: FC = () => {
  const { settings, updateFontSize, updateFontFamily } = useBlogSettings();

  return (
    <Menu position="bottom-end" withArrow>
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="ブログ設定">
          <IconSettings size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>文字サイズ</Menu.Label>
        <Menu.Item closeMenuOnClick={false}>
          <Box w={200}>
            <Text size="sm" mb="xs">
              {settings.fontSize}px
            </Text>
            <Slider
              value={settings.fontSize}
              onChange={updateFontSize}
              min={9}
              max={24}
              step={1}
              marks={[
                { value: 9, label: "9px" },
                { value: 16, label: "16px" },
                { value: 24, label: "24px" },
              ]}
            />
          </Box>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>フォント</Menu.Label>
        <Menu.Item>
          <SegmentedControl
            fullWidth
            value={settings.fontFamily}
            onChange={(value) =>
              updateFontFamily(value as "default" | "gothic" | "mincho")
            }
            data={[
              { label: "デフォルト", value: "default" },
              { label: "ゴシック", value: "gothic" },
              { label: "明朝", value: "mincho" },
            ]}
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const Header: FC<{ opened: boolean; toggle: () => void }> = ({
  opened,
  toggle,
}) => {
  const [active, setActive] = useState<string | null>(null);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => setActive(link.link)}
    >
      {link.label}
    </a>
  ));

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
        <Group gap={5} visibleFrom="xs" className={classes.links}>
          {items}
          <SettingsMenu />
        </Group>

        <Group hiddenFrom="xs" gap={5}>
          <SettingsMenu />
          <Burger opened={opened} onClick={toggle} size="sm" />
        </Group>
      </Flex>
    </AppShell.Header>
  );
};

export default Header;
