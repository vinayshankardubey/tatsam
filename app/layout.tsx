import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tatsam — Ask the Scriptures. Receive Clear Answers.',
  description: 'Ask your questions — about your chart, your numbers, your life — and receive grounded answers drawn from the Bhagavad Gita, the Upanishads, Vedic samhitas and classical astrological texts.',
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
