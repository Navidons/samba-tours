'use client'

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star, MapPin, Calendar } from "lucide-react"
import type { Tour } from "@/lib/tours"

interface TourGridProps {
  tours: Tour[]
}

type SortOption = 
  | "featured"
  | "price-low-high"
  | "price-high-low"
  | "duration-shortest"
  | "duration-longest"
  | "rating-highest"

export default function TourGrid({ tours }: TourGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured")

  // Sort tours based on selected option
  const sortedTours = useMemo(() => {
    const toursCopy = [...tours]
    
    switch (sortBy) {
      case "featured":
        // Sort by featured status first, then by rating
        return toursCopy.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.rating - a.rating
        })
      
      case "price-low-high":
        return toursCopy.sort((a, b) => a.price - b.price)
      
      case "price-high-low":
        return toursCopy.sort((a, b) => b.price - a.price)
      
      case "duration-shortest":
        return toursCopy.sort((a, b) => parseInt(a.duration) - parseInt(b.duration))
      
      case "duration-longest":
        return toursCopy.sort((a, b) => parseInt(b.duration) - parseInt(a.duration))
      
      case "rating-highest":
        return toursCopy.sort((a, b) => b.rating - a.rating)
      
      default:
        return toursCopy
    }
  }, [tours, sortBy])

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as SortOption
    setSortBy(value)
  }

  if (tours.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-earth-900 mb-2">No tours available</h3>
        <p className="text-earth-600">Tours will appear here once they are added by the admin.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-earth-600">Showing {sortedTours.length} tours</p>
        <select 
          value={sortBy}
          onChange={handleSortChange}
          className="border border-earth-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
        >
          <option value="featured">Sort by: Featured</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="duration-shortest">Duration: Shortest</option>
          <option value="duration-longest">Duration: Longest</option>
          <option value="rating-highest">Rating: Highest</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTours.map((tour) => (
          <Card key={tour.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={tour.featured_image || "/placeholder.svg?height=400&width=600"}
                alt={tour.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-forest-600 text-white">{tour.category?.name || "Tour"}</Badge>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{tour.rating}</span>
                  <span className="text-xs text-earth-600">({tour.review_count})</span>
                </div>
              </div>
              {tour.original_price && tour.original_price > tour.price && (
                <div className="absolute bottom-4 left-4">
                  <Badge variant="destructive">Save ${tour.original_price - tour.price}</Badge>
                </div>
              )}
            </div>

            <CardContent className="p-6">
              <div className="flex items-center text-sm text-earth-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{tour.location}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{tour.difficulty}</span>
              </div>

              <h3 className="font-playfair text-xl font-bold text-earth-900 mb-3 group-hover:text-forest-600 transition-colors">
                <Link href={`/tours/${tour.id}`}>{tour.title}</Link>
              </h3>

              <p className="text-earth-700 mb-4 line-clamp-2">{tour.short_description || tour.description}</p>

              {tour.highlights && tour.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.slice(0, 3).map((highlight: { highlight: string }, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {highlight.highlight}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-earth-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Max {tour.max_group_size}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Daily</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-forest-600">${tour.price}</span>
                    {tour.original_price && tour.original_price > tour.price && (
                      <span className="text-sm text-earth-500 line-through">${tour.original_price}</span>
                    )}
                  </div>
                  <span className="text-earth-600 text-sm">per person</span>
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
  )
}
