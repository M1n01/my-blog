"use client";
import {
  AppShell,
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandX,
  IconMapPin,
  IconScript,
} from "@tabler/icons-react";
import { FC } from "react";

const Navbar: FC<{ opened: boolean }> = ({ opened }) => {
  return (
    <AppShell.Navbar p="md" hidden={!opened}>
      <Stack gap="xl">
        {/* Profile Section */}
        <Stack align="center" gap="xs">
          <Avatar size="lg" src="/assets/avatar.jpg" />
          <Title order={3}>Minabe</Title>
          <Text size="sm" c="dimmed">
            Frontend Developer
          </Text>
          <Text size="md" c="">
            <IconMapPin size={15} /> Tokyo
          </Text>
        </Stack>

        {/* Bio Section */}
        <Stack gap="xs">
          <Text size="sm">98年生まれのエンジニア。主にNext.js。</Text>
          <Text size="sm">
            デジタル認証について興味関心があります。DID/VCなど。
          </Text>
          <Text size="sm">
            私は日本ハムファイターズを全力で応援しています。
          </Text>
          <Text size="xs" c="dimmed">
            札幌第一高→TUT(機械工学修士)→42Tokyo
          </Text>
        </Stack>

        {/* Social Links */}
        <Group gap="xs">
          <Button
            variant="subtle"
            leftSection={<IconBrandGithub size={20} />}
            component="a"
            href="https://github.com/M1n01"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
          <Button
            variant="subtle"
            leftSection={<IconBrandX size={20} />}
            component="a"
            href="https://twitter.com/m1nabe"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </Button>

          <Button
            variant="subtle"
            leftSection={<IconScript size={20} />}
            component="a"
            href="https://forms.gle/goGXqgtbeSGJo1QS9"
            target="_blank"
            rel="noopener noreferrer"
          >
            お問い合わせフォーム
          </Button>
        </Group>
      </Stack>
    </AppShell.Navbar>
  );
};

export default Navbar;
