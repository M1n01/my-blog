"use client";
import { FC } from "react";
import {
  AppShell,
  Stack,
  Avatar,
  Title,
  Text,
  Group,
  Button,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandX,
  IconHeart,
  IconMapPin,
  IconScript,
} from "@tabler/icons-react";

const Navbar: FC<{ opened: boolean }> = ({ opened }) => {
  return (
    <AppShell.Navbar p="md" hidden={!opened}>
      <Stack gap="xl">
        {/* Profile Section */}
        <Stack align="center" gap="xs">
          <Avatar size="lg" src="/assets/avatar.jpg" />
          <Title order={3}>Abe Minato</Title>
          <Text size="sm" c="dimmed">
            Developer
          </Text>
          <Text size="md" c="">
            <IconMapPin size={15} /> Tokyo
          </Text>
        </Stack>

        {/* Bio Section */}
        <Stack gap="xs">
          <Text size="sm">
            42Tokyo出身のエンジニア。札幌生まれ。主にフロントエンドを触っています。
          </Text>
          <Text size="sm">
            趣味は、野球観戦、読書、アニメ・マンガ、映画、美術館、コーヒーなど。好きな動物はテッポウエビ。飼いたい動物はユーラシアワシミミズクとボールパイソン。
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

          {/* Donation Button */}
          <Button
            variant="light"
            color="pink"
            leftSection={<IconHeart size={20} />}
            justify="center"
            onClick={() =>
              window.open("https://buymeacoffee.com/m1n01", "_blank")
            }
          >
            Support My Work
          </Button>
        </Group>
      </Stack>
    </AppShell.Navbar>
  );
};

export default Navbar;
