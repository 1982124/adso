import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { AccessibilityZoom } from "@/components/AccessibilityZoom";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADSO — La responsabilité au service de la vie",
  description:
    "ADSO est la plateforme internationale d'éducation à la mobilité, à la citoyenneté et à la sécurité routière, personnalisée par l'intelligence artificielle.",
  keywords: [
    "ADSO",
    "mobilité",
    "citoyenneté",
    "sécurité routière",
    "code de la route",
    "éducation routière",
    "conduite responsable",
    "IA",
    "auto-école",
    "permis de conduire",
  ],
  authors: [{ name: "ADSO Engineering" }],
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "ADSO — La responsabilité au service de la vie",
    description:
      "Apprendre, comprendre et agir pour une mobilité plus sûre. Chaque vie est précieuse.",
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
        <Providers>{children}</Providers>
        <Toaster />
        <AccessibilityZoom />
      </body>
    </html>
  );
}
