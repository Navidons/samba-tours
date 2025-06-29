"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Plus, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase"
import { BlogPost, createBlogPost, getBlogCategories, BlogCategory } from "@/lib/blog"
import { DatePicker } from "@/components/ui/date-picker"
import { format } from "date-fns"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Badge } from "@/components/ui/badge"

const FORM_CACHE_KEY = 'new_blog_post_draft'

export default function NewBlogPost() {
  console.log("NewBlogPost component is rendering now."); // Debugging log updated

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = useMemo(() => createClient(), []);

  const [formData, setFormData] = useState<Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments_count' | 'author' | 'category'>>> ({
    title: "",
    content: "",
    category_id: undefined,
    status: "draft",
    publish_date: null,
    featured: false,
    thumbnail: null,
    slug: "",
    excerpt: "",
    read_time: "",
    tags: [],
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null)

  // State for new category/location inputs
  const [newCategoryName, setNewCategoryName] = useState<string>("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [currentTagInput, setCurrentTagInput] = useState("");

  // Load cached form data on component mount and fetch categories
  useEffect(() => {
    const cachedFormData = localStorage.getItem(FORM_CACHE_KEY)
    if (cachedFormData) {
      try {
        const parsedData = JSON.parse(cachedFormData);
        setFormData((prev) => ({
          ...prev,
          ...parsedData,
          // Ensure numbers are numbers, booleans are booleans, strings are strings
          category_id: typeof parsedData.category_id === 'number' ? parsedData.category_id : undefined,
          featured: typeof parsedData.featured === 'boolean' ? parsedData.featured : false,
          publish_date: parsedData.publish_date ? parsedData.publish_date : null,
          title: typeof parsedData.title === 'string' ? parsedData.title : "",
          content: typeof parsedData.content === 'string' ? parsedData.content : "",
          slug: typeof parsedData.slug === 'string' ? parsedData.slug : "",
          excerpt: typeof parsedData.excerpt === 'string' ? parsedData.excerpt : "",
          read_time: typeof parsedData.read_time === 'string' ? parsedData.read_time : "",
          tags: Array.isArray(parsedData.tags) ? parsedData.tags : [],
        }));
      } catch (error) {
        console.error("Error parsing cached form data:", error)
      }
    }

    const fetchCategories = async () => {
      try {
        setLoading(true)
        const fetchedCategories = await getBlogCategories(supabase)
        setCategories(fetchedCategories)
        if (fetchedCategories.length === 0) {
          toast.warning("No blog categories found. Please add categories first.")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [supabase])

  // Cache form data whenever it changes
  useEffect(() => {
    localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(formData))
  }, [formData])

  // Generate slug when title changes
  useEffect(() => {
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim(),
      }));
    } else {
      setFormData((prev) => ({ ...prev, slug: "" }));
    }
  }, [formData.title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    if (id === "category_id") {
      if (value === "add-new") {
        setShowNewCategoryInput(true)
        setFormData((prev) => ({ ...prev, category_id: undefined }))
      } else {
        setShowNewCategoryInput(false)
        setFormData((prev) => ({ ...prev, category_id: parseInt(value) }))
      }
    } else if (id === "status") {
      setFormData((prev) => ({ ...prev, status: value as BlogPost['status'] }))
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreviewUrl(URL.createObjectURL(file))
    } else {
      setThumbnailFile(null)
      setThumbnailPreviewUrl(null)
    }
  }

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("New category name cannot be empty.")
      return
    }

    setSaving(true)
    try {
      const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-')
      const { data: existingCategory } = await supabase.from("blog_categories").select("id").eq("slug", slug).single()

      if (existingCategory) {
        toast.warning("Category already exists.")
        setFormData((prev) => ({ ...prev, category_id: existingCategory.id }))
      } else {
        const { data, error } = await supabase.from("blog_categories").insert([{ name: newCategoryName, slug }]).select("id, name, slug").single()
        if (error) throw error
        setCategories((prev) => [...prev, data])
        setFormData((prev) => ({ ...prev, category_id: data.id }))
        toast.success(`Category \"${data.name}\" added successfully.`)
      }
      setShowNewCategoryInput(false)
      setNewCategoryName("")
    } catch (error: any) {
      console.error("Error adding new category:", error)
      toast.error(`Failed to add category: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTagInput.trim() !== '') {
      e.preventDefault(); // Prevent form submission
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), currentTagInput.trim()]
      }));
      setCurrentTagInput(''); // Clear the input field
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formData.title || !formData.content || formData.category_id === undefined || !formData.slug) {
      toast.error("Please fill in all required fields (Title, Content, Category).")
      return
    }

    setSaving(true)
    let thumbnailUrl = formData.thumbnail

    try {
      // 1. Upload thumbnail if a new one is selected
      if (thumbnailFile) {
        const filePath = `blog_thumbnails/${formData.slug}-${Date.now()}.${thumbnailFile.name.split('.').pop()}`;
        const { data, error } = await supabase.storage.from('gallery').upload(filePath, thumbnailFile, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) {
          console.error("Error uploading thumbnail:", error);
          toast.error(`Failed to upload thumbnail: ${error.message}`);
          setSaving(false);
          return;
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filePath);
        thumbnailUrl = publicUrlData.publicUrl;
      }

      // 2. Create blog post in database
      const { data: user } = await supabase.auth.getUser()
      const authorId = user?.user?.id

      if (!authorId) {
        toast.error("You must be logged in to create a blog post. Please log in and try again.");
        setSaving(false);
        return;
      }

      const postToCreate = {
        ...formData,
        category_id: formData.category_id as number,
        author_id: authorId,
        thumbnail: thumbnailUrl,
        publish_date: formData.publish_date ? format(new Date(formData.publish_date), 'yyyy-MM-dd') : null,
        tags: formData.tags && formData.tags.length > 0 ? formData.tags : null,
        // Other fields like views, likes, comments_count will be defaulted in DB or handled separately
      }

      const newPost = await createBlogPost(supabase, postToCreate as any)

      if (!newPost) {
        throw new Error("Failed to create blog post in database.")
      }

      toast.success("Blog post created successfully!")
      localStorage.removeItem(FORM_CACHE_KEY)
      router.push("/admin/blog")
    } catch (error: any) {
      console.error("Error creating blog post:", error)
      toast.error(`Failed to create blog post: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

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
          <div className="flex items-center justify-between gap-4 mb-8">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog Management
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-earth-900">Create New Blog Post</h1>
            <div className="w-auto"></div> { /* Spacer */ }
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={formData.title || ''} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={formData.slug || ''} onChange={handleChange} readOnly title="Slug is auto-generated from Title" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea id="excerpt" value={formData.excerpt || ''} onChange={handleChange} required rows={3} placeholder="A short summary of the blog post" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" value={formData.content || ''} onChange={handleChange} required rows={10} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Category</Label>
                    <Select onValueChange={(value) => handleSelectChange("category_id", value)} value={formData.category_id?.toString() || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="add-new">+ Add New Category</SelectItem>
                      </SelectContent>
                    </Select>
                    {showNewCategoryInput && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="New category name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddCustomCategory} disabled={saving}>
                          Add
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="read_time">Read Time</Label>
                    <Input id="read_time" value={formData.read_time || ''} onChange={handleChange} placeholder="e.g., 5 min read" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (Press Enter to add)</Label>
                  <Input
                    id="tags"
                    placeholder="Add tags (e.g., adventure, wildlife)"
                    value={currentTagInput}
                    onChange={(e) => setCurrentTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags && formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto px-1 py-0.5 text-xs"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          x
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select onValueChange={(value) => handleSelectChange("status", value)} value={formData.status || 'draft'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publish_date">Publish Date (Optional)</Label>
                    <DatePicker
                      date={formData.publish_date ? new Date(formData.publish_date) : undefined}
                      setDate={(date) => setFormData(prev => ({ ...prev, publish_date: date ? format(date, 'yyyy-MM-dd') : null }))}
                    />
                  </div>
                </div>

                <div className="space-y-2 flex items-end">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: Boolean(checked) }))}
                    />
                    <Label htmlFor="featured">Featured Post</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail Image</Label>
                  <div className="flex items-center space-x-4">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Thumbnail
                    </Button>
                    <Input
                      id="thumbnail"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    {thumbnailPreviewUrl && (
                      <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                        <img src={thumbnailPreviewUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {!thumbnailPreviewUrl && formData.thumbnail && (
                      <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                        <img src={formData.thumbnail} alt="Existing Thumbnail" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" className="bg-forest-600 hover:bg-forest-700" disabled={saving}>
                {saving ? "Creating..." : "Create Blog Post"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 
