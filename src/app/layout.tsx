import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Outfit, VT323, Space_Grotesk, Press_Start_2P } from "next/font/google";
import "./globals.css";
import "../styles/cursor.css";
import SmoothScroller from "@/components/Layout/SmoothScroller";
import { I18nProvider } from "@/components/I18nProvider";
import { AudioManagerProvider } from "@/components/AudioManager";
import { TransitionProvider } from "@/components/TransitionManager";
import TopNavbar from "@/components/TopNavbar";
import CustomCursor from "@/components/CustomCursor";
import CinematicOverlay from "@/components/CinematicOverlay";
import { EvolutionProvider } from "@/components/Timeline/EvolutionEngine";
import { CursorProvider } from "@/contexts/CursorContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const vt323 = VT323({ weight: '400', variable: "--font-terminal", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-future", subsets: ["latin"] });
const pressStart2P = Press_Start_2P({ weight: '400', variable: "--font-arcade", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ORYVON — The Dimensional Archive",
  description: "An interactive portal through time, civilizations, and the evolution of worlds.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ORYVON",
  },
  themeColor: "#000000",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} ${vt323.variable} ${spaceGrotesk.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <head>
        {/* Preload critical hero assets */}
        <link rel="preload" href="/Images/oryndor_symbol.png" as="image" />
      </head>
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white/30">
        <div className="noise-overlay" aria-hidden="true" />
        <div className="scanline-overlay" aria-hidden="true" />
        <CursorProvider>
          <I18nProvider>
            <AudioManagerProvider>
              <TransitionProvider>
                <EvolutionProvider>
                  <SmoothScroller>
                    {children}
                  </SmoothScroller>

                  <TopNavbar />

                <CinematicOverlay />
                <CustomCursor />
                



              </EvolutionProvider>
            </TransitionProvider>
          </AudioManagerProvider>
        </I18nProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
