import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
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
  title: "ADSO — Auto Drive School Online",
  description:
    "La première plateforme intelligente de conduite automobile. Formation accessible, personnalisée et de qualité pour chaque conducteur dans le monde.",
  keywords: [
    "ADSO",
    "Auto Drive School Online",
    "conduite automobile",
    "permis de conduire",
    "formation en ligne",
    "IA",
    "intelligence artificielle",
    "code de la route",
    "quiz",
    "auto-école",
  ],
  authors: [{ name: "ADSO Engineering" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "ADSO — Auto Drive School Online",
    description:
      "Démocratiser l'éducation à la conduite grâce à l'intelligence artificielle. Formation accessible, personnalisée et de qualité pour chaque conducteur.",
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
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
