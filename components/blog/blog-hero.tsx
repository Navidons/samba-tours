import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"

const featuredPost = {
  id: 1,
  title: "The Ultimate Guide to Gorilla Trekking in Uganda: Everything You Need to Know",
  excerpt:
    "Discover the secrets of successful gorilla trekking in Bwindi Impenetrable Forest. From preparation tips to what to expect during your encounter with mountain gorillas.",
  image: "/placeholder.svg?height=600&width=1200",
  category: "Gorilla Trekking",
  author: "James Okello",
  date: "2024-03-20",
  readTime: "12 min read",
  featured: true,
  slug: "the-ultimate-guide-to-gorilla-trekking-in-uganda-everything-you-need-to-know",
}

export default function BlogHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featuredPost.image || "/placeholder.svg"}
          alt={featuredPost.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-4">
        <div className="max-w-4xl">
          <div className="mb-6">
            <Badge className="bg-forest-600 text-white text-sm px-4 py-2 mb-4">Featured Story</Badge>
            <Badge variant="secondary" className="ml-2">
              {featuredPost.category}
            </Badge>
          </div>

          <h1 className="text-4xl lg:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
            {featuredPost.title}
          </h1>

          <p className="text-xl text-gray-200 mb-8 max-w-3xl leading-relaxed">{featuredPost.excerpt}</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="flex items-center space-x-6 text-gray-300 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{featuredPost.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </div>

          <Button size="lg" className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-4" asChild>
            <Link href={`/blog/${featuredPost.id}`} className="flex items-center space-x-2">
              <span>Read Full Story</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
