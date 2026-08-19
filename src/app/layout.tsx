import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { AccessibilityZoom } from "@/components/AccessibilityZoom";
import { VoiceAccess } from "@/components/VoiceAccess";
import LessonVisualEnhancer from "@/components/LessonVisualEnhancer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADSO — African Driving Safety & Orientation",
  description:
    "ADSO — African Driving Safety & Orientation. Plateforme d'éducation routière, de sécurité, de prévention et d'orientation pour une mobilité responsable en Afrique et à l'international.",
  keywords: [
    "ADSO",
    "African Driving Safety & Orientation",
    "sécurité routière en Afrique",
    "éducation routière",
    "prévention routière",
    "conduite responsable",
    "mobilité sûre",
    "code de la route",
    "formation conducteur",
    "orientation routière",
  ],
  authors: [{ name: "ADSO" }],
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "ADSO — African Driving Safety & Orientation",
    description:
      "Apprendre à mieux partager la route. Éducation routière, sécurité, prévention et orientation pour une mobilité responsable.",
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
        <LessonVisualEnhancer />
      </body>
    </html>
  );
}
