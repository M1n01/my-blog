import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css"; // 通知用のスタイルを追加
import { Notifications } from "@mantine/notifications"; // Notificationsプロバイダーをインポート
import { GoogleAnalytics } from "@next/third-parties/google";
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
      <GoogleAnalytics gaId="G-RFT0CVB7F3" />
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Notifications position="top-right" />
          <AppMenu>{children}</AppMenu>
        </MantineProvider>
      </body>
    </html>
  );
}
