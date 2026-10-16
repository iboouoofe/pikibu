import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Pikibu',
    default: 'Pikibu — Anne & Bebek Gelişim Asistanı',
  },
  description:
    'Bebeğinizin uyku, beslenme, bez ve gelişim takibini akıllıca yapın. Atak haftaları, ek gıda rehberi ve aşı takvimi tek uygulamada.',
  keywords: ['bebek takip', 'anne uygulaması', 'bebek gelişim', 'atak haftaları', 'ek gıda', 'wonder weeks'],
  authors: [{ name: 'Pikibu' }],
  creator: 'Pikibu',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pikibu',
  },
  openGraph: {
    title: 'Pikibu — Anne & Bebek Gelişim Asistanı',
    description: 'Bebeğinizin uyku, beslenme ve gelişimini akıllıca takip edin.',
    type: 'website',
    locale: 'tr_TR',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F5F7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* iOS Safari touch & click responsiveness enhancer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('touchstart', function(){}, {passive: true});`
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
