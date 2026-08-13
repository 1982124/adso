import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ADSO — Auto Drive School Online",
  description:
    "La plateforme internationale d'apprentissage de la mobilité, de la conduite et de la sécurité routière.",
  keywords: [
    "ADSO",
    "Auto Drive School Online",
    "mobilité",
    "conduite automobile",
    "permis de conduire",
    "sécurité routière",
    "formation en ligne",
    "IA",
    "code de la route",
    "quiz",
    "auto-école",
  ],
  authors: [{ name: "ADSO Engineering" }],
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "ADSO — Auto Drive School Online",
    description:
      "Apprendre la mobilité et la conduite avec une expérience internationale, personnalisée et immersive.",
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
      <body className="antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
