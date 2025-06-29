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
  count?: number  // Make count optional
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
    // First, get all blog posts to count categories
    const { data: posts, error: postsError } = await supabase
      .from("blog_posts")
      .select("category_id")

    if (postsError) {
      console.error("Error fetching blog posts for category count:", postsError)
      return []
    }

    // Count posts per category
    const categoryPostCounts = posts.reduce((acc, post) => {
      if (post.category_id) {
        acc[post.category_id] = (acc[post.category_id] || 0) + 1
      }
      return acc
    }, {} as Record<number, number>)

    // Now fetch categories with their counts
    const { data: categories, error } = await supabase
      .from("blog_categories")
      .select("*")

    if (error) {
      console.error("Error fetching blog categories:", error)
      return []
    }

    // Attach post count to each category
    const categoriesWithCounts = categories.map(category => ({
      ...category,
      count: categoryPostCounts[category.id] || 0
    }))

    return categoriesWithCounts as BlogCategory[]
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

export async function getRelatedBlogPosts(
  supabase: SupabaseClient, 
  currentPost: BlogPost, 
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    console.log('Current Post Details:', {
      id: currentPost.id,
      category_id: currentPost.category_id,
      tags: currentPost.tags
    })

    // Prepare the tags condition
    const tagsCondition = currentPost.tags && currentPost.tags.length > 0 
      ? `tags.cs.{${currentPost.tags.join(',')}}` 
      : 'true'

    // Fetch related posts based on category or tags
    const { data: relatedPosts, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        category:blog_categories(id, name, slug),
        author:profiles(id, full_name)
      `)
      .neq("id", currentPost.id) // Exclude current post
      .or(`category_id.eq.${currentPost.category_id},${tagsCondition}`)
      .order("created_at", { ascending: false })
      .limit(limit)

    console.log('Related Posts Query:', {
      category_id: currentPost.category_id,
      tags: currentPost.tags,
      error: error,
      posts_count: relatedPosts?.length || 0
    })

    if (error) {
      console.error("Error fetching related blog posts:", error)
      return []
    }

    return relatedPosts as BlogPost[] || []
  } catch (error) {
    console.error("Error in getRelatedBlogPosts:", error)
    return []
  }
}

export async function subscribeToNewsletter(
  supabase: SupabaseClient, 
  email: string, 
  source: string = 'blog_sidebar',
  metadata: Record<string, any> = {}
) {
  // Validate email
  if (!isValidEmail(email)) {
    throw new Error('Invalid email address');
  }

  try {
    // Attempt to insert the email
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { 
          email: email.toLowerCase().trim(), 
          source, 
          metadata,
          is_active: true 
        },
        { 
          onConflict: 'email',
          ignoreDuplicates: true 
        }
      )
      .select();

    if (error) {
      // More detailed error logging
      console.error('Newsletter Subscription Error:', {
        code: error.code,
        message: error.message,
        details: error.details
      });

      // Check if it's a unique constraint violation (already subscribed)
      if (error.code === '23505') {
        throw new Error('This email is already subscribed');
      }

      // Check for permission-related errors
      if (error.code === 'PGRST116' || error.message.includes('permission denied')) {
        throw new Error('Unable to subscribe due to system configuration. Please try again later.');
      }

      throw error;
    }

    return data;
  } catch (error) {
    // Catch any unexpected errors
    console.error('Unexpected error in newsletter subscription:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred while subscribing');
  }
}

// Email validation helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
} 