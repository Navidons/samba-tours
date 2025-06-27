import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"

interface BlogPost {
  category?: {
    id: number
    name: string
    slug: string
  }
  tags: string[] | null
  slug: string
}

interface RelatedPostsProps {
  currentPost: BlogPost
}

const relatedPosts = [
  {
    id: 14,
    title: "Preparing for Your First Gorilla Trek: A Beginner's Checklist",
    excerpt: "Essential preparation tips for first-time gorilla trekkers to ensure a safe and memorable experience.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Gorilla Trekking",
    author: "Grace Nakato",
    date: "2024-03-18",
    readTime: "8 min read",
    slug: "preparing-for-your-first-gorilla-trek-a-beginners-checklist",
  },
  {
    id: 15,
    title: "Wildlife Photography in Uganda: Pro Tips and Techniques",
    excerpt: "Master the art of wildlife photography with expert tips from our professional safari guides.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Photography",
    author: "Robert Tumusiime",
    date: "2024-03-16",
    readTime: "10 min read",
    slug: "wildlife-photography-in-uganda-pro-tips-and-techniques",
  },
  {
    id: 16,
    title: "Conservation Success Stories: How Tourism Saves Gorillas",
    excerpt: "Discover how responsible tourism is making a real difference in gorilla conservation efforts.",
    image: "/placeholder.svg?height=300&width=400",
    category: "Conservation",
    author: "Mary Atuhaire",
    date: "2024-03-14",
    readTime: "12 min read",
    slug: "conservation-success-stories-how-tourism-saves-gorillas",
  },
]

export default function RelatedPosts({ currentPost }: RelatedPostsProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="heading-secondary">You Might Also Like</h2>
          <p className="text-lg text-earth-600">More expert insights and stories from our Uganda travel specialists</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-forest-600 text-white">{post.category}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center space-x-4 text-sm text-earth-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-earth-900 mb-3 group-hover:text-forest-600 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-earth-700 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-earth-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center space-x-1 text-forest-600 hover:text-forest-700 font-medium text-sm transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
