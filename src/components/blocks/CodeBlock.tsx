import React from "react";
import { CodeHighlight } from "@mantine/code-highlight";
import { CodeBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const CodeBlock = ({
  block,
  index,
}: {
  block: CodeBlockObjectResponse;
  index: number;
}) => {
  return (
    <CodeHighlight
      key={index}
      code={block.code.rich_text.map((text) => text.plain_text).join("")}
      copyLabel="Copy button code"
      copiedLabel="Copied!"
      language={block.code.language}
      mb="md"
    />
  );
};
