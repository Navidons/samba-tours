"use client"

import { Suspense, useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import TourPageHero from "@/components/tours/tour-page-hero"
import TourFilters from "@/components/tours/tour-filters"
import TourGrid from "@/components/tours/tour-grid"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase"
import { getAllTours, getTourCategories } from "@/lib/tours"
import type { Tour, TourCategory } from "@/lib/tours"

export default function ToursClient() {
  const searchParams = useSearchParams()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: [0, 2000] as [number, number],
    durations: [] as string[]
  })

  // Load all tours
  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        const allTours = await getAllTours(supabase)
        setTours(allTours)
      } catch (error) {
        console.error('Error loading tours:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTours()
  }, [])

  // Memoize filtered tours to prevent unnecessary re-renders
  const filteredTours = useMemo(() => {
    let filtered = [...tours]

    // Filter by category
    if (filters.categories.length > 0) {
      filtered = filtered.filter(tour => {
        const tourCategory = typeof tour.category === 'object' ? tour.category?.slug : tour.category
        return tourCategory && filters.categories.includes(tourCategory)
      })
    }

    // Filter by price range
    filtered = filtered.filter(tour => 
      tour.price >= filters.priceRange[0] && tour.price <= filters.priceRange[1]
    )

    // Filter by duration
    if (filters.durations.length > 0) {
      filtered = filtered.filter(tour => {
        const duration = parseInt(tour.duration)
        return filters.durations.some(durationFilter => {
          switch (durationFilter) {
            case "1-3":
              return duration >= 1 && duration <= 3
            case "4-7":
              return duration >= 4 && duration <= 7
            case "8-14":
              return duration >= 8 && duration <= 14
            case "15+":
              return duration >= 15
            default:
              return true
          }
        })
      })
    }

    return filtered
  }, [tours, filters])

  // Memoize the filter change handler to prevent infinite loops
  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <>
      <TourPageHero />
      
      <div className="section-padding bg-white">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <TourFilters onFiltersChange={handleFiltersChange} />
            </div>
            <div className="lg:col-span-3">
              <Suspense fallback={<LoadingSpinner />}>
                <TourGrid tours={filteredTours} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
