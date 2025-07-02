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
import { BlogPost, getAllBlogPosts, BlogCategory, getBlogCategories, subscribeToNewsletter } from "@/lib/blog"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { toast } from "@/components/ui/use-toast"

export default function BlogSidebar() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // Predefined color classes for categories
  const categoryColors = [
    { name: "Gorilla Trekking", color: "bg-forest-100 text-forest-800" },
    { name: "Wildlife Safari", color: "bg-yellow-100 text-yellow-800" },
    { name: "Travel Planning", color: "bg-blue-100 text-blue-800" },
    { name: "Culture", color: "bg-purple-100 text-purple-800" },
    { name: "Photography", color: "bg-pink-100 text-pink-800" },
    { name: "Conservation", color: "bg-green-100 text-green-800" },
    { name: "Destinations", color: "bg-teal-100 text-teal-800" },
    { name: "Wildlife", color: "bg-orange-100 text-orange-800" }
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [allPosts, allCategories] = await Promise.all([
          getAllBlogPosts(supabase),
          getBlogCategories(supabase)
        ])
        
        // Get recent published posts (last 3)
        const publishedPosts = allPosts.filter(post => post.status === 'published')
        const recentPosts = publishedPosts.slice(0, 3)
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

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      })
      return
    }

    setSubscriptionStatus('submitting')
    try {
      await subscribeToNewsletter(supabase, email)
      
      // Set success state
      setSubscriptionStatus('success')
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle')
        setEmail("")
      }, 3000)
    } catch (error) {
      // Log the full error for debugging
      console.error('Newsletter Signup Error:', error)

      setSubscriptionStatus('error')

      // Reset after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle')
      }, 3000)

      toast({
        title: "Subscription Error",
        description: error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Newsletter Signup */}
      <Card className="bg-forest-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Travel Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-forest-100 mb-4">
            Get expert travel tips and exclusive stories delivered to your inbox weekly.
          </p>
          <form onSubmit={handleNewsletterSignup} className="space-y-3">
            <Input
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                bg-white/10 border-white/20 text-white placeholder:text-white/60
                ${subscriptionStatus === 'success' ? 'border-green-500' : ''}
                ${subscriptionStatus === 'error' ? 'border-red-500' : ''}
              `}
              disabled={subscriptionStatus === 'submitting'}
            />
            <Button 
              type="submit" 
              className={`
                w-full bg-white text-forest-600 hover:bg-gray-100 
                transition-all duration-300 ease-in-out
                ${subscriptionStatus === 'success' ? 'bg-green-500 text-white' : ''}
                ${subscriptionStatus === 'error' ? 'bg-red-500 text-white' : ''}
              `}
              disabled={subscriptionStatus === 'submitting'}
            >
              {subscriptionStatus === 'idle' && "Subscribe Now"}
              {subscriptionStatus === 'submitting' && "Subscribing..."}
              {subscriptionStatus === 'success' && "Subscribed Successfully!"}
              {subscriptionStatus === 'error' && "Subscription Failed"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-forest-600" />
            <span>Recent Posts</span>
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
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h4>
                <div className="flex items-center space-x-2 text-xs text-earth-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>Samba Tours</span>
                    </div>
                    <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(post.publish_date || post.created_at).toLocaleDateString()}
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

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-forest-600" />
            <span>Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => {
              // Find the color for the current category
              const categoryColorObj = categoryColors.find(c => c.name === category.name)
              const categoryColor = categoryColorObj ? categoryColorObj.color : "bg-gray-100 text-gray-800"

              return (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors group"
                >
                  <span className="font-medium text-earth-900 group-hover:text-forest-600">{category.name}</span>
                  <Badge className={categoryColor}>{category.count}</Badge>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-forest-600" />
            <span>Popular Tags</span>
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


    </div>
  )
}
