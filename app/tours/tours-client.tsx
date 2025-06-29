"use client"

import { Suspense, useState, useEffect, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TourFilters from "@/components/tours/tour-filters"
import TourGrid from "@/components/tours/tour-grid"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { getAllTours } from "@/lib/tours"
import { createClient } from "@/lib/supabase"
import type { Tour } from "@/lib/tours"

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
      <>
        <Header />
        <main className="min-h-screen bg-cream-50">
          <div className="section-padding">
            <div className="container-max">
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50">
        <div className="section-padding">
          <div className="container-max">
            <div className="text-center mb-12">
              <h1 className="heading-primary mb-6">Discover Uganda Tours</h1>
              <p className="text-xl text-earth-600 max-w-3xl mx-auto">
                From thrilling gorilla encounters to breathtaking safaris, explore our carefully crafted tour packages
                that showcase the best of Uganda's natural wonders and cultural heritage.
              </p>
            </div>

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
      </main>
      <Footer />
    </>
  )
} 
