"use client";

import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext, ReactNode } from "react";

interface BlogSettings {
  fontSize: number;
  fontFamily: "default" | "gothic" | "mincho";
}

interface BlogSettingsContextType {
  settings: BlogSettings;
  updateFontSize: (size: number) => void;
  updateFontFamily: (family: BlogSettings["fontFamily"]) => void;
}

const BlogSettingsContext = createContext<BlogSettingsContextType | undefined>(
  undefined
);

export function BlogSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<BlogSettings>({
    key: "blog-settings",
    defaultValue: {
      fontSize: 16,
      fontFamily: "default",
    },
  });

  const updateFontSize = (size: number) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  };

  const updateFontFamily = (family: BlogSettings["fontFamily"]) => {
    setSettings((prev) => ({ ...prev, fontFamily: family }));
  };

  // CSS変数を設定
  const fontFamilyMap = {
    default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    gothic: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", sans-serif',
    mincho: '"Hiragino Mincho ProN", "Yu Mincho", "MS Mincho", serif',
  };

  return (
    <BlogSettingsContext.Provider
      value={{ settings, updateFontSize, updateFontFamily }}
    >
      <div
        style={{
          "--blog-font-size": `${settings.fontSize}px`,
          "--blog-font-family": fontFamilyMap[settings.fontFamily],
        } as React.CSSProperties}
      >
        {children}
      </div>
    </BlogSettingsContext.Provider>
  );
}

export function useBlogSettings() {
  const context = useContext(BlogSettingsContext);
  if (!context) {
    throw new Error("useBlogSettings must be used within BlogSettingsProvider");
  }
  return context;
}