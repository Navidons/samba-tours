import { type NextRequest, NextResponse } from "next/server"

// This would typically connect to a database or CMS
const blogPosts = [
  {
    id: 1,
    title: "The Ultimate Guide to Gorilla Trekking in Uganda: Everything You Need to Know",
    slug: "ultimate-guide-gorilla-trekking-uganda",
    excerpt:
      "Discover the secrets of successful gorilla trekking in Bwindi Impenetrable Forest. From preparation tips to what to expect during your encounter with mountain gorillas.",
    content: "Full content here...",
    image: "/placeholder.svg?height=600&width=1200",
    category: "Gorilla Trekking",
    author: "James Okello",
    date: "2024-03-20",
    readTime: "12 min read",
    views: 5600,
    likes: 234,
    tags: ["Gorilla Trekking", "Wildlife", "Conservation", "Uganda", "Bwindi"],
    featured: true,
    published: true,
  },
  // Add more posts here...
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const tag = searchParams.get("tag")
  const author = searchParams.get("author")
  const search = searchParams.get("search")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  let filteredPosts = blogPosts.filter((post) => post.published)

  // Apply filters
  if (category) {
    filteredPosts = filteredPosts.filter((post) => post.category.toLowerCase().replace(/\s+/g, "-") === category)
  }

  if (tag) {
    filteredPosts = filteredPosts.filter((post) => post.tags.some((t) => t.toLowerCase().replace(/\s+/g, "-") === tag))
  }

  if (author) {
    filteredPosts = filteredPosts.filter((post) => post.author.toLowerCase().replace(/\s+/g, "-") === author)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Apply pagination
  const paginatedPosts = filteredPosts.slice(offset, offset + limit)

  return NextResponse.json({
    posts: paginatedPosts,
    total: filteredPosts.length,
    hasMore: offset + limit < filteredPosts.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Here you would typically save to database
    console.log("New blog post:", data)

    return NextResponse.json({
      message: "Blog post created successfully",
      id: Date.now(),
    })
  } catch (error) {
    console.error("Blog post creation error:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
