import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Bebas_Neue } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geek-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-rock-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fuyuan Li — Geek by day, Rock by night",
  description:
    "AI hacker & builder with a rock 'n' roll side. WAND, Seen It, PaperBook, and a drum kit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${spaceGrotesk.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden">{children}</body>
    </html>
  );
}
