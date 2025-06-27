import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Tag } from "lucide-react"

interface TagInfo {
  name: string
  description: string
  postCount: number
}

interface BlogTagHeaderProps {
  tag: TagInfo
}

export default function BlogTagHeader({ tag }: BlogTagHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-forest-600 to-forest-800 text-white">
      <div className="container-max px-4 py-16">
        <div className="flex items-center space-x-4 mb-6">
          <Button
            variant="secondary"
            size="sm"
            asChild
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Link href="/blog" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl">
          <div className="flex items-center space-x-3 mb-4">
            <Badge className="bg-white/20 text-white border-white/30 flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>Tag</span>
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {tag.postCount} Articles
            </Badge>
          </div>

          <h1 className="text-4xl lg:text-5xl font-playfair font-bold mb-6 leading-tight">{tag.name}</h1>

          <p className="text-xl text-forest-100 max-w-3xl leading-relaxed">{tag.description}</p>
        </div>
      </div>
    </header>
  )
}
