"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, Eye, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { BlogPost, getAllBlogPosts } from "@/lib/blog"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function FeaturedPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await getAllBlogPosts(supabase)
        // Filter for featured posts and take the first 3
        const featuredPosts = allPosts.filter(post => post.featured).slice(0, 3)
        setPosts(featuredPosts)
      } catch (error) {
        console.error('Error loading featured posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPosts()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-gradient-to-br from-forest-50 to-cream-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-earth-900 mb-4">Featured Stories</h2>
          <p className="text-lg text-earth-600 max-w-2xl mx-auto">
            Discover our most popular and insightful articles about Uganda's wildlife, culture, and adventures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.thumbnail || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <Badge className="bg-forest-600 text-white">{post.category?.name || 'Uncategorized'}</Badge>
                  <Badge className="bg-yellow-500 text-white flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Featured
                    </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between text-sm text-earth-600 mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author?.name || 'Unknown Author'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {post.publish_date ? new Date(post.publish_date).toLocaleDateString() : 'Not published'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.read_time || '5 min read'}</span>
                  </div>
                </div>

                <h3 className="font-bold text-xl text-earth-900 mb-3 group-hover:text-forest-600 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-earth-700 mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-earth-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views || 0}</span>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" asChild className="text-forest-600 hover:text-forest-700">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
