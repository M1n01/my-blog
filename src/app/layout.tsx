import { ColorSchemeScript } from "@mantine/core";
import "./globals.css";
import "@mantine/core/styles.css";
import { GoogleAnalytics } from "@next/third-parties/google";

import ThemeRegistry from "./ThemeRegistry";

export const metadata = {
  title: "minabe's blog",
  description: "This site is a technical blog by minabe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
      <GoogleAnalytics gaId="G-RFT0CVB7F3" />
    </html>
  );
}
