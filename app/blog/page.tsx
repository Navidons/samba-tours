import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase"
import { getBlogCategories } from "@/lib/blog"
import BlogPageClient from "./blog-page-client"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import BlogHero from "@/components/blog/blog-hero"
import FeaturedPosts from "@/components/blog/featured-posts"
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

export default async function BlogPage() {
  const supabase = createServerClient()
  const categories = await getBlogCategories(supabase)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50">
        <BlogHero />

        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedPosts />
        </Suspense>

        <BlogPageClient initialCategories={categories} />
      </main>
      <Footer />
    </>
  )
} 