import type { Metadata, Viewport } from "next";
import { Orbitron, Rajdhani, Bungee } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import { AppDataProvider } from "@/components/AppDataProvider";

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

const description =
  "RupeeMate is a private expense tracker for India. Log expenses in rupees, set monthly budgets and see where your money goes. Your data stays in your browser.";

export const metadata: Metadata = {
  title: {
    default: "RupeeMate - Expense Tracker",
    template: "%s | RupeeMate",
  },
  description,
  applicationName: "RupeeMate",
  openGraph: {
    title: "RupeeMate - Expense Tracker",
    description,
    siteName: "RupeeMate",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a1f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${bungee.variable} antialiased`}
      >
        <AppDataProvider>
          <AppLayout>{children}</AppLayout>
        </AppDataProvider>
      </body>
    </html>
  );
}
