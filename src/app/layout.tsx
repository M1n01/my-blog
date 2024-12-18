import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import "./globals.css";
import "@mantine/core/styles.css";

import AppMenu from "../components/common/AppMenu";
import { BlogProvider } from "./context/article.context";

export const metadata = {
  title: "minabe's blog",
  description: "This site is a technical blog by minabe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("RootLayout rendering...");
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <BlogProvider>
            <AppMenu>{children}</AppMenu>
          </BlogProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
