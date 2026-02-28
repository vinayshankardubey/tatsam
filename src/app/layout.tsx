import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tatsam — Know Your Stars, Know Yourself",
  description:
    "Tatsam is India's premium astrology platform. Discover your birth chart, get personalized Vedic readings, and explore the cosmos — bridging ancient wisdom with modern clarity.",
  keywords: ["astrology", "kundali", "horoscope", "vedic astrology", "birth chart", "tatsam", "zodiac"],
  openGraph: {
    title: "Tatsam — Know Your Stars, Know Yourself",
    description: "India's premium astrology platform. Discover your birth chart and explore the cosmos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
