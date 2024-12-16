import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { GoogleTagManager } from "@next/third-parties/google";

import "./globals.css";
import "@mantine/core/styles.css";

import AppMenu from "../components/common/AppMenu";

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
        {/* <!-- Google tag (gtag.js) --> */}
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <AppMenu>{children}</AppMenu>
        </MantineProvider>
      </body>
    </html>
  );
}
