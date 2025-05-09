"use client";
import { FC, useState } from "react";
import { AppShell, Burger, Flex, Group, Title } from "@mantine/core";
import classes from "./Header.module.css";
import Link from "next/link";

const links = [{ link: "/", label: "TOP" }];

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
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Flex>
    </AppShell.Header>
  );
};

export default Header;
