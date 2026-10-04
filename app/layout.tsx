import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";
import { profile } from "@/data/portfolio";

const display = Chakra_Petch({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: `${profile.name} · Hall of Armor`,
  description: `${profile.headline} ${profile.role}. Based in ${profile.location}.`,
  openGraph: {
    title: `${profile.name} · Hall of Armor`,
    description: profile.headline,
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#030304" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="stealth" className={`${display.variable} ${inter.variable} ${mono.variable} ${serif.variable}`}>
      <body className="noise font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
