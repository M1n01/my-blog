import React from "react";
import { Blockquote } from "@mantine/core";
import { QuoteBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const QuoteBlock = ({
  block,
  index,
}: {
  block: QuoteBlockObjectResponse;
  index: number;
}) => {
  return (
    <Blockquote 
      key={index} 
      color="violet"
      style={{
        fontSize: 'var(--blog-font-size)',
        fontFamily: 'var(--blog-font-family)',
      }}
    >
      {block.quote.rich_text.map((text) => text.plain_text)}
    </Blockquote>
  );
};
