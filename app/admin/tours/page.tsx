"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Define Tour interface to match database schema
interface Tour {
  id: number
  title: string
  category_id: number
  duration: string
  price: number
  status: string
  featured_image?: string | null
  category?: {
    name: string
  }
  _count?: {
    bookings?: number
  }
}

interface RawTourData extends Omit<Tour, 'category'> {
  category?: {
    name: string
  } | null
}

export default function ToursManagement() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        
        // Fetch tours with category information
        const { data: toursData, error } = await supabase
          .from('tours')
          .select(`
            id,
            title,
            category_id,
            duration,
            price,
            status,
            featured_image,
            category:tour_categories(name)
          `)
          .order('created_at', { ascending: false }) as { 
            data: RawTourData[] | null, 
            error: any 
          }

        if (error) {
          throw error
        }

        // Transform the data to match the Tour interface
        const transformedTours: Tour[] = (toursData || []).map(tour => ({
          ...tour,
          category: tour.category ? { name: tour.category.name } : undefined
        }))

        setTours(transformedTours)
      } catch (error) {
        console.error('Error fetching tours:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
        toast.error('Failed to load tours')
      } finally {
        setLoading(false)
      }
    }

    fetchTours()
  }, [])

  const handleDeleteTour = async (tourId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')
    
    if (!confirmDelete) return

    try {
      const supabase = createClient()

      // Delete related images
      const { error: imageDeleteError } = await supabase
        .from('tour_images')
        .delete()
        .eq('tour_id', tourId)

      // Delete related itinerary
      const { error: itineraryDeleteError } = await supabase
        .from('tour_itinerary')
        .delete()
        .eq('tour_id', tourId)

      // Delete the tour
      const { error: tourDeleteError } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId)

      if (tourDeleteError) {
        throw tourDeleteError
      }

      // Update local state to remove deleted tour
      setTours(prevTours => prevTours.filter(tour => tour.id !== tourId))

      toast.success('Tour deleted successfully')
    } catch (error) {
      console.error('Error deleting tour:', error)
      toast.error('Failed to delete tour')
    }
  }

  // Filter tours based on search term
  const filteredTours = tours.filter(tour => 
    tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Error Loading Tours</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} variant="destructive">
            Try Again
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-earth-900 mb-2">Tour Management</h1>
              <p className="text-earth-600">Manage your tour packages and itineraries</p>
            </div>
            <Button asChild className="bg-forest-600 hover:bg-forest-700">
              <Link href="/admin/tours/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Tour
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input 
                      placeholder="Search tours..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tours Grid */}
          {filteredTours.length === 0 ? (
            <div className="text-center text-earth-600 py-12">
              <h2 className="text-2xl font-semibold mb-4">No Tours Found</h2>
              <p className="mb-6">
                {searchTerm 
                  ? `No tours match "${searchTerm}". Try a different search.` 
                  : "You haven't created any tours yet."
                }
              </p>
              <Button asChild className="bg-forest-600 hover:bg-forest-700">
                <Link href="/admin/tours/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Tour
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.map((tour) => (
                <Card key={tour.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={tour.featured_image || "/placeholder.svg"}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className={`absolute top-3 right-3 ${getStatusColor(tour.status)}`}>
                      {tour.status}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-earth-900 mb-2">{tour.title}</h3>
                      <div className="flex items-center justify-between text-sm text-earth-600 mb-2">
                        <span>{tour.category?.name || 'Uncategorized'}</span>
                        <span>{tour.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-forest-600">
                          ${tour.price.toFixed(2)}
                        </span>
                        <div className="text-sm text-earth-600">
                          {/* Placeholder for bookings count */}
                          0 bookings • ⭐ 0
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/admin/tours/${tour.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/admin/tours/${tour.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTour(tour.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
