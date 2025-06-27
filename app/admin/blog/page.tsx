"use client"

import { Suspense, useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar } from "lucide-react"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase"
import { getAllBlogPosts, BlogPost } from "@/lib/blog"

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

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const supabase = useMemo(() => createClient(), []);

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

  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    if (filterStatus !== "all") {
      filtered = filtered.filter(post => post.status === filterStatus)
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.category?.name.toLowerCase().includes(query) ||
        post.author?.name.toLowerCase().includes(query) ||
        post.excerpt?.toLowerCase().includes(query) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return filtered
  }, [posts, filterStatus, searchTerm])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-earth-900 mb-2">Blog Management</h1>
              <p className="text-earth-600">Manage blog posts and content</p>
            </div>
            <Button asChild className="bg-forest-600 hover:bg-forest-700">
              <Link href="/admin/blog/new">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-earth-900">{posts.length}</div>
                <p className="text-sm text-earth-600">Total Posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{posts.filter(p => p.status === 'published').length}</div>
                <p className="text-sm text-earth-600">Published</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-yellow-600">{posts.filter(p => p.status === 'draft').length}</div>
                <p className="text-sm text-earth-600">Drafts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{posts.reduce((sum, post) => sum + (post.views || 0), 0)}</div>
                <p className="text-sm text-earth-600">Total Views</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search posts..."
                      className="pl-10"
                      value={searchTerm ?? ""}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select onValueChange={setFilterStatus} value={filterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
            <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="w-full lg:w-32 h-20 lg:h-24">
                        <img
                          src={post.thumbnail || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-earth-900">{post.title}</h3>
                              {post.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                            </div>
                            <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/blog/${post.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/blog/${post.id}/edit`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {post.excerpt && <p className="text-sm text-earth-700 mb-4 line-clamp-2">{post.excerpt}</p>}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-earth-600">
                          <div>
                            <p className="font-medium">Category</p>
                            <p>{post.category?.name || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="font-medium">Author</p>
                            <p>{post.author?.name || 'N/A'}</p>
                          </div>
                          {post.read_time && (
                            <div>
                              <p className="font-medium">Read Time</p>
                              <p>{post.read_time}</p>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">Published</p>
                            <p className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {post.publish_date ? new Date(post.publish_date).toLocaleDateString() : "Not published"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Engagement</p>
                            <p>
                              {post.views} views • {post.comments_count} comments
                            </p>
                          </div>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium mb-2">Tags</p>
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-lg text-earth-600">No blog posts found.</p>
            )}
            </div>

          {/* Pagination - Placeholder for now */}
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-forest-600 text-white" disabled>
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
