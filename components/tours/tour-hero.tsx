import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Clock, Users, MapPin, Calendar } from "lucide-react"

interface Tour {
  id: number
  title: string
  description: string
  image: string
  duration: string
  groupSize: string
  rating: number
  reviewCount: number
  price: number
  originalPrice?: number
  location: string
  category: string
  difficulty: string
}

interface TourHeroProps {
  tour: Tour
}

export default function TourHero({ tour }: TourHeroProps) {
  return (
    <section className="relative">
      {/* Back Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Button variant="secondary" size="sm" asChild className="bg-white/90 hover:bg-white">
          <Link href="/tours" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Tours</span>
          </Link>
        </Button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image src={tour.image || "/placeholder.svg"} alt={tour.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="container-max">
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <Badge className="bg-forest-600 text-white">{tour.category}</Badge>
              <Badge
                variant="secondary"
                className={`${
                  tour.difficulty === "Easy"
                    ? "bg-green-100 text-green-800"
                    : tour.difficulty === "Moderate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {tour.difficulty}
              </Badge>
              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-semibold">{tour.rating}</span>
                <span className="text-sm">({tour.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-playfair font-bold mb-6 leading-tight">{tour.title}</h1>

            <p className="text-xl text-gray-200 mb-8 max-w-3xl leading-relaxed">{tour.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-forest-300" />
                <div>
                  <p className="text-sm text-gray-300">Duration</p>
                  <p className="font-semibold">{tour.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-forest-300" />
                <div>
                  <p className="text-sm text-gray-300">Group Size</p>
                  <p className="font-semibold">Max {tour.groupSize}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-forest-300" />
                <div>
                  <p className="text-sm text-gray-300">Location</p>
                  <p className="font-semibold">{tour.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-forest-300" />
                <div>
                  <p className="text-sm text-gray-300">Availability</p>
                  <p className="font-semibold">Year Round</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
