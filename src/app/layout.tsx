import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADSO Blueprint — Global AI Driving Education Ecosystem",
  description:
    "Document de Spécification Maître — Auto Drive School Online. Blueprint complet de l'écosystème mondial d'éducation à la conduite par IA 2026-2030.",
  keywords: [
    "ADSO",
    "Blueprint",
    "Auto Drive School Online",
    "AI Driving Education",
    "Spécification",
    "Écosystème IA",
    "2026-2030",
  ],
  authors: [{ name: "ADSO Engineering" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "ADSO Blueprint — Global AI Driving Education Ecosystem",
    description:
      "Document de Spécification Maître — Blueprint 2026-2030 pour l'écosystème mondial d'éducation à la conduite automobile par IA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
