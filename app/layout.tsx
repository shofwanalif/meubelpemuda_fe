import type { Metadata } from "next";
import "./globals.css";
import { AppThemeProvider } from "@/providers/AppTheme";
import { ProgressBarProvider } from "@/providers/ProgressBarProvider";
import { QueryProvider } from "@/providers/queryprovider";

export const metadata: Metadata = {
  title: "Meubel Pemuda",
  description: "Meubel Pemuda backoffice application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <QueryProvider>
          <AppThemeProvider>
            <ProgressBarProvider>{children}</ProgressBarProvider>
          </AppThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
