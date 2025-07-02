"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Calendar, User } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { getAllBlogPosts } from "@/lib/blog"
import type { BlogPost } from "@/lib/blog"

interface Category {
  name: string
  description: string
  image: string
  postCount: number
}

interface BlogCategoryHeaderProps {
  category: Category
}

export default function BlogCategoryHeader({ category }: BlogCategoryHeaderProps) {
  const [categoryPosts, setCategoryPosts] = useState<BlogPost[]>([])
  const [heroImage, setHeroImage] = useState<string>("")
  const [actualPostCount, setActualPostCount] = useState<number>(0)
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const supabase = createClient()
        const allPosts = await getAllBlogPosts(supabase)
        
        // Filter posts by category (match category name or slug)
        const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')
        const categoryName = category.name.toLowerCase()
        
        const filteredPosts = allPosts.filter(post => {
          if (!post.category) return false
          const postCategoryName = post.category.name.toLowerCase()
          const postCategorySlug = post.category.slug.toLowerCase()
          
          return postCategoryName.includes(categoryName) || 
                 postCategorySlug.includes(categorySlug) ||
                 categoryName.includes(postCategoryName) ||
                 categorySlug.includes(postCategorySlug)
        }).filter(post => post.status === 'published')

        setCategoryPosts(filteredPosts)
        setActualPostCount(filteredPosts.length)
        
        // Set hero image from a random post with thumbnail, or use featured post
        const postsWithImages = filteredPosts.filter(post => post.thumbnail)
        
        if (postsWithImages.length > 0) {
          // Try to get a featured post first
          const featuredPosts = postsWithImages.filter(post => post.featured)
          let selectedPost: BlogPost
          
          if (featuredPosts.length > 0) {
            selectedPost = featuredPosts[Math.floor(Math.random() * featuredPosts.length)]
            setFeaturedPost(selectedPost)
          } else {
            selectedPost = postsWithImages[Math.floor(Math.random() * postsWithImages.length)]
            setFeaturedPost(selectedPost)
          }
          
          setHeroImage(selectedPost.thumbnail || category.image)
        } else {
          setHeroImage(category.image)
        }
      } catch (error) {
        console.error('Error loading category data:', error)
        setHeroImage(category.image)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryData()
  }, [category])

  return (
    <header className="relative">
      {/* Back Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Button variant="secondary" size="sm" asChild className="bg-white/90 hover:bg-white">
          <Link href="/blog" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        {loading ? (
          <div className="w-full h-full bg-gradient-to-r from-earth-900 to-forest-900 animate-pulse" />
        ) : (
          <Image 
            src={heroImage || "/placeholder.svg?height=400&width=1200"} 
            alt={category.name} 
            fill 
            className="object-cover" 
            priority 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="container-max">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-forest-600 text-white flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Category</span>
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {loading ? '...' : actualPostCount} Articles
              </Badge>
              {featuredPost && (
                <Badge variant="secondary" className="bg-forest-600/80 text-white border-forest-400/50">
                  Featured Content
                </Badge>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-playfair font-bold mb-6 leading-tight">
              {category.name}
            </h1>

            <p className="text-xl text-gray-200 max-w-3xl leading-relaxed mb-6">
              {category.description}
            </p>

            {/* Featured Post Info */}
            {featuredPost && !loading && (
              <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 max-w-2xl">
                <div className="flex items-center space-x-4 text-gray-300 text-sm mb-2">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{featuredPost.author?.name || 'Samba Tours'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(featuredPost.publish_date || featuredPost.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {featuredPost.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-400 text-xs">
                    <span>👁️ {featuredPost.views || 0} views</span>
                    <span>❤️ {featuredPost.likes || 0} likes</span>
                  </div>
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      Read Article
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
