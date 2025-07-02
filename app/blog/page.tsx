import { Suspense } from "react"
import type { Metadata } from "next"
import BlogHero from "@/components/blog/blog-hero"
import BlogGrid from "@/components/blog/blog-grid"
import BlogSidebar from "@/components/blog/blog-sidebar"
import FeaturedPosts from "@/components/blog/featured-posts"
import NewsletterCTA from "@/components/blog/newsletter-cta"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { generateSEOMetadata, PAGE_SEO } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
  keywords: PAGE_SEO.blog.keywords,
  path: "/blog",
})

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