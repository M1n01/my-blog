"use client";

import {
  CodeHighlightAdapterProvider,
  createHighlightJsAdapter,
} from "@mantine/code-highlight";
import { MantineProvider } from "@mantine/core";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css"; // 通知用のスタイルを追加
import { Notifications } from "@mantine/notifications"; // Notificationsプロバイダーをインポート
import hljs from "highlight.js/lib/core";
import bashLang from "highlight.js/lib/languages/bash";
import cssLang from "highlight.js/lib/languages/css";
import jsLang from "highlight.js/lib/languages/javascript";
import jsonLang from "highlight.js/lib/languages/json";
import mdLang from "highlight.js/lib/languages/markdown";
import pythonLang from "highlight.js/lib/languages/python";
import shellLang from "highlight.js/lib/languages/shell";
import tsLang from "highlight.js/lib/languages/typescript";
import cLang from "highlight.js/lib/languages/c";
import plaintextLang from "highlight.js/lib/languages/plaintext";
import htmlLang from "highlight.js/lib/languages/xml";
import "highlight.js/styles/dark.css";

import AppMenu from "../components/common/AppMenu";
import { BlogSettingsProvider } from "@/contexts/BlogSettingsContext";

const languages: [string, typeof tsLang][] = [
  ["typescript", tsLang],
  ["javascript", jsLang],
  ["json", jsonLang],
  ["bash", bashLang],
  ["shell", shellLang],
  ["python", pythonLang],
  ["css", cssLang],
  ["html", htmlLang],
  ["markdown", mdLang],
  ["c", cLang],
  ["plaintext", plaintextLang],
];

languages.forEach(([name, lang]) => hljs.registerLanguage(name, lang));

const highlightJsAdapter = createHighlightJsAdapter(hljs);

export default function ThemeRegistry({
  children,
}: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <CodeHighlightAdapterProvider adapter={highlightJsAdapter}>
        <BlogSettingsProvider>
          <Notifications position="top-right" />
          <AppMenu>{children}</AppMenu>
        </BlogSettingsProvider>
      </CodeHighlightAdapterProvider>
    </MantineProvider>
  );
}
