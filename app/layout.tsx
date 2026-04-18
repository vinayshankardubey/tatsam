import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tatsam — Vedic Astrology & Numerology Readings',
  description: 'Personalised Vedic astrology and numerology reports crafted by seasoned acharyas. Birth charts, compatibility, life-path numbers, and guided remedies — delivered with care.',
  generator: 'Tatsam',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
