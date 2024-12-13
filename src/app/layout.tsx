import { ColorSchemeScript, MantineProvider } from "@mantine/core";

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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-TTXM2GDB9V"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-TTXM2GDB9V');
        </script>
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
