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
  title: "ADSO — Auto Drive School Online | La plateforme de conduite intelligente",
  description:
    "ADSO démocratise l'accès à la formation à la conduite automobile grâce à l'IA. Cours en ligne, AI Coach personnel, examens adaptatifs et certification mondiale.",
  keywords: [
    "ADSO",
    "Auto Drive School Online",
    "conduite",
    "code de la route",
    "école de conduite en ligne",
    "IA",
    "permis de conduire",
    "formation automobile",
  ],
  authors: [{ name: "ADSO Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "ADSO — Auto Drive School Online",
    description:
      "La première plateforme intelligente et mondiale dédiée à l'apprentissage de la conduite automobile.",
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
