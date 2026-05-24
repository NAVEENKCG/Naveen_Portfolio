import type { Metadata } from 'next'
import { DM_Sans, Space_Mono, Syne } from 'next/font/google'
import './globals.css'
import { CustomCursor } from '@/components/ui/Cursor'
import { Grain } from '@/components/ui/Grain'
import { LenisProvider } from '@/components/scroll/LenisProvider'
import { Preloader } from '@/components/ui/Preloader'
import { ScrollProgress } from '@/components/ui/ScrollProgress'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
  preload: true,
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Naveenraj S.S. | Electronics & Communication Engineer · Embedded Systems & PCB Designer',
  description:
    '2nd-year ECE student with hands-on experience in embedded systems and PCB design. Designed PCBs from schematic to Gerber output using KiCad and Altium. Developed IoT and AI-based embedded projects using ESP32, Embedded C, and TensorFlow Lite.',
  openGraph: {
    title: 'Naveenraj S.S. | ECE Engineer · Embedded Systems & PCB Designer',
    description: 'Portfolio of Naveenraj S.S. — Electronics & Communication Engineer specializing in embedded systems, PCB design, IoT, and AI/ML.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${spaceMono.variable} ${syne.variable}`}
    >
      <head>
        {/* Preconnect to font CDNs for faster LCP */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --font-syne: 'Syne', system-ui, sans-serif;
                --font-clash-display: 'Clash Display', system-ui, sans-serif;
                --font-cormorant: 'Cormorant Garamond', serif;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${dmSans.className} bg-base text-text-primary antialiased`}
        suppressHydrationWarning
      >
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        <Preloader />
        <ScrollProgress />
        <CustomCursor />
        <Grain />
        <LenisProvider>
          <main id="main">{children}</main>
        </LenisProvider>
      </body>
    </html>
  )
}
