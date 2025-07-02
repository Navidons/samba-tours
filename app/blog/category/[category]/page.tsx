import { Suspense } from "react"
import { notFound } from "next/navigation"
import BlogCategoryHeader from "@/components/blog/blog-category-header"
import BlogGrid from "@/components/blog/blog-grid"
import BlogSidebar from "@/components/blog/blog-sidebar"
import LoadingSpinner from "@/components/ui/loading-spinner"

const categories = {
  "gorilla-trekking": {
    name: "Gorilla Trekking",
    description: "Expert guides and insights for your gorilla trekking adventure in Uganda's pristine forests.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 28,
  },
  "wildlife-safari": {
    name: "Wildlife Safari",
    description: "Discover Uganda's incredible wildlife through our safari guides and photography tips.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 45,
  },
  "travel-planning": {
    name: "Travel Planning",
    description: "Essential tips and guides to help you plan the perfect Uganda adventure.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 32,
  },
  "travel-tips": {
    name: "Travel Tips",
    description: "Practical advice and insider tips for traveling in Uganda and East Africa.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 24,
  },
  culture: {
    name: "Culture & Heritage",
    description: "Explore Uganda's rich cultural heritage and learn about local traditions.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 24,
  },
  photography: {
    name: "Photography",
    description: "Capture stunning images of Uganda's wildlife and landscapes with expert tips.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 18,
  },
  adventure: {
    name: "Adventure Sports",
    description: "Thrilling adventure activities and extreme sports across Uganda's diverse landscapes.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 15,
  },
  conservation: {
    name: "Conservation",
    description: "Learn about wildlife conservation efforts and sustainable tourism in Uganda.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 12,
  },
  birdwatching: {
    name: "Birdwatching",
    description: "Discover Uganda's incredible avian diversity with over 1,000 bird species.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 16,
  },
  destinations: {
    name: "Destinations",
    description: "Explore Uganda's hidden gems and popular destinations with insider knowledge.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 22,
  },
  wildlife: {
    name: "Wildlife",
    description: "In-depth articles about Uganda's diverse wildlife and animal behavior.",
    image: "/placeholder.svg?height=400&width=1200",
    postCount: 38,
  },
}

export async function generateMetadata({ params }: { params: { category: string } }) {
  const category = categories[params.category as keyof typeof categories]

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} Articles | Samba Tours Blog`,
    description: category.description,
    openGraph: {
      title: `${category.name} Articles | Samba Tours Blog`,
      description: category.description,
      images: [category.image],
    },
  }
}

export default async function BlogCategoryPage({ params }: { params: { category: string } }) {
  const category = categories[params.category as keyof typeof categories]

  if (!category) {
    notFound()
  }

  return (
    <>
      <main className="min-h-screen bg-cream-50">
        <BlogCategoryHeader category={category} />

        <section className="section-padding">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-3">
                <Suspense fallback={<LoadingSpinner />}>
                  <BlogGrid categoryFilter={params.category} />
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
      </main>
    </>
  )
}
