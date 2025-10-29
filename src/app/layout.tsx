import type { Metadata } from 'next'
import './globals.css'

import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { AppProvider } from '@/contexts/AppProvider'

export const metadata: Metadata = {
  title: {
    default: 'No More Failures',
    template: '%s | No More Failures',
  },
  icons: {
    icon: `../../icon.ico`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      lang="en"
    >
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
