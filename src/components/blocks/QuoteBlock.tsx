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
    <Blockquote key={index} color="violet">
      {block.quote.rich_text.map((text) => text.plain_text)}
    </Blockquote>
  );
};
