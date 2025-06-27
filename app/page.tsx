import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/home/hero-section"
import FeaturedTours from "@/components/home/featured-tours"
import AboutPreview from "@/components/home/about-preview"
import TestimonialsPreview from "@/components/home/testimonials-preview"
import NewsletterSignup from "@/components/home/newsletter-signup"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroSection />

        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedTours />
        </Suspense>

        <AboutPreview />

        <Suspense fallback={<LoadingSpinner />}>
          <TestimonialsPreview />
        </Suspense>

        <NewsletterSignup />
      </main>
      <Footer />
    </>
  )
}
