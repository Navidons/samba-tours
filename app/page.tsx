import { Suspense } from "react"
import type { Metadata } from "next"
import HeroSection from "@/components/home/hero-section"
import FeaturedTours from "@/components/home/featured-tours"
import AboutPreview from "@/components/home/about-preview"
import TestimonialsPreview from "@/components/home/testimonials-preview"
import NewsletterSignup from "@/components/home/newsletter-signup"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { generateSEOMetadata, PAGE_SEO, generateBusinessSchema } from "@/lib/seo"
import { StructuredData } from "@/components/seo/structured-data"

// Generate metadata for homepage
export const metadata: Metadata = generateSEOMetadata({
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
  keywords: PAGE_SEO.home.keywords,
  path: "/",
})

export default function HomePage() {
  // Generate business structured data
  const businessSchema = generateBusinessSchema()

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={businessSchema} />
      
      <HeroSection />

      <Suspense fallback={<LoadingSpinner />}>
        <FeaturedTours />
      </Suspense>

      <AboutPreview />

      <Suspense fallback={<LoadingSpinner />}>
        <TestimonialsPreview />
      </Suspense>

      <NewsletterSignup />
    </>
  )
}
