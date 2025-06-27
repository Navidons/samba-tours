import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, MapPin, BookOpen } from "lucide-react"
import { BlogPost } from "@/lib/blog"

interface BlogPostSidebarProps {
  post: BlogPost
}

const relatedTours = [
  {
    id: 1,
    title: "Gorilla Trekking Adventure",
    image: "/placeholder.svg?height=200&width=300",
    price: 1200,
    duration: "3 Days",
  },
  {
    id: 2,
    title: "Bwindi Forest Experience",
    image: "/placeholder.svg?height=200&width=300",
    price: 950,
    duration: "2 Days",
  },
]

export default function BlogPostSidebar({ post }: BlogPostSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Author Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-forest-600" />
            <span>About the Author</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/placeholder-user.jpg"
                alt={post.author?.name || 'Author'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-earth-900">{post.author?.name || 'Unknown Author'}</h4>
              <p className="text-sm text-forest-600 mb-2">Travel Expert</p>
              <p className="text-sm text-earth-700">
                Experienced travel guide with deep knowledge of Uganda's wildlife and culture.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Tours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-forest-600" />
            <span>Related Tours</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relatedTours.map((tour) => (
            <div key={tour.id} className="flex space-x-3 group">
              <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={tour.image || "/placeholder.svg"}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-earth-900 group-hover:text-forest-600 transition-colors line-clamp-2 mb-1">
                  <Link href={`/tours/${tour.id}`}>{tour.title}</Link>
                </h4>
                <div className="flex items-center justify-between text-xs text-earth-600">
                  <span>{tour.duration}</span>
                  <span className="font-semibold text-forest-600">${tour.price}</span>
                </div>
              </div>
            </div>
          ))}
          <Button className="w-full btn-primary" size="sm" asChild>
            <Link href="/tours">View All Tours</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Table of Contents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-forest-600" />
            <span>In This Article</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2 text-sm">
            <Link
              href="#what-makes-uganda-special"
              className="block text-earth-700 hover:text-forest-600 transition-colors"
            >
              What Makes Uganda Special?
            </Link>
            <Link href="#best-time-to-visit" className="block text-earth-700 hover:text-forest-600 transition-colors">
              Best Time to Visit
            </Link>
            <Link href="#what-to-expect" className="block text-earth-700 hover:text-forest-600 transition-colors">
              What to Expect During Your Trek
            </Link>
            <Link href="#preparation-tips" className="block text-earth-700 hover:text-forest-600 transition-colors">
              Essential Preparation Tips
            </Link>
            <Link href="#conservation-impact" className="block text-earth-700 hover:text-forest-600 transition-colors">
              Conservation Impact
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}
