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
  title: "ADSO AFRICA — Mobilité plus sûre et plus responsable",
  description:
    "ADSO AFRICA est la plateforme africaine d’éducation routière, de formation à la mobilité, de prévention, de simulation et d’évaluation et reconnaissance des compétences acquises.",
  keywords: [
    "ADSO AFRICA",
    "ADSO",
    "éducation routière",
    "formation à la mobilité",
    "sécurité routière",
    "prévention routière",
    "mobilité responsable",
    "usagers vulnérables",
    "ADSO Immersif",
    "Afrique",
    "54 pays africains",
  ],
  authors: [{ name: "Neo Digital Startup Academy (NDSA)" }],
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "ADSO AFRICA — Mobilité plus sûre et plus responsable",
    description:
      "Éduquer, former et responsabiliser chaque usager de la route.",
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
