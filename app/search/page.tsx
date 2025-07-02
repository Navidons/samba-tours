"use client"

import { Suspense, useState, useEffect, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Star, Search } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { getAllTours } from "@/lib/tours"
import type { Tour } from "@/lib/tours"
import LoadingSpinner from "@/components/ui/loading-spinner"
import TourGrid from "@/components/tours/tour-grid"

export const metadata: Metadata = {
  title: "Search Tours - Samba Tours & Travel",
  description: "Search and discover the perfect Uganda tour for your adventure. Find tours by destination, activity, duration, and price range.",
  keywords: "search uganda tours, find safari tours, tour search, uganda travel search, adventure finder",
}

export default function SearchPage() {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(currentSearchParams.get("q") || "")

  const supabase = useMemo(() => createClient(), []);

  // Fetch all tours on component mount
  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true)
        const allTours = await getAllTours(supabase)
        setTours(allTours)
      } catch (error) {
        console.error('Error loading tours:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTours()
  }, [supabase])

  // Filter tours based on search parameters
  const filteredTours = useMemo(() => {
    let filtered = [...tours]

    const query = currentSearchParams.get("q")?.toLowerCase() || '';
    const category = currentSearchParams.get("category")?.toLowerCase();
    const location = currentSearchParams.get("location")?.toLowerCase();

    if (query) {
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(query) ||
        tour.description.toLowerCase().includes(query) ||
        tour.short_description.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query) ||
        tour.category?.name.toLowerCase().includes(query)
      );
    }

    if (category) {
      filtered = filtered.filter(tour =>
        tour.category?.slug.toLowerCase() === category
      );
    }

    if (location) {
      filtered = filtered.filter(tour =>
        tour.location.toLowerCase().includes(location)
      );
    }

    return filtered
  }, [tours, currentSearchParams])

  // Handle search input change and update URL
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(currentSearchParams.toString());
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q");
    }
    router.push(`/search?${params.toString()}`);
  }, [searchTerm, currentSearchParams, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex justify-center items-center">
        <LoadingSpinner />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container-max px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-earth-800 mb-4">Search Results</h1>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Search tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </div>

        {filteredTours.length > 0 ? (
          <TourGrid tours={filteredTours} />
        ) : (
          <p className="text-center text-lg text-earth-600">No tours found matching your search criteria.</p>
        )}
      </div>
    </main>
  )
}
