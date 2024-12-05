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
import { IconBrandGithub, IconBrandX, IconHeart } from "@tabler/icons-react";

const Navbar: FC<{ opened: boolean; toggle: () => void }> = ({
  opened,
  toggle,
}) => {
  console.log(toggle);

  return (
    <AppShell.Navbar p="md" hidden={!opened}>
      <Stack gap="xl">
        {/* Profile Section */}
        <Stack align="center" gap="xs">
          <Avatar
            size="lg"
            src={`${process.env.NEXT_R2_PUBLIC_URL}/IMG_8359.jpg`}
          />
          <Title order={3}>Abe Minato</Title>
          <Text size="sm" c="dimmed">
            Beginner Developer
          </Text>
        </Stack>

        {/* Bio Section */}
        <Stack gap="xs">
          <Text size="sm">
            I am an engineer from 42 Tokyo. I&apos;m interested in Rust and
            TypeScript, and I&apos;m also passionate about Web3.0 technologies.
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
