import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Calendar, Award, Twitter, Instagram, Linkedin, Facebook, Youtube } from "lucide-react"

interface Author {
  name: string
  role: string
  image: string
  bio: string
  expertise: string[]
  experience: string
  postCount: number
  social?: {
    twitter?: string
    instagram?: string
    linkedin?: string
    facebook?: string
    youtube?: string
  }
}

interface BlogAuthorHeaderProps {
  author: Author
}

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case "twitter":
      return Twitter
    case "instagram":
      return Instagram
    case "linkedin":
      return Linkedin
    case "facebook":
      return Facebook
    case "youtube":
      return Youtube
    default:
      return User
  }
}

export default function BlogAuthorHeader({ author }: BlogAuthorHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container-max px-4 py-12">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link href="/blog" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <div className="relative w-48 h-48 mx-auto lg:mx-0 rounded-full overflow-hidden mb-6">
              <Image src={author.image || "/placeholder.svg"} alt={author.name} fill className="object-cover" />
            </div>

            {/* Social Links */}
            {author.social && (
              <div className="flex justify-center lg:justify-start space-x-3 mb-6">
                {Object.entries(author.social).map(([platform, handle]) => {
                  const Icon = getSocialIcon(platform)
                  return (
                    <Button key={platform} variant="outline" size="sm" className="w-10 h-10 p-0" asChild>
                      <a
                        href={`https://${platform}.com/${handle.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                <Badge className="bg-forest-600 text-white flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Author</span>
                </Badge>
                <Badge variant="secondary">{author.postCount} Articles</Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl font-playfair font-bold mb-2 text-earth-900">{author.name}</h1>

              <p className="text-xl text-forest-600 mb-6">{author.role}</p>

              <p className="text-earth-700 leading-relaxed mb-6 max-w-3xl">{author.bio}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-earth-900 mb-3 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-forest-600" />
                    <span>Expertise</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {author.expertise.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-earth-900 mb-3 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-forest-600" />
                    <span>Experience</span>
                  </h3>
                  <p className="text-earth-700">{author.experience} in Uganda tourism</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
