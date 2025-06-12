import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CryptoGuard - Scam Detection Tool',
  description: 'Advanced cryptocurrency scam detection and token analysis platform with real-time risk assessment',
  keywords: 'crypto, scam detection, token analysis, blockchain security, risk assessment',
  authors: [{ name: 'CryptoGuard Team' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'CryptoGuard - Crypto Scam Detection Tool',
    description: 'Protect yourself from crypto scams with our advanced token analysis platform',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
