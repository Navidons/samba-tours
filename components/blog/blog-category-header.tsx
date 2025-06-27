import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen } from "lucide-react"

interface Category {
  name: string
  description: string
  image: string
  postCount: number
}

interface BlogCategoryHeaderProps {
  category: Category
}

export default function BlogCategoryHeader({ category }: BlogCategoryHeaderProps) {
  return (
    <header className="relative">
      {/* Back Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Button variant="secondary" size="sm" asChild className="bg-white/90 hover:bg-white">
          <Link href="/blog" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Blog</span>
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="container-max">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-forest-600 text-white flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Category</span>
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {category.postCount} Articles
              </Badge>
            </div>

            <h1 className="text-4xl lg:text-5xl font-playfair font-bold mb-6 leading-tight">{category.name}</h1>

            <p className="text-xl text-gray-200 max-w-3xl leading-relaxed">{category.description}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
