import type { Metadata } from 'next'
import { Space_Grotesk, Inter, Newsreader } from 'next/font/google'
import '@/styles/globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-inter',
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-news',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Test de Arquetipos Masculinos',
  description:
    '12 preguntas. Tu verdad. Sin filtros. Descubre tu arquetipo masculino dominante.',
  icons: { icon: '/images/favicon.png' },
  openGraph: {
    title: 'Test de Arquetipos Masculinos',
    description: '12 preguntas. Tu verdad. Sin filtros.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${newsreader.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
