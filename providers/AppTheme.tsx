"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, ConfigProvider, theme } from "antd";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const PRIMARY_COLOR = "#2563eb";

const { darkAlgorithm, defaultAlgorithm } = theme;

const lightTheme = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: PRIMARY_COLOR,
    borderRadius: 6,
    colorBgContainer: "#FFFFFF",
    colorBgLayout: "#FCFCFC",
    colorTextBase: "#111827",
    colorBorderSecondary: "#E5E7EB",
  },
  components: {
    Button: {
      colorPrimary: PRIMARY_COLOR,
      colorPrimaryHover: "#1B4CCA",
      colorPrimaryActive: "#2563EB",
    },
    Radio: {
      colorPrimary: "blue",
      buttonBg: "#fff",
      buttonCheckedBg: "blue",
      buttonCheckedColor: "#fff",
      buttonColor: "#000",
      buttonHoverBg: "#fff7e6",
      buttonHoverColor: "blue",
      buttonActiveBg: "blue",
      buttonActiveColor: "#fff",
    },
    Menu: {
      // Warna background item yang aktif
      itemSelectedBg: "#2563eb",
      itemSelectedColor: "#ffffff",

      // Opsional: hover state
      itemHoverBg: "rgba(37, 99, 235, 0.15)",
      itemHoverColor: "#2563eb",
    },
  },
};

const darkTheme = {
  algorithm: darkAlgorithm,
  token: {
    colorPrimary: PRIMARY_COLOR,
    borderRadius: 6,
    colorBgContainer: "#141414",
    colorBgLayout: "#141414",
    colorTextBase: "#E5E7EB",
    colorBorderSecondary: "#2c2c2c",
  },
  components: {
    Button: {
      colorPrimary: PRIMARY_COLOR,
      colorPrimaryHover: "#1B4CCA",
      colorPrimaryActive: "#2563EB",
    },
    Radio: {
      colorPrimary: "blue",
      buttonBg: "#1F2937",
      buttonCheckedBg: "blue",
      buttonCheckedColor: "#fff",
      buttonColor: "#E5E7EB",
      buttonHoverBg: "#374151",
      buttonHoverColor: "blue",
      buttonActiveBg: "blue",
      buttonActiveColor: "#fff",
    },
  },
};

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within AppThemeProvider");
  }
  return ctx;
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  // 1. Lazy initializer - ambil preferensi user langsung saat pertama mount
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "light";

    const stored = window.localStorage.getItem("theme-mode");
    if (stored === "light" || stored === "dark") return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 3. Sinkronisasi antar tab/jendela browser
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "theme-mode" &&
        (e.newValue === "light" || e.newValue === "dark")
      ) {
        setMode(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 4. Mengikuti preferensi tema sistem operasi
  useEffect(() => {
    if (!mounted) return;
    const stored = window.localStorage.getItem("theme-mode");
    if (stored === "light" || stored === "dark") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setMode(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [mounted]);

  // 5. Simpan pilihan terbaru ke localStorage
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem("theme-mode", mode);
  }, [mode, mounted]);

  // 6. Config Ant Design
  const config = useMemo(
    () => (mounted && mode === "dark" ? darkTheme : lightTheme),
    [mode, mounted],
  );

  const value = useMemo(
    () => ({
      mode,
      toggle: () => setMode((prev) => (prev === "light" ? "dark" : "light")),
      setMode,
    }),
    [mode],
  );

  return (
    <AntdRegistry>
      <ThemeContext.Provider value={value}>
        <ConfigProvider theme={config}>
          <App>
            <div className={`${mounted ? mode : "light"} app-container`}>
              {children}
            </div>
          </App>
        </ConfigProvider>
      </ThemeContext.Provider>
    </AntdRegistry>
  );
}
