"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import LoadingSpinner from "@/components/ui/loading-spinner"
import TourGrid from "@/components/tours/tour-grid"
import type { Tour } from "@/lib/tours"

// Empty tour data with required fields
const emptyTours: Tour[] = []

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="relative h-48">
            <Skeleton className="h-full w-full" />
          </div>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Client component that uses useSearchParams
function SearchClient() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [filters, setFilters] = useState({
    duration: [1, 14],
    price: [0, 5000],
    categories: new Set<string>(),
    locations: new Set<string>(),
    activities: new Set<string>()
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search logic
  }

  const handleFilterChange = (type: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      duration: [1, 14],
      price: [0, 5000],
      categories: new Set<string>(),
      locations: new Set<string>(),
      activities: new Set<string>()
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          type="search"
          placeholder="Search tours, destinations, activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xl"
        />
        <Button type="submit">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Filters Panel */}
        {showFilters && (
          <Card className="h-fit">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 px-2"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              </div>

              <div className="space-y-6">
                {/* Duration Filter */}
                <div>
                  <Label>Duration (days)</Label>
                  <div className="pt-2">
                    <Slider
                      value={filters.duration}
                      min={1}
                      max={14}
                      step={1}
                      onValueChange={(value) => handleFilterChange("duration", value)}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{filters.duration[0]} days</span>
                      <span>{filters.duration[1]} days</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Range Filter */}
                <div>
                  <Label>Price Range ($)</Label>
                  <div className="pt-2">
                    <Slider
                      value={filters.price}
                      min={0}
                      max={5000}
                      step={100}
                      onValueChange={(value) => handleFilterChange("price", value)}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>${filters.price[0]}</span>
                      <span>${filters.price[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Categories Filter */}
                <div>
                  <Label>Categories</Label>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-2">
                      {["Wildlife Safari", "Gorilla Trekking", "Bird Watching", "Cultural Tours", "Adventure"].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={filters.categories.has(category)}
                            onCheckedChange={(checked) => {
                              const newCategories = new Set(filters.categories)
                              if (checked) {
                                newCategories.add(category)
                              } else {
                                newCategories.delete(category)
                              }
                              handleFilterChange("categories", newCategories)
                            }}
                          />
                          <Label htmlFor={category} className="text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Separator />

                {/* Active Filters */}
                {(filters.categories.size > 0 || filters.locations.size > 0 || filters.activities.size > 0) && (
                  <div>
                    <Label>Active Filters</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.from(filters.categories).map((category) => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            const newCategories = new Set(filters.categories)
                            newCategories.delete(category)
                            handleFilterChange("categories", newCategories)
                          }}
                        >
                          {category}
                          <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <TourGrid tours={emptyTours} />
          )}
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <SearchClient />
    </Suspense>
  )
}
