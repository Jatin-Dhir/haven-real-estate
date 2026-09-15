import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Lora } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/content/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { MotionRoot } from "@/components/providers/MotionRoot";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-instrument-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
  openGraph: { title: site.meta.title, description: site.meta.description, type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${lora.variable}`}>
      <body>
        <MotionRoot />
        <SmoothScroll>
          <ModalProvider>
            <Header brand={site.brand} nav={site.nav} />
            {children}
            <Footer brand={site.brand} data={site.footer} />
          </ModalProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
