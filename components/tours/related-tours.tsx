"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { getAllTours } from "@/lib/tours"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, MapPin } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface Tour {
  id: number
  title: string
  description: string
  short_description: string
  price: number
  duration: string
  max_group_size: number
  rating: number
  review_count: number
  location: string
  featured_image: string | null
  category: string | {
    id: number
    name: string
  }
  category_id: number
}

interface RelatedToursProps {
  currentTour: Tour
}

export default function RelatedTours({ currentTour }: RelatedToursProps) {
  const [relatedTours, setRelatedTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedTours = async () => {
      try {
        const supabase = createClient()
        const allTours = await getAllTours(supabase)
        
        // Convert imported tours to local Tour type
        const convertedTours: Tour[] = allTours.map(tour => ({
          ...tour,
          max_group_size: tour.max_group_size ?? 12,
          category: typeof tour.category === 'object' 
            ? tour.category 
            : tour.category || 'General'
        }))
        
        // Filter out the current tour and get related tours based on category and location
        const filteredTours = convertedTours.filter(tour => 
          tour.id !== currentTour.id && 
          (tour.category_id === currentTour.category_id || 
           tour.location.toLowerCase().includes(currentTour.location.toLowerCase()) ||
           currentTour.location.toLowerCase().includes(tour.location.toLowerCase()))
        )

        // Sort by relevance (same category first, then same location, then by rating)
        const sortedTours = filteredTours.sort((a, b) => {
          const aScore = (a.category_id === currentTour.category_id ? 3 : 0) + 
                        (a.location.toLowerCase().includes(currentTour.location.toLowerCase()) ? 2 : 0) +
                        (a.rating / 5)
          const bScore = (b.category_id === currentTour.category_id ? 3 : 0) + 
                        (b.location.toLowerCase().includes(currentTour.location.toLowerCase()) ? 2 : 0) +
                        (b.rating / 5)
          return bScore - aScore
        })

        // Take the first 3 related tours
        setRelatedTours(sortedTours.slice(0, 3))
      } catch (error) {
        console.error("Error fetching related tours:", error)
        setRelatedTours([])
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedTours()
  }, [currentTour])

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="heading-secondary">You Might Also Like</h2>
            <p className="text-lg text-earth-600">Discover more amazing adventures in Uganda</p>
          </div>
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </section>
    )
  }

  if (relatedTours.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="heading-secondary">You Might Also Like</h2>
          <p className="text-lg text-earth-600">Discover more amazing adventures in Uganda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedTours.map((tour) => (
            <Card key={tour.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={tour.featured_image || "/placeholder.svg?height=400&width=600"}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-forest-600 text-white">
                    {typeof tour.category === 'object' 
                      ? tour.category.name 
                      : tour.category || 'General'}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{tour.rating || 4.5}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center text-sm text-earth-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{tour.location}</span>
                </div>

                <h3 className="font-playfair text-xl font-bold text-earth-900 mb-3 group-hover:text-forest-600 transition-colors">
                  <Link href={`/tours/${tour.id}`}>{tour.title}</Link>
                </h3>

                <p className="text-earth-700 mb-4 line-clamp-2">{tour.short_description || tour.description}</p>

                <div className="flex items-center justify-between text-sm text-earth-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration} Days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Max {tour.max_group_size || 12} People</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-forest-600">${tour.price}</span>
                    <span className="text-earth-600 text-sm">/person</span>
                  </div>
                  <Button className="btn-primary" asChild>
                    <Link href={`/tours/${tour.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
