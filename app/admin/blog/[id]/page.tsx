"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Eye, Calendar, Clock, User, Tag, Eye as ViewsIcon, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase"
import { BlogPost, getBlogPost } from "@/lib/blog"

export default function AdminBlogPostView() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const params = useParams()

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  const postId = typeof params.id === 'string' ? params.id : null;

  useEffect(() => {
    if (!postId) {
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        setLoading(true)
        const postData = await getBlogPost(supabase, postId)
        setPost(postData)
      } catch (error) {
        console.error('Error loading blog post:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPost()
  }, [postId, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner />
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="section-padding">
          <div className="container-max">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-earth-900 mb-4">Post Not Found</h1>
              <Button asChild>
                <Link href="/admin/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/admin/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-earth-900">Blog Post Preview</h1>
                <p className="text-earth-600">View and manage your blog post</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/admin/blog/${post.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  View Public
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Post Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-earth-900 mb-2">{post.title}</h2>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                        {post.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                      </div>
                      {post.excerpt && (
                        <p className="text-earth-600 text-lg leading-relaxed">{post.excerpt}</p>
                      )}
                    </div>
                  </div>

                  {/* Post Meta */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-earth-600 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author?.name || 'Unknown Author'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {post.publish_date ? new Date(post.publish_date).toLocaleDateString() : "Not published"}
                      </span>
                    </div>
                    {post.read_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{post.read_time}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <ViewsIcon className="h-4 w-4" />
                      <span>{post.views || 0} views</span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {post.thumbnail && (
                    <div className="mb-6">
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Post Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-earth-600">Category</p>
                    <p className="text-earth-900">{post.category?.name || 'Uncategorized'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-earth-600">Slug</p>
                    <p className="text-earth-900 font-mono text-sm">{post.slug}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-earth-600">Created</p>
                    <p className="text-earth-900">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-earth-600">Last Updated</p>
                    <p className="text-earth-900">{new Date(post.updated_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ViewsIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Views</span>
                    </div>
                    <span className="font-semibold">{post.views || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Likes</span>
                    </div>
                    <span className="font-semibold">{post.likes || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Comments</span>
                    </div>
                    <span className="font-semibold">{post.comments_count || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/admin/blog/${post.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Post
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      View Public
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 