import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, MapPin, BookOpen } from "lucide-react"
import { createServerClient } from "@/lib/supabase"
import { BlogPost } from "@/lib/blog"
import { getToursByCategory as getToursByCategoryFunc, Tour } from "@/lib/tours"

interface BlogPostSidebarProps {
  post: BlogPost
}

export default async function BlogPostSidebar({ post }: BlogPostSidebarProps) {
  const supabase = createServerClient()
  
  // Fetch related tours based on blog post category
  const relatedTours: Tour[] = post.category_id 
    ? await getToursByCategoryFunc(supabase, post.category_id, 2) 
    : []

  // Extract headings from blog post content for table of contents
  const headingRegex = /<h[2-4][^>]*>(.*?)<\/h[2-4]>/g
  const headings = (post.content?.match(headingRegex) || []).map(heading => {
    const textMatch = heading.match(/>([^<]+)</);
    const text = textMatch ? textMatch[1] : '';
    const id = text.toLowerCase().replace(/\s+/g, '-');
    return { text, id };
  });

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
                alt="Samba Tours"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-earth-900">Samba Tours</h4>
              <p className="text-sm text-forest-600 mb-2">
                {post.category?.name ? `${post.category.name} Specialist` : 'Travel Expert'}
              </p>
              <p className="text-sm text-earth-700">
                Expert travel guides with deep knowledge of Uganda's wildlife, culture, and sustainable tourism practices.
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
          {relatedTours.length > 0 ? (
            <>
              {relatedTours.map((tour: Tour) => (
                <div key={tour.id} className="flex space-x-3 group">
                  <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={tour.featured_image || "/placeholder.svg"}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-earth-900 group-hover:text-forest-600 transition-colors line-clamp-2 mb-1">
                      <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
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
            </>
          ) : (
            <p className="text-sm text-earth-600 text-center">
              No related tours available at the moment.
            </p>
          )}
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
          {headings.length > 0 ? (
            <nav className="space-y-2 text-sm">
              {headings.map((heading) => (
                <Link
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="block text-earth-700 hover:text-forest-600 transition-colors"
                >
                  {heading.text}
                </Link>
              ))}
            </nav>
          ) : (
            <p className="text-sm text-earth-600 text-center">
              No table of contents available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
