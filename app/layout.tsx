import type { Metadata } from "next"
import "./globals.css"
import { Inter, Playfair_Display } from "next/font/google"
import { generateSEOMetadata, PAGE_SEO } from "@/lib/seo"
import ClientLayout from "@/app/client-layout"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

// Generate metadata for root layout
export const metadata: Metadata = generateSEOMetadata({
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  keywords: PAGE_SEO.home.keywords,
  path: "/",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        {/* Additional meta tags for performance and SEO */}
        <meta name="theme-color" content="#8B4513" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/playfair.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//ixlosyntdfezomjbjbsn.supabase.co" />
      </head>
      <body className="font-inter bg-cream-50 text-earth-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
