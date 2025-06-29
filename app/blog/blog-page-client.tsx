"use client"

import { useState } from "react"
import { BlogCategory } from "@/lib/blog"
import BlogFilters from "@/components/blog/blog-filters"
import BlogGrid from "@/components/blog/blog-grid"
import BlogSidebar from "@/components/blog/blog-sidebar"
import NewsletterCTA from "@/components/blog/newsletter-cta"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface BlogPageClientProps {
  initialCategories: BlogCategory[]
}

export default function BlogPageClient({ initialCategories }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | number>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "trending" | "oldest">("latest")

  return (
    <section className="section-padding">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <BlogFilters 
              categories={initialCategories} 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            <BlogGrid 
              categoryFilter={activeCategory.toString()} 
              searchTerm={searchTerm}
              sortBy={sortBy}
            />
          </div>

          <div className="lg:col-span-1">
            <BlogSidebar />
          </div>
        </div>
      </div>

      <NewsletterCTA />
    </section>
  )
} 