import { Suspense } from "react"
import type { Metadata } from "next"
import BlogHero from "@/components/blog/blog-hero"
import BlogGrid from "@/components/blog/blog-grid"
import BlogSidebar from "@/components/blog/blog-sidebar"
import FeaturedPosts from "@/components/blog/featured-posts"
import NewsletterCTA from "@/components/blog/newsletter-cta"
import LoadingSpinner from "@/components/ui/loading-spinner"

export const metadata: Metadata = {
  title: "Uganda Travel Blog - Samba Tours & Travel",
  description: "Discover Uganda through our travel blog. Read about wildlife encounters, cultural experiences, travel tips, and conservation stories from our expert guides.",
  keywords: "uganda travel blog, safari stories, gorilla trekking blog, wildlife photography, travel tips uganda, conservation stories",
}

export default function BlogPage() {
  return (
    <>
        <BlogHero />

      <div className="section-padding">
        <div className="container-max">
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedPosts />
        </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
            <div className="lg:col-span-2">
              <Suspense fallback={<LoadingSpinner />}>
                <BlogGrid />
              </Suspense>
            </div>
            
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
      
      <NewsletterCTA />
    </>
  )
} 