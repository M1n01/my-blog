"use client";
import { FC, useState } from "react";
import { AppShell, Burger, Container, Group, Title } from "@mantine/core";
import classes from "./Header.module.css";

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
    <AppShell.Header p="md" className={classes.header}>
      <Container size="xl" className={classes.inner} mb="xs">
        <Title mb="lg" ff={"Oswald"}>
          minabe&apos;s Blog
        </Title>
        <Group gap={5} visibleFrom="xs" className={classes.links}>
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </Container>
    </AppShell.Header>
  );
};

export default Header;
