"use client";

import React from "react";
import { Accordion } from "@mantine/core";
import { ToggleBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { renderRichText } from "./Paragraph";

export const ToggleBlock = ({
  block,
  index,
  childrenContent,
}: {
  block: ToggleBlockObjectResponse;
  index: number;
  childrenContent?: React.ReactNode;
}) => {
  return (
    <Accordion 
      mb="sm"
      style={{
        fontSize: 'var(--blog-font-size)',
        fontFamily: 'var(--blog-font-family)',
      }}
    >
      <Accordion.Item value={String(block.id)} key={index}>
        <Accordion.Control>
          {block.toggle.rich_text.map((text, i) => (
            <React.Fragment key={`accordion-title${block.id}-${i}`}>
              {renderRichText(text)}
            </React.Fragment>
          ))}
        </Accordion.Control>
        <Accordion.Panel>{childrenContent}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
