import { Suspense } from "react"
import HeroSection from "@/components/home/hero-section"
import FeaturedTours from "@/components/home/featured-tours"
import AboutPreview from "@/components/home/about-preview"
import TestimonialsPreview from "@/components/home/testimonials-preview"
import NewsletterSignup from "@/components/home/newsletter-signup"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function HomePage() {
  return (
    <>
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
