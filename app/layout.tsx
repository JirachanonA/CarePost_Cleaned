import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TabBar } from "@/components/TabBar";
import { Sidebar } from "@/components/Sidebar";
import { GoogleTranslate, LanguagePicker } from "@/components/GoogleTranslate";
import { LogoIntro, introGateScript, translateGuardScript } from "@/components/LogoIntro";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introGateScript }} />
        <script dangerouslySetInnerHTML={{ __html: translateGuardScript }} />
      </head>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <LogoIntro />
        <Sidebar />
        <div className="lg:pl-72">
          <div className="mx-auto flex min-h-dvh max-w-lg flex-col lg:max-w-5xl">{children}</div>
        </div>

        {/* Phone chrome */}
        <div className="fixed right-4 top-[max(0.75rem,env(safe-area-inset-top))] z-40 lg:hidden">
          <LanguagePicker variant="floating" />
        </div>
        <TabBar />
        <GoogleTranslate />
      </body>
    </html>
  );
}
