"use client";

import React from "react";
import { Accordion } from "@mantine/core";
import { ToggleBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { renderRichText } from "./Paragraph";

export const ToggleBlock = ({
  block,
  index,
}: {
  block: ToggleBlockObjectResponse;
  index: number;
}) => {
  console.log("index: ", index);
  return (
    <Accordion mb="sm">
      <Accordion.Item value={String(block.id)} key={index}>
        <Accordion.Control>
          {block.toggle.rich_text.map((text, i) => (
            <React.Fragment key={`accordion-title${block.id}-${i}`}>
              {renderRichText(text)}
            </React.Fragment>
          ))}
        </Accordion.Control>
        <Accordion.Panel>{block.has_children === true}</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};
