import { Suspense } from "react"
import Footer from "@/components/layout/footer"
import BlogPostHeader from "@/components/blog/blog-post-header"
import BlogPostContent from "@/components/blog/blog-post-content"
import BlogPostSidebar from "@/components/blog/blog-post-sidebar"
import RelatedPosts from "@/components/blog/related-posts"
import BlogComments from "@/components/blog/blog-comments"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createServerClient } from "@/lib/supabase"
import { getBlogPost, getBlogPostBySlug, incrementBlogPostViews } from "@/lib/blog"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient()
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

  return {
    title: `${post.title} | Samba Tours Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.thumbnail || '/placeholder.svg'],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createServerClient()
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

  return (
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
  )
} 