"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, Eye, Heart, Share2, BookOpen, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { BlogPost, getAllBlogPosts } from "@/lib/blog"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface BlogGridProps {
  categoryFilter?: string
  tagFilter?: string
  authorFilter?: string
  searchTerm?: string
  sortBy?: "latest" | "popular" | "trending" | "oldest"
}

export default function BlogGrid({ 
  categoryFilter, 
  tagFilter, 
  authorFilter, 
  searchTerm = "", 
  sortBy = "latest" 
}: BlogGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        const allPosts = await getAllBlogPosts(supabase)
        setPosts(allPosts)
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPosts()
  }, [supabase])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    // First filter to only show published posts
    let result = posts.filter(post => post.status === 'published')

    // Category filter
    if (categoryFilter && categoryFilter !== "all") {
      result = result.filter((post) => {
        if (!post.category) return false
        
        // Check if categoryFilter is a number (ID) or string (slug)
        const filterAsNumber = parseInt(categoryFilter as string)
        if (!isNaN(filterAsNumber)) {
          // Filter by ID
          return post.category.id === filterAsNumber
        } else {
          // Filter by slug or name
          const categorySlug = post.category.slug?.toLowerCase()
          const categoryName = post.category.name?.toLowerCase()
          const filterSlug = (categoryFilter as string).toLowerCase()
          
          return categorySlug === filterSlug || 
                 categoryName === filterSlug ||
                 categoryName?.replace(/\s+/g, '-') === filterSlug ||
                 categorySlug?.includes(filterSlug) ||
                 filterSlug.includes(categorySlug || '')
        }
      })
    }

    // Tag filter
    if (tagFilter) {
      result = result.filter((post) =>
        post.tags?.some((tag) => tag.toLowerCase().replace(/\s+/g, "-") === tagFilter),
      )
    }

    // Author filter
    if (authorFilter) {
      result = result.filter((post) => 
        post.author?.name?.toLowerCase().replace(/\s+/g, "-") === authorFilter
      )
    }

    // Search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase()
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTermLower) ||
        post.excerpt?.toLowerCase().includes(searchTermLower) ||
        post.category?.name.toLowerCase().includes(searchTermLower)
      )
    }

    // Sorting
    switch (sortBy) {
      case "latest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case "popular":
        result.sort((a, b) => (b.views || 0) - (a.views || 0))
        break
      case "trending":
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
    }

    return result
  }, [posts, categoryFilter, tagFilter, authorFilter, searchTerm, sortBy])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-earth-600">Showing {filteredPosts.length} articles</p>
        <div className="flex items-center space-x-2 text-sm text-earth-600">
          <BookOpen className="h-4 w-4" />
          <span>Latest insights from our experts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={post.thumbnail || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <Badge className="bg-forest-600 text-white">{post.category?.name || 'Uncategorized'}</Badge>
                {post.featured && <Badge className="bg-yellow-500 text-white">Featured Stories</Badge>}
              </div>

              {/* Hover overlay with quick actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex space-x-3">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      <BookOpen className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm text-earth-600 mb-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Samba Tours</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.publish_date || post.created_at).toLocaleDateString()}
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

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3} more
                    </Badge>
                  )}
              </div>
              )}

              {/* Engagement stats */}
              <div className="flex items-center space-x-4 text-sm text-earth-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes || 0}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" asChild className="text-forest-600 hover:text-forest-700">
                <Link href={`/blog/${post.slug}`} className="flex items-center space-x-1">
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-earth-600 text-lg">No blog posts found.</p>
        </div>
      )}

      {/* Load More */}
      {filteredPosts.length > 0 && (
      <div className="text-center pt-8">
        <Button size="lg" variant="outline" className="px-8">
          Load More Articles
        </Button>
      </div>
      )}
    </div>
  )
}
