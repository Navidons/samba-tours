import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import BlogHero from "@/components/blog/blog-hero"
import FeaturedPosts from "@/components/blog/featured-posts"
import BlogFilters from "@/components/blog/blog-filters"
import BlogGrid from "@/components/blog/blog-grid"
import BlogSidebar from "@/components/blog/blog-sidebar"
import NewsletterCTA from "@/components/blog/newsletter-cta"
import LoadingSpinner from "@/components/ui/loading-spinner"

export const metadata = {
  title: "Travel Blog - Uganda Tours & Safari Stories | Samba Tours",
  description:
    "Discover Uganda through our travel blog. Read expert guides, safari stories, cultural insights, and travel tips from our experienced guides and travelers.",
  keywords:
    "Uganda travel blog, safari stories, gorilla trekking guide, travel tips Uganda, East Africa travel, wildlife photography",
  openGraph: {
    title: "Travel Blog - Uganda Tours & Safari Stories | Samba Tours",
    description: "Discover Uganda through our travel blog with expert guides and authentic safari stories.",
    images: ["/images/blog-hero.jpg"],
  },
}

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50">
        <BlogHero />

        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedPosts />
        </Suspense>

        <section className="section-padding">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-3">
                <Suspense fallback={<LoadingSpinner />}>
                  <BlogFilters />
                </Suspense>

                <Suspense fallback={<LoadingSpinner />}>
                  <BlogGrid />
                </Suspense>
              </div>

              <div className="lg:col-span-1">
                <Suspense fallback={<LoadingSpinner />}>
                  <BlogSidebar />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        <NewsletterCTA />
      </main>
      <Footer />
    </>
  )
} 