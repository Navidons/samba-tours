"use client"

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Trash2, X, ChevronLeft, ChevronRight, Download, Share2, Heart } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Tour {
  id: number
  title: string
  slug: string
  description: string
  short_description?: string
  category_id: number
  duration: string
  max_group_size?: number
  price: number
  featured_image?: string | null
  status: string
  location?: string
  original_price?: number
  difficulty?: string
  highlights?: string[]
  best_time?: string[]
  physical_requirements?: string[]
  rating?: number
  review_count?: number
  created_at?: string
  updated_at?: string
}

interface Category {
  id: number
  name: string
}

interface TourImage {
  id?: number
  tour_id: number
  image_url: string
  created_at?: string
}

interface TourItinerary {
  id?: number
  tour_id: number
  day_number: number
  title: string
  location: string
  description: string
  activities: string[]
}

interface TourInclusion {
  id?: number
  tour_id: number
  item: string
}

interface TourExclusion {
  id?: number
  tour_id: number
  item: string
}

interface TourHighlight {
  id?: number;
  tour_id: number;
  highlight: string;
  order_index?: number;
}

interface TourBestTime {
  id?: number;
  tour_id: number;
  best_time_item: string;
}

interface TourPhysicalRequirement {
  id?: number;
  tour_id: number;
  requirement: string;
}

export default function AdminTourDetails() {
  const params = useParams()
  const router = useRouter()
  const [tour, setTour] = useState<Tour | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [images, setImages] = useState<TourImage[]>([])
  const [itinerary, setItinerary] = useState<TourItinerary[]>([])
  const [inclusions, setInclusions] = useState<string[]>([])
  const [exclusions, setExclusions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const supabase = createClient()
        
        // Ensure tour ID is a number
        const tourId = Number(params.id)

        if (isNaN(tourId)) {
          throw new Error('Invalid tour ID')
        }

        // Fetch tour details
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('*')
          .eq('id', tourId)
          .single() as { data: Tour | null, error: any }

        if (tourError) {
          throw tourError
        }

        if (!tourData) {
          throw new Error('Tour data not found after fetch.');
        }

        // Type guard: After this point, tourData is guaranteed to be Tour
        const tour = tourData; 

        // Fetch category details
        const { data: categoryData, error: categoryError } = await supabase
          .from('tour_categories')
          .select('id, name')
          .eq('id', tour!.category_id as number) // Explicitly cast to number
          .single() as { data: Category | null, error: any }

        // Fetch tour images
        const { data: imagesData, error: imagesError } = await supabase
          .from('tour-images')
          .select('id, tour_id, image_url')
          .eq('tour_id', tourId)
          .order('order_index') as { data: TourImage[] | null, error: any }

        // Fetch tour itinerary
        const { data: itineraryData, error: itineraryError } = await supabase
          .from('tour_itinerary')
          .select('id, tour_id, day_number, title, location, description, activities')
          .eq('tour_id', tourId)
          .order('day_number') as { data: TourItinerary[] | null, error: any }

        // Fetch tour inclusions
        const { data: inclusionsData, error: inclusionsError } = await supabase
          .from('tour_inclusions')
          .select('id, tour_id, item')
          .eq('tour_id', tourId) as { data: TourInclusion[] | null, error: any }

        // Fetch tour exclusions
        const { data: exclusionsData, error: exclusionsError } = await supabase
          .from('tour_exclusions')
          .select('id, tour_id, item')
          .eq('tour_id', tourId) as { data: TourExclusion[] | null, error: any }

        // Fetch tour highlights using admin client to bypass RLS
        const adminSupabase = createAdminClient()
        const { data: highlightsData, error: highlightsError } = await adminSupabase
          .from('tour_highlights')
          .select('highlight')
          .eq('tour_id', tourId) as { data: TourHighlight[] | null, error: any }
        
        // Fetch tour best times using admin client to bypass RLS
        const { data: bestTimesData, error: bestTimesError } = await adminSupabase
          .from('tour_best_times')
          .select('best_time_item')
          .eq('tour_id', tourId) as { data: TourBestTime[] | null, error: any }

        // Fetch tour physical requirements using admin client to bypass RLS
        const { data: physicalRequirementsData, error: physicalRequirementsError } = await adminSupabase
          .from('tour_physical_requirements')
          .select('requirement')
          .eq('tour_id', tourId) as { data: TourPhysicalRequirement[] | null, error: any }

        if (categoryError) {
          throw categoryError
        }

        if (highlightsError) {
          // Silently handle highlights error
        }

        if (bestTimesError) {
          // Silently handle best times error
        }

        if (physicalRequirementsError) {
          // Silently handle physical requirements error
        }

        setTour({
          ...tour,
          highlights: highlightsData?.map(h => h.highlight) || [],
          best_time: bestTimesData?.map(bt => bt.best_time_item) || [],
          physical_requirements: physicalRequirementsData?.map(pr => pr.requirement) || []
        })
        setCategory(categoryData as Category)
        setImages(imagesData as TourImage[] || [])
        setItinerary(itineraryData?.map((item: any) => ({
          id: item.id,
          tour_id: item.tour_id,
          day_number: item.day_number,
          title: item.title,
          location: item.location,
          description: item.description || "",
          activities: item.activities || []
        })) || [])
        
        // Separate inclusions and exclusions
        setInclusions(inclusionsData?.map(inc => inc.item) || [])
        setExclusions(exclusionsData?.map(exc => exc.item) || [])

      } catch (error) {
        toast.error('Failed to load tour details')
        router.push('/admin/tours')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchTourDetails()
    }
  }, [params.id, router])

  // Lightbox navigation handlers
  const openLightbox = useCallback((index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    setCurrentImageIndex(prev => {
      if (direction === 'next') {
        return prev === images.length - 1 ? 0 : prev + 1
      } else {
        return prev === 0 ? images.length - 1 : prev - 1
      }
    })
  }, [images.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return

      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowRight':
          navigateLightbox('next')
          break
        case 'ArrowLeft':
          navigateLightbox('prev')
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, closeLightbox, navigateLightbox])

  // Image download handler
  const handleDownload = useCallback((imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `tour-image-${tour?.slug || 'download'}`
    link.click()
  }, [tour])

  const handleDeleteTour = async () => {
    if (!tour) return

    const confirmDelete = window.confirm('Are you sure you want to delete this tour? This action cannot be undone.')
    
    if (!confirmDelete) return

    try {
      setDeleting(true)
      const supabase = createClient()

      // Delete related images
      const { error: imageDeleteError } = await supabase
        .from('tour-images')
        .delete()
        .eq('tour_id', tour.id)

      // Delete related itinerary
      const { error: itineraryDeleteError } = await supabase
        .from('tour_itinerary')
        .delete()
        .eq('tour_id', tour.id)

      // Delete related inclusions
      const { error: inclusionsDeleteError } = await supabase
        .from('tour_inclusions')
        .delete()
        .eq('tour_id', tour.id)

      // Delete related exclusions
      const { error: exclusionsDeleteError } = await supabase
        .from('tour_exclusions')
        .delete()
        .eq('tour_id', tour.id)
      
      // Delete related highlights
      const { error: highlightsDeleteError } = await supabase
        .from('tour_highlights')
        .delete()
        .eq('tour_id', tour.id)

      // Delete related best times
      const { error: bestTimesDeleteError } = await supabase
        .from('tour_best_times')
        .delete()
        .eq('tour_id', tour.id)

      // Delete related physical requirements
      const { error: physicalRequirementsDeleteError } = await supabase
        .from('tour_physical_requirements')
        .delete()
        .eq('tour_id', tour.id)

      // Delete the tour
      const { error: tourDeleteError } = await supabase
        .from('tours')
        .delete()
        .eq('id', tour.id)

      if (tourDeleteError) {
        throw tourDeleteError
      }

      toast.success('Tour deleted successfully')
      router.push('/admin/tours')
    } catch (error) {
      toast.error('Failed to delete tour')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="animate-pulse">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  console.log('Tour object before render:', tour);

  if (!tour) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tour Not Found</h2>
            <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/admin/tours">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tours
              </Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header & Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild className="hover:bg-gray-50">
                <Link href="/admin/tours">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tours
                </Link>
              </Button>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900">{tour.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  {category && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.name}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    tour.status === 'active' ? 'bg-green-100 text-green-800' : 
                    tour.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tour.status}
                  </span>
                  {tour.rating && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      ⭐ {tour.rating.toFixed(1)} ({tour.review_count || 0} reviews)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" asChild className="hover:bg-blue-50">
                <Link href={`/admin/tours/${tour.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Tour
                </Link>
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteTour} disabled={deleting} className="hover:bg-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete Tour'}
              </Button>
            </div>
          </div>
                </div>

        {/* Metadata Section */}
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-6">
                {tour.created_at && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Created:</span>
                    <span>{new Date(tour.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                )}
                {tour.updated_at && tour.updated_at !== tour.created_at && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Updated:</span>
                    <span>{new Date(tour.updated_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                )}
                  </div>
              <div className="flex items-center gap-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">ID: {tour.id}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Slug: {tour.slug}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section with Featured Image */}
        {tour.featured_image && (
          <div className="relative h-96 rounded-xl overflow-hidden mb-8 shadow-lg">
            <img 
              src={tour.featured_image} 
              alt={tour.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{tour.title}</h2>
              <p className="text-lg opacity-90">{tour.location}</p>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <CardTitle className="text-xl text-gray-900">About This Tour</CardTitle>
            </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">{tour.description || <span className="text-gray-400 italic">No description provided.</span>}</p>
                {tour.short_description && (
                  <p className="text-gray-600 mt-4 text-sm italic">"{tour.short_description}"</p>
                )}
            </CardContent>
          </Card>

            {/* Itinerary */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <CardTitle className="text-xl text-gray-900">Tour Itinerary</CardTitle>
            </CardHeader>
              <CardContent className="p-6">
                {itinerary.length > 0 ? (
                  <div className="space-y-6">
                    {itinerary.map((day, index) => (
                      <div key={day.id} className="relative">
                        <div className="absolute left-0 top-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {day.day_number}
                        </div>
                        <div className="ml-12 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                          <div className="mb-3">
                            <h3 className="font-semibold text-lg text-gray-900">{day.title}</h3>
                            {day.location && (
                              <p className="text-blue-600 text-sm">📍 {day.location}</p>
                            )}
                    </div>
                          <p className="text-gray-700 mb-3">{day.description || <span className="text-gray-400 italic">No description</span>}</p>
                          {day.activities && day.activities.length > 0 && (
                  <div>
                              <h4 className="font-medium text-gray-900 mb-2">Activities:</h4>
                              <ul className="space-y-1">
                                {day.activities.map((activity, idx) => (
                                  <li key={idx} className="flex items-center text-sm text-gray-600">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                                    {activity}
                        </li>
                      ))}
                    </ul>
                            </div>
                          )}
                        </div>
                  </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No itinerary specified.</span>
                )}
            </CardContent>
          </Card>

            {/* Images Gallery */}
        {images.length > 0 && (
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                  <CardTitle className="text-xl text-gray-900">Tour Gallery</CardTitle>
            </CardHeader>
                <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div 
                    key={image.id || index} 
                        className="group cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={() => openLightbox(index)}
                  >
                        <div className="relative overflow-hidden rounded-lg shadow-md">
                    <img 
                      src={image.image_url} 
                      alt={`Tour image ${index + 1}`} 
                            className="w-full h-48 object-cover group-hover:brightness-75 transition-all duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <div className="bg-white/90 rounded-full p-2">
                                <Heart className="h-5 w-5 text-gray-700" />
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Tour Info Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
                <CardTitle className="text-lg text-gray-900">Tour Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">{tour.duration || <span className="text-gray-400">N/A</span>}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Group Size</span>
                    <span className="font-semibold text-gray-900">{tour.max_group_size || <span className="text-gray-400">N/A</span>}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-gray-900">{tour.location || <span className="text-gray-400">N/A</span>}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Difficulty</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tour.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      tour.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                      tour.difficulty === 'Challenging' ? 'bg-orange-100 text-orange-800' :
                      tour.difficulty === 'Strenuous' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tour.difficulty || 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                <CardTitle className="text-lg text-gray-900">Pricing</CardTitle>
          </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">${tour.price?.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">per person</div>
                  </div>
                  {tour.original_price && tour.original_price > tour.price && (
                    <div className="text-center">
                      <div className="text-lg text-gray-400 line-through">${tour.original_price.toFixed(2)}</div>
                      <div className="text-sm text-green-600 font-medium">
                        Save ${(tour.original_price - tour.price).toFixed(2)}!
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Highlights Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-gray-200">
                <CardTitle className="text-lg text-gray-900">Highlights</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {tour.highlights && tour.highlights.length > 0 ? (
                  <div className="space-y-2">
                    {tour.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No highlights specified.</span>
                )}
              </CardContent>
            </Card>

            {/* Best Time Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200">
                <CardTitle className="text-lg text-gray-900">Best Time to Visit</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {tour.best_time && tour.best_time.length > 0 ? (
                  <div className="space-y-2">
                    {tour.best_time.map((time, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                        <span className="text-gray-700">{time}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No best time specified.</span>
                )}
              </CardContent>
            </Card>

            {/* Physical Requirements Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-200">
                <CardTitle className="text-lg text-gray-900">Physical Requirements</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {tour.physical_requirements && tour.physical_requirements.length > 0 ? (
                  <div className="space-y-2">
                    {tour.physical_requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-400 italic">No physical requirements specified.</span>
                )}
              </CardContent>
            </Card>

            {/* Inclusions & Exclusions Card */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-green-50 border-b border-gray-200">
                <CardTitle className="text-lg text-gray-900">What's Included & Excluded</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                    <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      What's Included
                    </h4>
                    {inclusions.length > 0 ? (
                      <div className="space-y-2">
                        {inclusions.map((item, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="text-green-600 mr-2">✓</span>
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No inclusions specified.</span>
                    )}
                    </div>
                    <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                      What's Excluded
                    </h4>
                    {exclusions.length > 0 ? (
                      <div className="space-y-2">
                        {exclusions.map((item, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="text-red-600 mr-2">✗</span>
                            <span className="text-gray-700">{item}</span>
                          </div>
                            ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No exclusions specified.</span>
                    )}
                    </div>
      </div>
          </CardContent>
        </Card>
          </div>
        </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 z-60 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 left-4 -translate-y-1/2 z-60 text-white hover:bg-white/20"
                  onClick={() => navigateLightbox('prev')}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1/2 right-4 -translate-y-1/2 z-60 text-white hover:bg-white/20"
                  onClick={() => navigateLightbox('next')}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Main Image */}
            <div className="flex items-center justify-center h-full w-full">
              <img 
                src={images[currentImageIndex].image_url} 
                alt={`Tour image ${currentImageIndex + 1}`} 
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Image Actions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => handleDownload(images[currentImageIndex].image_url)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => {
                  navigator.clipboard.writeText(images[currentImageIndex].image_url)
                  toast.success('Image link copied to clipboard')
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((image, index) => (
                  <div 
                    key={image.id || index}
                    className={`w-16 h-16 cursor-pointer rounded-md overflow-hidden border-2 ${
                      index === currentImageIndex 
                        ? 'border-white' 
                        : 'border-transparent opacity-60 hover:opacity-80'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img 
                      src={image.image_url} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </main>
  )
} 