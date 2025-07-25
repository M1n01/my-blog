"use client";

import React from "react";
import { Group, Text, Tooltip } from "@mantine/core";
import {
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  PocketShareButton,
  LineShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  PocketIcon,
  LineIcon,
} from "react-share";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({
  url,
  title,
  description = "",
}: ShareButtonsProps) {
  const iconSize = 32;
  const iconRadius = 6;

  return (
    <div>
      <Text fw={600} size="sm" mb="xs">
        この記事をシェアする
      </Text>
      <Group gap="sm">
        <Tooltip label="X(Twitter)でシェア">
          <TwitterShareButton url={url} title={title}>
            <TwitterIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
            />
          </TwitterShareButton>
        </Tooltip>

        <Tooltip label="Facebookでシェア">
          <FacebookShareButton url={url}>
            <FacebookIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
            />
          </FacebookShareButton>
        </Tooltip>

        <Tooltip label="LinkedInでシェア">
          <LinkedinShareButton
            url={url}
            title={title}
            summary={description}
            source="My Blog"
          >
            <LinkedinIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
            />
          </LinkedinShareButton>
        </Tooltip>

        <Tooltip label="Pocketに保存">
          <PocketShareButton url={url} title={title}>
            <PocketIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
            />
          </PocketShareButton>
        </Tooltip>

        <Tooltip label="LINEでシェア">
          <LineShareButton url={url} title={title}>
            <LineIcon size={iconSize} round={false} borderRadius={iconRadius} />
          </LineShareButton>
        </Tooltip>
      </Group>
    </div>
  );
}
