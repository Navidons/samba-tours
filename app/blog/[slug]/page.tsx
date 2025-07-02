import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import BlogPostHeader from "@/components/blog/blog-post-header"
import BlogPostContent from "@/components/blog/blog-post-content"
import BlogPostSidebar from "@/components/blog/blog-post-sidebar"
import RelatedPosts from "@/components/blog/related-posts"
import BlogComments from "@/components/blog/blog-comments"
import NewsletterCTA from "@/components/blog/newsletter-cta"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase"
import { getBlogPost, getBlogPostBySlug, incrementBlogPostViews } from "@/lib/blog"
import { generateSEOMetadata, generateBlogPostSchema } from "@/lib/seo"
import { StructuredData } from "@/components/seo/structured-data"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = createClient()
  let post = null;

  // Check if slug is a number (implies it's an ID)
  if (!isNaN(Number(slug))) {
    post = await getBlogPost(supabase, slug); // getBlogPost expects string ID
  } else {
    post = await getBlogPostBySlug(supabase, slug);
  }

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const keywords = [
    "Uganda Travel",
    "Safari Tips",
    "Travel Blog",
    post.category || "Tourism",
    ...(post.tags || []).map((tag: any) => typeof tag === 'string' ? tag : tag.name || tag.slug)
  ]

  return generateSEOMetadata({
    title: `${post.title} | Uganda Travel Blog - Samba Tours`,
    description: post.excerpt || post.title,
    keywords,
    path: `/blog/${slug}`,
    image: post.thumbnail || '/placeholder.svg',
    type: "article",
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    author: typeof post.author === 'string' ? post.author : post.author?.name || "Samba Tours Team"
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createClient()
  let post = null;

  // Check if slug is a number (implies it's an ID)
  if (!isNaN(Number(slug))) {
    post = await getBlogPost(supabase, slug); // getBlogPost expects string ID
  } else {
    post = await getBlogPostBySlug(supabase, slug);
  }

  if (!post) {
    notFound()
  }

  // Increment views
  await incrementBlogPostViews(supabase, post.id)

  // Generate blog post structured data
  const blogSchema = generateBlogPostSchema({
    title: post.title,
    description: post.excerpt || post.title,
    author: typeof post.author === 'string' ? post.author : post.author?.name || "Samba Tours Team",
    publishedTime: post.created_at,
    modifiedTime: post.updated_at,
    image: post.thumbnail || undefined,
    url: `/blog/${slug}`
  })

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={blogSchema} />
      
      <main className="min-h-screen bg-cream-50">
        <BlogPostHeader post={post} />

        <section className="section-padding">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-3">
                <BlogPostContent post={post} />

                <Suspense fallback={<LoadingSpinner />}>
                  <BlogComments postId={post.id} />
                </Suspense>
              </div>

              <div className="lg:col-span-1">
                <Suspense fallback={<LoadingSpinner />}>
                  <BlogPostSidebar post={post} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<LoadingSpinner />}>
          <RelatedPosts currentPost={post} />
        </Suspense>
      </main>
    </>
  )
} 