"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { getAllBlogPosts } from "@/lib/blog"
import type { BlogPost } from "@/lib/blog"

export default function BlogHero() {
  const [heroPost, setHeroPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHeroPost = async () => {
      try {
        const supabase = createClient()
        const allPosts = await getAllBlogPosts(supabase)
        
        if (allPosts.length === 0) {
          setHeroPost(null)
          return
        }

        // Filter published posts only
        const publishedPosts = allPosts.filter(post => post.status === 'published')
        
        if (publishedPosts.length === 0) {
          setHeroPost(null)
          return
        }

        // First try to get featured posts
        const featuredPosts = publishedPosts.filter(post => post.featured)
        
        let selectedPost: BlogPost
        
        if (featuredPosts.length > 0) {
          // Pick a random featured post
          const randomIndex = Math.floor(Math.random() * featuredPosts.length)
          selectedPost = featuredPosts[randomIndex]
        } else {
          // Pick a random published post
          const randomIndex = Math.floor(Math.random() * publishedPosts.length)
          selectedPost = publishedPosts[randomIndex]
        }
        
        setHeroPost(selectedPost)
      } catch (error) {
        console.error('Error loading hero post:', error)
        setHeroPost(null)
      } finally {
        setLoading(false)
      }
    }

    loadHeroPost()
  }, [])

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-earth-900">
        <div className="absolute inset-0 bg-gradient-to-r from-earth-900 to-forest-900" />
        <div className="relative z-10 container-max px-4">
          <div className="max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="flex space-x-2">
                <div className="h-8 w-24 bg-gray-300 rounded"></div>
                <div className="h-8 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="h-16 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>
              <div className="flex space-x-6">
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
              </div>
              <div className="h-12 w-40 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // No posts available
  if (!heroPost) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-earth-900 to-forest-900" />
        <div className="relative z-10 container-max px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-playfair font-bold text-white mb-6">
            Uganda Travel Blog
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Discover expert insights, travel tips, and amazing stories from Uganda's premier destinations.
          </p>
        </div>
      </section>
    )
  }

  // Format author name
  const authorName = heroPost.author?.name || 'Samba Tours'
  
  // Format date
  const publishDate = heroPost.publish_date || heroPost.created_at
  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Format read time
  const readTime = heroPost.read_time || `${Math.ceil((heroPost.content?.length || 1000) / 1000 * 4)} min read`

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroPost.thumbnail || "/placeholder.svg?height=600&width=1200"}
          alt={heroPost.title}
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
            {heroPost.featured && (
              <Badge className="bg-forest-600 text-white text-sm px-4 py-2 mb-4">
                Featured Stories
              </Badge>
            )}
            {heroPost.category?.name && (
              <Badge variant="secondary" className={heroPost.featured ? "ml-2" : ""}>
                {heroPost.category.name}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl lg:text-6xl font-playfair font-bold text-white mb-6 leading-tight">
            {heroPost.title}
          </h1>

          <p className="text-xl text-gray-200 mb-8 max-w-3xl leading-relaxed">
            {heroPost.excerpt || `${heroPost.content?.substring(0, 150)}...` || "Discover amazing insights about Uganda travel and tourism."}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="flex items-center space-x-6 text-gray-300 mb-4 sm:mb-0">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{readTime}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-forest-600 hover:bg-forest-700 text-white px-8 py-4" asChild>
              <Link href={`/blog/${heroPost.slug}`} className="flex items-center space-x-2">
                <span>Read Full Story</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className="flex items-center space-x-4 text-gray-300 text-sm">
              <div className="flex items-center space-x-1">
                <span>👁️</span>
                <span>{heroPost.views || 0} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>❤️</span>
                <span>{heroPost.likes || 0} likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
