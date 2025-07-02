"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, Eye, Heart, Share2, ArrowLeft } from "lucide-react"
import { BlogPost } from "@/lib/blog"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"

interface BlogPostHeaderProps {
  post: BlogPost
}

export default function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const [likes, setLikes] = useState(post.likes)
  const [isLiking, setIsLiking] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Check if the user has already liked this post
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
    setHasLiked(likedPosts.includes(post.id))

    // Set up real-time subscription to blog post likes
    const channel = supabase
      .channel('blog_post_likes')
      .on(
        'postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'blog_posts',
          filter: `id=eq.${post.id}`
        },
        (payload) => {
          // Update likes when a change is detected
          if (payload.new.likes !== undefined) {
            setLikes(payload.new.likes)
          }
        }
      )
      .subscribe()

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [post.id, supabase])

  const handleLike = async () => {
    // Prevent multiple likes
    if (isLiking || hasLiked) return

    try {
      setIsLiking(true)

      // Call the RPC function to increment likes
      const { data, error } = await supabase.rpc('increment_blog_post_likes', { 
        blog_post_id: post.id 
      })

      if (error) {
        console.error('Supabase RPC Error:', error)
        toast.error("Failed to like the post", {
          description: error.message || "An unexpected error occurred"
        })
        setIsLiking(false)
        return
      }

      // Update local storage to prevent multiple likes
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]')
      likedPosts.push(post.id)
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))

      // Update the likes count
      setLikes(prevLikes => prevLikes + 1)
      setHasLiked(true)
      
      toast.success("Post liked!", {
        description: "Thank you for your support!"
      })
    } catch (error) {
      console.error('Unexpected error in handleLike:', error)
      toast.error("An unexpected error occurred", {
        description: "Please try again later"
      })
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = () => {
    const shareData = {
      title: post.title,
      text: post.excerpt || post.title,
      url: `${window.location.origin}/blog/${post.slug}`
    }

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => toast.success("Post shared successfully!"))
        .catch((error) => {
          console.error('Error sharing:', error)
          toast.error("Failed to share the post")
        })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareData.url)
      toast.success("Post link copied to clipboard")
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-forest-600 to-forest-700 text-white">
      {/* Background Image */}
      {post.thumbnail && (
        <div className="absolute inset-0">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover opacity-20"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative section-padding">
        <div className="container-max">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="outline" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
          </Link>
        </Button>
      </div>

          {/* Post Meta */}
          <div className="flex items-center gap-4 mb-6 text-forest-100">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Samba Tours</span>
      </div>
            <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.publish_date || post.created_at).toLocaleDateString()}
              </span>
                </div>
            {post.read_time && (
              <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                <span>{post.read_time}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.views || 0} views</span>
            </div>
                </div>

          {/* Title and Category */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-white/20 text-white border-white/30">
                {post.category?.name || 'Uncategorized'}
              </Badge>
              {post.featured && (
                <Badge className="bg-yellow-500 text-white">
                  Featured
                </Badge>
              )}
                </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-forest-100 leading-relaxed max-w-3xl">
                {post.excerpt}
              </p>
            )}
              </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
                <Button
              size="lg" 
              className={`
                ${hasLiked 
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                  : 'bg-white text-forest-700 hover:bg-gray-100'
                }
              `}
              onClick={handleLike}
              disabled={isLiking || hasLiked}
                >
              <Heart className={`h-5 w-5 mr-2 ${isLiking ? 'animate-pulse' : ''}`} />
              Like ({likes})
                </Button>
                <Button
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleShare}
                >
              <Share2 className="h-5 w-5 mr-2" />
              Share
                </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
