import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { AccessibilityZoom } from "@/components/AccessibilityZoom";
import { VoiceAccess } from "@/components/VoiceAccess";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADSO — Formation à la mobilité et éducation routière",
  description:
    "ADSO est une plateforme de formation à la mobilité, de prévention, d'éducation routière et de contenus éducatifs numériques, pensée pour les réalités africaines.",
  keywords: [
    "ADSO",
    "formation à la mobilité",
    "éducation routière",
    "sécurité routière",
    "prévention routière",
    "mobilité responsable",
    "formation conducteur",
    "ADSO Immersif",
    "e-books sécurité routière",
    "e-books mobilité",
    "Afrique",
  ],
  authors: [{ name: "ADSO" }],
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "ADSO — Formation à la mobilité et éducation routière",
    description:
      "Apprendre à mieux se déplacer, comprendre les risques, développer les bons réflexes et accéder à des contenus éducatifs numériques.",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
        <Toaster />
        <AccessibilityZoom />
        <VoiceAccess />
      </body>
    </html>
  );
}
