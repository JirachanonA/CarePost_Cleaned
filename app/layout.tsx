import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TabBar } from "@/components/TabBar";
import { GoogleTranslate } from "@/components/GoogleTranslate";

export const metadata: Metadata = {
  title: "CarePost",
  description: "Turn discharge papers into a simple daily recovery plan.",
  icons: { icon: "/carepost-logo.png", apple: "/carepost-logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <div className="mx-auto flex min-h-dvh max-w-lg flex-col">{children}</div>
        <TabBar />
        <GoogleTranslate />
      </body>
    </html>
  );
}
