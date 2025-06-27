"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark, Twitter, Facebook, Linkedin } from "lucide-react"
import { useRouter } from "next/navigation"

interface BlogPost {
  id: number
  title: string
  content: string
  tags: string[] | null
  likes: number
  slug?: string
  excerpt?: string | null
}

interface BlogPostContentProps {
  post: BlogPost
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const shareUrl = typeof window !== 'undefined'
    ? window.location.origin + '/blog/' + (post.slug || post.id)
    : ''
  const shareText = encodeURIComponent(post.title)
  const shareExcerpt = encodeURIComponent(post.excerpt || '')

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    let url = ''
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareText}&summary=${shareExcerpt}`
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
      {/* Article Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:font-playfair prose-headings:text-earth-900 prose-p:text-earth-700 prose-p:leading-relaxed prose-a:text-forest-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-earth-900 prose-ul:text-earth-700 prose-li:text-earth-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h4 className="font-semibold text-earth-900 mb-4">Tags:</h4>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="hover:bg-forest-100 cursor-pointer">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Social Actions */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Like ({post.likes})
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-earth-600 mr-3">Share:</span>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50" onClick={() => handleShare('twitter')}>
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-800 hover:bg-blue-50" onClick={() => handleShare('facebook')}>
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-blue-700 hover:bg-blue-50" onClick={() => handleShare('linkedin')}>
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
