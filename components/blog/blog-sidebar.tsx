"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Calendar, Mail, Tag, BookOpen, Star, Search, Filter, User, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { BlogPost, getAllBlogPosts, BlogCategory, getBlogCategories } from "@/lib/blog"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function BlogSidebar() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [allPosts, allCategories] = await Promise.all([
          getAllBlogPosts(supabase),
          getBlogCategories(supabase)
        ])
        
        // Get recent posts (last 3)
        const recentPosts = allPosts.slice(0, 3)
        setPosts(recentPosts)
        setCategories(allCategories)
      } catch (error) {
        console.error('Error loading sidebar data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <input
              type="text"
              placeholder="Search blog posts..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
            />
            <Button size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-earth-700">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {/* You could add post count here if needed */}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex gap-3 group">
                <div className="w-16 h-16 flex-shrink-0">
                <Image
                    src={post.thumbnail || "/placeholder.svg"}
                  alt={post.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-earth-900 group-hover:text-forest-600 transition-colors line-clamp-2 mb-1">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h4>
                <div className="flex items-center space-x-2 text-xs text-earth-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{post.author?.name || 'Unknown Author'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                      <span>
                        {post.publish_date ? new Date(post.publish_date).toLocaleDateString() : 'Not published'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-earth-500 mt-1">
                    <Eye className="h-3 w-3" />
                    <span>{post.views || 0} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {posts.flatMap(post => post.tags || []).slice(0, 10).map((tag, index) => (
              <Link key={index} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}>
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-forest-50">
                {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-forest-600 to-forest-700 text-white">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
          <p className="text-forest-100 text-sm mb-4">
            Get the latest travel stories and tips delivered to your inbox
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 rounded-lg text-earth-900 placeholder-earth-500"
            />
            <Button className="w-full bg-white text-forest-700 hover:bg-gray-100">
              Subscribe
            </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
