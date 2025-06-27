"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase"
import { getAllTours } from "@/lib/tours"

interface TourFiltersProps {
  onFiltersChange: (filters: any) => void
}

interface Category {
  id: number
  name: string
  slug: string
}

export default function TourFilters({ onFiltersChange }: TourFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(true)

  // URL alias mapping for user-friendly URLs
  const categoryAliases: Record<string, string> = {
    'birding': 'bird-watching',
    'cultural': 'cultural-tours',
    'adventure': 'adventure-tours',
    'wildlife': 'wildlife-safari',
    'gorilla': 'gorilla-trekking',
    'nature': 'nature-walks'
  }

  // Load categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase.from('tour_categories').select('*').order('name')
        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  // Initialize filters from URL parameters
  useEffect(() => {
    let category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const duration = searchParams.get('duration')

    // Map URL alias to actual database slug
    if (category && categoryAliases[category]) {
      category = categoryAliases[category]
    }

    // Reset to default values if parameters don't exist
    setSelectedCategories(category ? [category] : [])
    setPriceRange(minPrice && maxPrice ? [parseInt(minPrice), parseInt(maxPrice)] : [0, 2000])
    setSelectedDurations(duration ? [duration] : [])
    
    // Mark initialization as complete after a short delay
    setTimeout(() => setIsInitializing(false), 100)
  }, [searchParams])

  // Update URL when filters change (but not during initialization)
  useEffect(() => {
    if (isInitializing) return
    
    const params = new URLSearchParams()
    
    if (selectedCategories.length > 0) {
      params.set('category', selectedCategories[0])
    }
    if (priceRange[0] > 0 || priceRange[1] < 2000) {
      params.set('minPrice', priceRange[0].toString())
      params.set('maxPrice', priceRange[1].toString())
    }
    if (selectedDurations.length > 0) {
      params.set('duration', selectedDurations[0])
    }

    const newUrl = params.toString() ? `/tours?${params.toString()}` : '/tours'
    router.replace(newUrl, { scroll: false })
  }, [selectedCategories, priceRange, selectedDurations, router, isInitializing])

  // Notify parent component of filter changes (separate effect to avoid infinite loop)
  useEffect(() => {
    onFiltersChange({
      categories: selectedCategories,
      priceRange,
      durations: selectedDurations
    })
  }, [selectedCategories, priceRange, selectedDurations, onFiltersChange])

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([categorySlug])
    } else {
      setSelectedCategories([])
    }
  }

  const handleDurationChange = (durationId: string, checked: boolean) => {
    if (checked) {
      setSelectedDurations([durationId])
    } else {
      setSelectedDurations([])
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedDurations([])
    setPriceRange([0, 2000])
    router.replace('/tours', { scroll: false })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Tours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Tours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">Price Range</h3>
            <div className="px-2">
              <Slider value={priceRange} onValueChange={setPriceRange} max={2000} min={0} step={50} className="mb-2" />
              <div className="flex justify-between text-sm text-earth-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Tour Type</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(checked) => handleCategoryChange(category.slug, checked as boolean)}
                  />
                  <label htmlFor={category.slug} className="text-sm flex-1 cursor-pointer">
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="font-semibold mb-3">Duration</h3>
            <div className="space-y-2">
              {[
                { id: "1-3", label: "1-3 Days" },
                { id: "4-7", label: "4-7 Days" },
                { id: "8-14", label: "8-14 Days" },
                { id: "15+", label: "15+ Days" }
              ].map((duration) => (
                <div key={duration.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={duration.id}
                    checked={selectedDurations.includes(duration.id)}
                    onCheckedChange={(checked) => handleDurationChange(duration.id, checked as boolean)}
                  />
                  <label htmlFor={duration.id} className="text-sm flex-1 cursor-pointer">
                    {duration.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
