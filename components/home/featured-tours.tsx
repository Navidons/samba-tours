"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { getAllTours } from "@/lib/tours"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Users, Star, MapPin } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { SupabaseClient } from "@supabase/supabase-js"

async function fetchTourExtras(supabase: SupabaseClient, tourId: number) {
  const [bestTimeRes, physicalReqRes] = await Promise.all([
    supabase.from('tour_best_times').select('best_time_item').eq('tour_id', tourId),
    supabase.from('tour_physical_requirements').select('requirement').eq('tour_id', tourId),
  ])
  return {
    best_time: bestTimeRes.data || [],
    physical_requirements: physicalReqRes.data || [],
  }
}

export default function FeaturedTours() {
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const data = await getAllTours(supabase)
        // Take only the first 3 tours
        const firstThreeTours = data.slice(0, 3)
        // Fetch extras for each tour
        const toursWithExtras = await Promise.all(
          firstThreeTours.map(async (tour) => {
            const extras = await fetchTourExtras(supabase, tour.id)
            return { ...tour, ...extras }
          })
        )
        setTours(toursWithExtras)
      } catch (err) {
        setError("Failed to load tours.")
      } finally {
        setLoading(false)
      }
    }
    fetchTours()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-500 p-4">{error}</div>
  if (!tours.length) return <div className="p-4 text-gray-500">No featured tours available.</div>

  return (
    <section className="section-padding bg-cream-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">Featured Tours</h2>
          <p className="text-xl text-earth-600 max-w-2xl mx-auto">
            Discover our most popular adventures that showcase the best of Uganda's natural wonders and wildlife.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tours.map((tour) => (
            <Card key={tour.id} className="group hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={tour.featured_image || "/placeholder.svg?height=400&width=600"}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
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
                  <span>{tour.location || "Uganda"}</span>
                </div>

                <h3 className="font-playfair text-xl font-bold text-earth-900 mb-3">{tour.title}</h3>

                <p className="text-earth-700 mb-4 line-clamp-3">{tour.short_description || tour.description}</p>

                <div className="flex items-center justify-between text-sm text-earth-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{tour.duration} Days</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{tour.max_group_size || 12} People</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-forest-600">${tour.price}</span>
                    <span className="text-earth-600 text-sm">/person</span>
                  </div>
                  <Button className="btn-primary" asChild>
                    <Link href={`/tours/${tour.id}`}>Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/tours">View All Tours</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
