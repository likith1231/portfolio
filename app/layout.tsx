import type { Metadata, Viewport } from "next";
import { Chakra_Petch, Cinzel, Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";
import { profile } from "@/data/portfolio";

const display = Chakra_Petch({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// Doom's regal serif, used for headings and accents in the Doom universe.
const doomFont = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-doom" });
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
    <html lang="en" data-mode="stark" suppressHydrationWarning className={`${display.variable} ${inter.variable} ${mono.variable} ${serif.variable} ${doomFont.variable}`}>
      <head>
        {/* Apply the saved universe before first paint, so Doom visitors never see a red flash. */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("hud-mode")==="doom")document.documentElement.dataset.mode="doom"}catch(e){}` }} />
      </head>
      <body className="workshop-glow font-sans">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
