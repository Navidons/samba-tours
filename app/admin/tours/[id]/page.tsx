"use client"

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
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
  category_id: number
  duration: string
  max_group_size?: number
  price: number
  featured_image?: string | null
  status: string
  location?: string
  original_price?: number
  difficulty?: string
  highlights?: { highlight: string }[]
  best_time?: { best_time_item: string }[]
  physical_requirements?: { requirement: string }[]
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
        console.log('Parsed Tour ID (before fetch):', tourId)

        if (isNaN(tourId)) {
          console.error('Invalid tour ID detected:', params.id); // Log invalid ID
          throw new Error('Invalid tour ID')
        }

        // Fetch tour details
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('id, title, slug, description, category_id, duration, max_group_size, price, featured_image, status, location, original_price, difficulty')
          .eq('id', tourId)
          .single() as { data: Tour | null, error: any }

        console.log('Supabase Tour Data (after fetch):', tourData);
        console.log('Supabase Tour Error (after fetch):', tourError);

        if (tourError) {
          console.error('Tour Fetch Error (inside error block):', tourError)
          throw tourError
        }

        if (!tourData) {
          console.error('Tour data is null after successful fetch (no tour found for ID):', tourId); // Log if data is null
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
          .from('tour_images')
          .select('id, tour_id, image_url')
          .eq('tour_id', tourId)
          .order('order_index') as { data: TourImage[] | null, error: any }

        console.log('Supabase Images Data (after fetch):', imagesData);
        console.log('Supabase Images Error (after fetch):', imagesError);

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

        // Fetch tour highlights
        const { data: highlightsData, error: highlightsError } = await supabase
          .from('tour_highlights')
          .select('highlight')
          .eq('tour_id', tourId) as { data: TourHighlight[] | null, error: any }
        console.log('Fetched highlightsData:', highlightsData);
        
        // Fetch tour best times
        const { data: bestTimesData, error: bestTimesError } = await supabase
          .from('tour_best_times')
          .select('best_time_item')
          .eq('tour_id', tourId) as { data: TourBestTime[] | null, error: any }
        console.log('Fetched bestTimesData:', bestTimesData);

        // Fetch tour physical requirements
        const { data: physicalRequirementsData, error: physicalRequirementsError } = await supabase
          .from('tour_physical_requirements')
          .select('requirement')
          .eq('tour_id', tourId) as { data: TourPhysicalRequirement[] | null, error: any }
        console.log('Fetched physicalRequirementsData:', physicalRequirementsData);

        if (categoryError) {
          console.error('Category Fetch Error:', categoryError)
          throw categoryError
        }

        if (highlightsError) {
          console.warn('Error fetching tour highlights:', highlightsError);
        }

        if (bestTimesError) {
          console.warn('Error fetching tour best times:', bestTimesError);
        }

        if (physicalRequirementsError) {
          console.warn('Error fetching tour physical requirements:', physicalRequirementsError);
        }

        setTour({
          ...tour,
          highlights: highlightsData?.map(h => ({ highlight: h.highlight })) || [],
          best_time: bestTimesData?.map(bt => ({ best_time_item: bt.best_time_item })) || [],
          physical_requirements: physicalRequirementsData?.map(pr => ({ requirement: pr.requirement })) || []
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
        console.error('Error fetching tour details (caught):', error) // Added (caught) for clarity
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
        .from('tour_images')
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
      console.error('Error deleting tour:', error)
      toast.error('Failed to delete tour')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading tour details...</div>
  }

  console.log('Tour object before render:', tour);

  if (!tour) {
    return <div className="p-6">Tour not found</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/tours">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tours
                </Link>
              </Button>
            <h1 className="text-3xl font-bold text-earth-900">{tour.title}</h1>
            {category && <span className="ml-2"><span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{category.name}</span></span>}
            <span className="ml-2"><span className={`inline-block text-xs px-2 py-1 rounded ${tour.status === 'active' ? 'bg-green-100 text-green-800' : tour.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-700'}`}>{tour.status}</span></span>
            </div>
            <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/tours/${tour.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Tour
                </Link>
              </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteTour} disabled={deleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete Tour'}
              </Button>
            </div>
          </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-gray-200">
                <div className="py-2 flex justify-between">
                  <dt className="font-semibold">Duration</dt>
                  <dd>{tour.duration || <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="font-semibold">Max Group Size</dt>
                  <dd>{tour.max_group_size || <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="font-semibold">Location</dt>
                  <dd>{tour.location || <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="font-semibold">Difficulty</dt>
                  <dd>{tour.difficulty ? <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">{tour.difficulty}</span> : <span className="text-gray-400">N/A</span>}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="font-semibold">Status</dt>
                  <dd>{tour.status}</dd>
                  </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-gray-200">
                <div className="py-2 flex justify-between">
                  <dt className="font-semibold">Price</dt>
                  <dd>${tour.price?.toFixed(2) || <span className="text-gray-400">N/A</span>}</dd>
                  </div>
                <div className="py-2 flex justify-between">
                  <dt className="font-semibold">Original Price</dt>
                  <dd>{tour.original_price !== undefined && tour.original_price !== null ? `$${tour.original_price.toFixed(2)}` : <span className="text-gray-400">N/A</span>}</dd>
                  </div>
              </dl>
            </CardContent>
          </Card>
              </div>

        {/* Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{tour.description || <span className="text-gray-400">No description provided.</span>}</p>
          </CardContent>
        </Card>

        {/* Experience & Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              {tour.highlights && tour.highlights.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {tour.highlights.map((h, index) => (
                      <li key={index}>{h.highlight}</li>
                    ))}
                  </ul>
              ) : <span className="text-gray-400">No highlights specified.</span>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Best Time to Visit</CardTitle>
            </CardHeader>
            <CardContent>
              {tour.best_time && tour.best_time.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {tour.best_time.map((bt, index) => (
                    <li key={index}>{bt.best_time_item}</li>
                          ))}
                        </ul>
              ) : <span className="text-gray-400">No best time specified.</span>}
            </CardContent>
          </Card>
                    </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Physical Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              {tour.physical_requirements && tour.physical_requirements.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {tour.physical_requirements.map((pr, index) => (
                    <li key={index}>{pr.requirement}</li>
                  ))}
                </ul>
              ) : <span className="text-gray-400">No physical requirements specified.</span>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inclusions & Exclusions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <h4 className="font-semibold mb-2">What's Included</h4>
                  {inclusions.length > 0 ? (
                    <ul className="space-y-2">
                      {inclusions.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2 text-green-600">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-gray-400">No inclusions specified.</span>}
                  </div>
                  <div>
                  <h4 className="font-semibold mb-2">What's Excluded</h4>
                  {exclusions.length > 0 ? (
                    <ul className="space-y-2">
                      {exclusions.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="mr-2 text-red-600">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-gray-400">No exclusions specified.</span>}
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tour Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div 
                    key={image.id || index} 
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openLightbox(index)}
                  >
                    <img 
                      src={image.image_url} 
                      alt={`Tour image ${index + 1}`} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Itinerary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tour Itinerary Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {itinerary.length > 0 ? (
              itinerary.map((day) => (
                <div key={day.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="mb-2 flex flex-wrap gap-4 items-center">
                    <span className="font-semibold text-lg">Day {day.day_number}</span>
                    {day.title && (
                      <span className="text-sm text-gray-700"><span className="font-semibold">Title:</span> {day.title}</span>
                    )}
                  </div>
                  <dl className="space-y-1">
                    <div>
                      <dt className="font-semibold">Description:</dt>
                      <dd>{day.description ? day.description : <span className="text-gray-400">No description</span>}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Location:</dt>
                      <dd>{day.location ? day.location : <span className="text-gray-400">No location</span>}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Activities:</dt>
                      <dd>
                        {day.activities && day.activities.length > 0 ? (
                          <ul className="list-disc list-inside ml-4">
                            {day.activities.map((activity, idx) => (
                              <li key={idx}>{activity}</li>
                            ))}
                          </ul>
                        ) : <span className="text-gray-400">No activities</span>}
                      </dd>
                    </div>
                  </dl>
      </div>
              ))
            ) : <span className="text-gray-400">No itinerary specified.</span>}
          </CardContent>
        </Card>

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