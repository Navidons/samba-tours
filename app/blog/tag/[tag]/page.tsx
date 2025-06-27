import { Suspense } from "react"
import { notFound } from "next/navigation"
import BlogTagHeader from "@/components/blog/blog-tag-header"
import BlogGrid from "@/components/blog/blog-grid"
import BlogSidebar from "@/components/blog/blog-sidebar"
import LoadingSpinner from "@/components/ui/loading-spinner"

const tags = {
  safari: {
    name: "Safari",
    description: "Everything about safari experiences in Uganda's national parks and wildlife reserves.",
    postCount: 45,
  },
  gorillas: {
    name: "Gorillas",
    description: "Mountain gorilla trekking guides, conservation stories, and behavioral insights.",
    postCount: 32,
  },
  wildlife: {
    name: "Wildlife",
    description: "Uganda's diverse wildlife species, behavior, and conservation efforts.",
    postCount: 58,
  },
  photography: {
    name: "Photography",
    description: "Wildlife and landscape photography tips for your Uganda adventure.",
    postCount: 28,
  },
  culture: {
    name: "Culture",
    description: "Ugandan cultural traditions, customs, and community experiences.",
    postCount: 24,
  },
  adventure: {
    name: "Adventure",
    description: "Thrilling adventure activities and extreme sports in Uganda.",
    postCount: 19,
  },
  conservation: {
    name: "Conservation",
    description: "Wildlife conservation efforts and sustainable tourism practices.",
    postCount: 16,
  },
  "travel-tips": {
    name: "Travel Tips",
    description: "Practical advice and tips for traveling in Uganda.",
    postCount: 42,
  },
  uganda: {
    name: "Uganda",
    description: "General information about Uganda as a travel destination.",
    postCount: 78,
  },
  "east-africa": {
    name: "East Africa",
    description: "Regional travel information and cross-border adventures.",
    postCount: 22,
  },
  "national-parks": {
    name: "National Parks",
    description: "Guides to Uganda's national parks and protected areas.",
    postCount: 35,
  },
  birdwatching: {
    name: "Birdwatching",
    description: "Bird species guides and birdwatching locations in Uganda.",
    postCount: 18,
  },
}

export async function generateMetadata({ params }: { params: { tag: string } }) {
  const tag = tags[params.tag as keyof typeof tags]

  if (!tag) {
    return {
      title: "Tag Not Found",
    }
  }

  return {
    title: `${tag.name} Articles | Samba Tours Blog`,
    description: tag.description,
  }
}

export default async function BlogTagPage({ params }: { params: { tag: string } }) {
  const tag = tags[params.tag as keyof typeof tags]

  if (!tag) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <BlogTagHeader tag={tag} />

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              <Suspense fallback={<LoadingSpinner />}>
                <BlogGrid tagFilter={params.tag} />
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
  )
}
