import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import { createServerClient } from "@/lib/supabase"
import { getRelatedBlogPosts } from "@/lib/blog"
import type { BlogPost } from "@/lib/blog"

interface RelatedPostsProps {
  currentPost: BlogPost
}

export default async function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const supabase = createServerClient()
  const relatedPosts = await getRelatedBlogPosts(supabase, currentPost)

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="heading-secondary">You Might Also Like</h2>
          <p className="text-lg text-earth-600">More expert insights and stories from our Uganda travel specialists</p>
        </div>

        {relatedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((post: BlogPost) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-forest-600 text-white">
                      {post.category?.name || "Uncategorized"}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-earth-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author?.name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.read_time || "5 min read"}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-earth-900 mb-3 group-hover:text-forest-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-earth-700 mb-4 line-clamp-3">{post.excerpt || "No excerpt available"}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-earth-500">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {post.publish_date 
                          ? new Date(post.publish_date).toLocaleDateString() 
                          : "Recent"}
                      </span>
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
        ) : (
          <div className="text-center text-earth-600 py-8">
            <p>No related posts found at the moment.</p>
            <p className="text-sm mt-2">Check back later or explore our other blog posts.</p>
          </div>
        )}
      </div>
    </section>
  )
}
