import type { Metadata } from "next";
import { Orbitron, Rajdhani, Bungee } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

// 🎮 CYBERPUNK FONT: Futuristic tech headings
const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

// 🌆 SYNTHWAVE FONT: Sleek body text
const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// 🕹️ RETRO ARCADE FONT: Bold accents
const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "RupeeMate - Cyberpunk Expense Tracker",
  description: "Track your expenses in style with synthwave aesthetics",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${bungee.variable} antialiased`}
      >
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
