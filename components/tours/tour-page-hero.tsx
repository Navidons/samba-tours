"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Clock, Users } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { getAllTours } from "@/lib/tours"
import type { Tour } from "@/lib/tours"

interface TourPageHeroProps {
  className?: string
}

const categoryTitles: Record<string, { title: string; description: string; icon: string }> = {
  'safari': {
    title: 'Safari Adventures',
    description: 'Experience incredible wildlife encounters across Uganda\'s national parks',
    icon: '🦁'
  },
  'cultural': {
    title: 'Cultural Tours',
    description: 'Immerse yourself in Uganda\'s rich cultural heritage and traditions',
    icon: '🏺'
  },
  'adventure': {
    title: 'Adventure Tours',
    description: 'Thrilling outdoor activities and adrenaline-pumping experiences',
    icon: '🏔️'
  },
  'gorilla-trekking': {
    title: 'Gorilla Trekking',
    description: 'Once-in-a-lifetime encounters with mountain gorillas in their natural habitat',
    icon: '🦍'
  },
  'wildlife-safari': {
    title: 'Wildlife Safari',
    description: 'Discover Uganda\'s diverse wildlife in stunning natural landscapes',
    icon: '🐘'
  },
  'birding': {
    title: 'Bird Watching',
    description: 'Explore Uganda\'s incredible bird diversity with expert guides',
    icon: '🦅'
  }
}

export default function TourPageHero({ className }: TourPageHeroProps) {
  const searchParams = useSearchParams()
  const [featuredTour, setFeaturedTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)

  const category = searchParams.get('category')
  const search = searchParams.get('q')

  useEffect(() => {
    const loadFeaturedTour = async () => {
      try {
        const supabase = createClient()
        const tours = await getAllTours(supabase)
        
        // Get a featured tour (first one with rating > 4.5 or just first one)
        const featured = tours.find(tour => tour.rating >= 4.5 && tour.featured) || tours[0]
        setFeaturedTour(featured || null)
      } catch (error) {
        console.error('Error loading featured tour:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadFeaturedTour()
  }, [])

  // Dynamic content based on search parameters
  const getHeroContent = () => {
    if (search) {
      return {
        title: `Search Results for "${search}"`,
        description: 'Find the perfect Uganda adventure that matches your interests',
        showStats: false
      }
    }
    
    if (category && categoryTitles[category]) {
      const categoryInfo = categoryTitles[category]
      return {
        title: `${categoryInfo.icon} ${categoryInfo.title}`,
        description: categoryInfo.description,
        showStats: true
      }
    }
    
    return {
      title: 'Discover Uganda Tours',
      description: 'From thrilling gorilla encounters to breathtaking safaris, explore our carefully crafted tour packages that showcase the best of Uganda\'s natural wonders and cultural heritage.',
      showStats: true
    }
  }

  const heroContent = getHeroContent()

  return (
    <section className={`relative bg-gradient-to-br from-cream-50 to-forest-50 py-16 ${className}`}>
      <div className="container-max px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div>
                <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-earth-900 mb-4 leading-tight">
                  {heroContent.title}
                </h1>
                <p className="text-xl text-earth-600 leading-relaxed">
                  {heroContent.description}
                </p>
              </div>
              
              {heroContent.showStats && (
                <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-600">50+</div>
                    <div className="text-sm text-earth-600">Tour Packages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-600">2000+</div>
                    <div className="text-sm text-earth-600">Happy Travelers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-600">4.9</div>
                    <div className="text-sm text-earth-600">Average Rating</div>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Tour Card */}
            <div className="lg:justify-self-end">
              {loading ? (
                <Card className="w-full max-w-md">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : featuredTour ? (
                <Card className="w-full max-w-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={featuredTour.featured_image || "/placeholder.svg"}
                      alt={featuredTour.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-forest-600 text-white">Featured</Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-semibold">{featuredTour.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-earth-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{featuredTour.location}</span>
                      </div>
                      
                      <h3 className="font-playfair text-xl font-bold text-earth-900 leading-tight">
                        {featuredTour.title}
                      </h3>
                      
                      <p className="text-earth-700 text-sm line-clamp-2">
                        {featuredTour.short_description || featuredTour.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-earth-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{featuredTour.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Max {featuredTour.max_group_size || 12}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-2xl font-bold text-forest-600">${featuredTour.price}</span>
                          <span className="text-earth-600 text-sm">/person</span>
                        </div>
                        <Badge variant="outline" className="border-forest-200 text-forest-700">
                          {typeof featuredTour.category === 'object' 
                            ? featuredTour.category.name 
                            : featuredTour.category || 'Tour'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 