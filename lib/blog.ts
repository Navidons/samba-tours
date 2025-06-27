import { SupabaseClient } from "@supabase/supabase-js"

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  category_id: number
  category?: {
    id: number
    name: string
    slug: string
  }
  author_id: string // Assuming author is a user ID
  author?: {
    id: string
    name: string
  }
  status: "published" | "draft" | "scheduled" | "archived"
  publish_date: string | null
  views: number
  likes: number
  comments_count: number // Changed from 'comments' to 'comments_count' for clarity
  featured: boolean
  thumbnail: string | null
  created_at: string
  updated_at: string
  excerpt: string | null
  read_time: string | null
  tags: string[] | null
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  description: string | null
}

export async function getAllBlogPosts(supabase: SupabaseClient): Promise<BlogPost[]> {
  try {
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(id, name, slug),
        author:profiles(id, full_name)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching blog posts:", error)
      return []
    }

    return posts as BlogPost[] || []
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error)
    return []
  }
}

export async function getBlogPostBySlug(supabase: SupabaseClient, slug: string): Promise<BlogPost | null> {
  try {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(id, name, slug),
        author:profiles(id, full_name)
      `)
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching blog post by slug:", error)
      return null
    }

    return post as BlogPost
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error)
    return null
  }
}

export async function getBlogPost(supabase: SupabaseClient, id: string): Promise<BlogPost | null> {
  try {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(id, name, slug),
        author:profiles(id, full_name)
      `)
      .eq("id", parseInt(id))
      .single()

    if (error) {
      console.error("Error fetching blog post by ID:", error)
      return null
    }

    return post as BlogPost
  } catch (error) {
    console.error("Error in getBlogPost:", error)
    return null
  }
}

export async function getBlogCategories(supabase: SupabaseClient): Promise<BlogCategory[]> {
  try {
    const { data: categories, error } = await supabase
      .from("blog_categories")
      .select("*")

    if (error) {
      console.error("Error fetching blog categories:", error)
      return []
    }

    return categories as BlogCategory[]
  } catch (error) {
    console.error("Error in getBlogCategories:", error)
    return []
  }
}

export async function createBlogPost(supabase: SupabaseClient, postData: Partial<Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'views' | 'likes' | 'comments_count'>>): Promise<BlogPost | null> {
  try {
    const { data: post, error } = await supabase.from("blog_posts").insert([postData]).select().single()

    if (error) {
      console.error("Error creating blog post:", error.message, error.details)
      console.error("Post data:", postData)
      return null
    }

    return post as BlogPost
  } catch (error) {
    console.error("Error in createBlogPost:", error)
    return null
  }
}

export async function updateBlogPost(supabase: SupabaseClient, id: number, postData: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const { data: post, error } = await supabase.from("blog_posts").update(postData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating blog post:", error)
      return null
    }

    return post as BlogPost
  } catch (error) {
    console.error("Error in updateBlogPost:", error)
    return null
  }
}

export async function deleteBlogPost(supabase: SupabaseClient, id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting blog post:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteBlogPost:", error)
    return false
  }
}

export async function incrementBlogPostViews(supabase: SupabaseClient, postId: number): Promise<number | null> {
  try {
    const { data, error } = await supabase.rpc('increment_blog_post_views', { 
      blog_post_id: postId 
    })

    if (error) {
      console.error('Error incrementing blog post views:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Unexpected error in incrementBlogPostViews:', error)
    return null
  }
} 