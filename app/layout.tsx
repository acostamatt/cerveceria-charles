import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import GsapInit from "@/components/GsapInit";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CHARLES. — Craft Beer & Burgers (Rosario)",
  description:
    "Cervezas vivas sin filtrar, tiradas desde el tanque de maduración a tu copa de hierro. Sin atajos, sin concesiones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${inter.variable} scroll-smooth`}
    >
      <body className="industrial-noise selection:bg-brand-copper selection:text-brand-black min-h-screen flex flex-col antialiased">
        <GsapInit />
        {children}
      </body>
    </html>
  );
}
