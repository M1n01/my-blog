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
    <div role="region" aria-label="ソーシャルメディアシェアボタン">
      <Text fw={600} size="sm" mb="xs" id="share-buttons-heading">
        この記事をシェアする
      </Text>
      <Group gap="sm" role="group" aria-labelledby="share-buttons-heading">
        <Tooltip label="X(Twitter)でシェア">
          <TwitterShareButton
            url={url}
            title={title}
            aria-label={`${title}をX(Twitter)でシェアする`}
          >
            <TwitterIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
              aria-hidden="true"
            />
          </TwitterShareButton>
        </Tooltip>

        <Tooltip label="Facebookでシェア">
          <FacebookShareButton
            url={url}
            aria-label={`${title}をFacebookでシェアする`}
          >
            <FacebookIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
              aria-hidden="true"
            />
          </FacebookShareButton>
        </Tooltip>

        <Tooltip label="LinkedInでシェア">
          <LinkedinShareButton
            url={url}
            title={title}
            summary={description}
            source="My Blog"
            aria-label={`${title}をLinkedInでシェアする`}
          >
            <LinkedinIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
              aria-hidden="true"
            />
          </LinkedinShareButton>
        </Tooltip>

        <Tooltip label="Pocketに保存">
          <PocketShareButton
            url={url}
            title={title}
            aria-label={`${title}をPocketに保存する`}
          >
            <PocketIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
              aria-hidden="true"
            />
          </PocketShareButton>
        </Tooltip>

        <Tooltip label="LINEでシェア">
          <LineShareButton
            url={url}
            title={title}
            aria-label={`${title}をLINEでシェアする`}
          >
            <LineIcon
              size={iconSize}
              round={false}
              borderRadius={iconRadius}
              aria-hidden="true"
            />
          </LineShareButton>
        </Tooltip>
      </Group>
    </div>
  );
}
