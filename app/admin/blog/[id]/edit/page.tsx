"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient, uploadImageToSupabase } from "@/lib/supabase"
import { BlogPost, BlogCategory, getBlogCategories, getBlogPost, updateBlogPost } from "@/lib/blog"
import RichTextEditor from "@/components/ui/rich-text-editor"
import { useToast } from "@/components/ui/use-toast"

export default function EditBlogPost() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const params = useParams()
  const { toast } = useToast()

  const postId = typeof params.id === 'string' ? params.id : null;

  const [post, setPost] = useState<BlogPost | null>(null)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category_id: 1,
    status: "draft" as "draft" | "published" | "scheduled" | "archived",
    featured: false,
    thumbnail: "",
    read_time: "",
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (!postId) {
      console.log("postId not resolved yet. Waiting...");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      console.log("loadData initiated for postId:", postId);

      const parsedId = parseInt(postId);
      if (!postId || isNaN(parsedId)) {
        console.error("Invalid blog post ID detected in useEffect:", postId, "Parsed ID:", parsedId);
        setLoading(false);
        setPost(null);
        return;
      }
      console.log("Validated postId for fetch:", postId);

      try {
        setLoading(true)
        
        // Load categories
        console.log("Fetching categories...");
        const categoriesData = await getBlogCategories(supabase)
        setCategories(categoriesData)
        console.log("Categories fetched:", categoriesData);
        
        // Load post data: getBlogPost expects string ID
        console.log("Calling getBlogPost with ID:", postId);
        const postData = await getBlogPost(supabase, postId)
        console.log("Blog post data fetched:", postData);

        if (postData) {
          setPost(postData)
          setFormData({
            title: postData.title || "",
            slug: postData.slug || "",
            content: postData.content || "",
            excerpt: postData.excerpt || "",
            category_id: postData.category_id || 1,
            status: postData.status || "draft",
            featured: postData.featured || false,
            thumbnail: postData.thumbnail || "",
            read_time: postData.read_time || "",
            tags: postData.tags || [],
          })
        } else {
          console.log("No post found for ID:", postId);
          setPost(null);
        }
      } catch (error) {
        console.error('Error loading data in useEffect:', error)
        setPost(null);
      } finally {
        setLoading(false)
        console.log("Loading finished. Loading state:", false);
      }
    }
    
    loadData()
  }, [postId, supabase])

  const handleSave = async () => {
    console.log("handleSave initiated.");
    let currentPostId: number;
    let currentPostIdParam: string | undefined = postId || undefined;
    currentPostId = parseInt(postId || '');

    if (!currentPostIdParam || isNaN(currentPostId)) {
        console.error("Invalid post ID for saving:", currentPostIdParam, "Parsed ID:", currentPostId);
        return;
    }

    try {
      setSaving(true)
      
      // updateBlogPost expects number ID
      console.log("Calling updateBlogPost with ID (number):", currentPostId);
      const updatedPost = await updateBlogPost(supabase, currentPostId, {
        ...formData,
        updated_at: new Date().toISOString(),
      })
      
      if (updatedPost) {
        console.log("Post updated successfully:", updatedPost);
        router.push('/admin/blog')
      } else {
        console.error("Failed to update post: No data returned.", updatedPost);
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setSaving(false)
      console.log("Saving finished. Saving state:", false);
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSaving(true);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = `blog_thumbnails/${fileName}`;

    const publicUrl = await uploadImageToSupabase(file, 'gallery', filePath);

    if (publicUrl) {
      setFormData(prev => ({ ...prev, thumbnail: publicUrl }));
      toast({
        title: "Image Uploaded",
        description: "Thumbnail image uploaded successfully.",
      });
    } else {
      toast({
        title: "Upload Failed",
        description: "Failed to upload thumbnail image.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnail: "" }));
    toast({
      title: "Thumbnail Removed",
      description: "Thumbnail image has been removed.",
    });
  };

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
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-earth-900">Edit Blog Post</h1>
                <p className="text-earth-600">Update your blog post content and settings</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-forest-600 hover:bg-forest-700">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Slug */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter post title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <div className="flex gap-2">
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="post-url-slug"
                      />
                      <Button variant="outline" onClick={generateSlug}>Generate</Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="Brief description of the post"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(newContent) => setFormData(prev => ({ ...prev, content: newContent }))}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category_id.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: parseInt(value) }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Featured Post</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    {formData.thumbnail && (
                      <div className="mb-2 relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={formData.thumbnail}
                          alt="Thumbnail Preview"
                          layout="fill"
                          objectFit="contain"
                          className="p-2"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeThumbnail}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                      className="mb-2"
                    />
                    <input
                      type="file"
                      id="thumbnail-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <label
                      htmlFor="thumbnail-upload"
                      className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                    >
                      Upload Image
                    </label>
                  </div>

                  <div>
                    <Label htmlFor="read_time">Read Time</Label>
                    <Input
                      id="read_time"
                      value={formData.read_time}
                      onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
                      placeholder="5 min read"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button variant="outline" onClick={addTag}>Add</Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 