import { Suspense } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase"
import { getTourById } from "@/lib/tours"
import TourHero from "@/components/tours/tour-hero"
import TourDetails from "@/components/tours/tour-details"
import TourItinerary from "@/components/tours/tour-itinerary"
import TourInclusions from "@/components/tours/tour-inclusions"
import TourGallery from "@/components/tours/tour-gallery"
import TourReviews from "@/components/tours/tour-reviews"
import TourBooking from "@/components/tours/tour-booking"
import RelatedTours from "@/components/tours/related-tours"
import LoadingSpinner from "@/components/ui/loading-spinner"

// Fetch tour data from Supabase
const getTour = async (id: string) => {
  try {
    const supabase = createClient()
    const tour = await getTourById(supabase, parseInt(id))
    
    if (!tour) {
      return null
    }

    // Fetch tour images from Supabase storage
    const { data: imageData } = await supabase
      .from('tour_images')
      .select('image_url')
      .eq('tour_id', tour.id)

    // Fetch tour itinerary
    const { data: itineraryData } = await supabase
      .from('tour_itinerary')
      .select('*')
      .eq('tour_id', tour.id)
      .order('day_number')

    // Fetch tour inclusions
    const { data: inclusionsData } = await supabase
      .from('tour_inclusions')
      .select('item')
      .eq('tour_id', tour.id)

    // Fetch tour exclusions
    const { data: exclusionsData } = await supabase
      .from('tour_exclusions')
      .select('item')
      .eq('tour_id', tour.id)

    // Fetch tour highlights
    const { data: highlightsData } = await supabase
      .from('tour_highlights')
      .select('highlight')
      .eq('tour_id', tour.id)

    // Fetch tour best times
    const { data: bestTimeData } = await supabase
      .from('tour_best_times')
      .select('best_time_item')
      .eq('tour_id', tour.id)

    // Fetch tour physical requirements
    const { data: physicalReqData } = await supabase
      .from('tour_physical_requirements')
      .select('requirement')
      .eq('tour_id', tour.id)

    // Use actual images from Supabase storage
    const tourImages = imageData?.map(img => img.image_url) || []
    const featuredImage = tour.featured_image || tourImages[0] || "/placeholder.svg?height=600&width=1200"
    
    // Create gallery with actual images, fallback to placeholder if no images
    const gallery = tourImages.length > 0 ? tourImages : [
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
        "/placeholder.svg?height=400&width=600",
    ]

    // Transform data to match expected format  
    const transformedTour = {
      ...tour,
      image: featuredImage,
      gallery: gallery,
      duration: `${tour.duration} Days`,
      groupSize: `${tour.max_group_size || 12} People`,
      max_group_size: tour.max_group_size || 12,
      originalPrice: tour.original_price || undefined,
      reviewCount: tour.review_count,
      category: typeof tour.category === 'object' ? tour.category?.name || "General" : tour.category || "General",
      difficulty: tour.difficulty || "Moderate",
      highlights: highlightsData?.map(h => h.highlight) || [],
      itinerary: itineraryData?.map(item => ({
        day: item.day_number,
        title: item.title,
        description: item.description,
        activities: item.activities || [],
        accommodation: "Lodge/Hotel",
        meals: ["Breakfast", "Lunch", "Dinner"]
      })) || [],
      inclusions: {
        included: inclusionsData?.map(inc => inc.item) || [],
        excluded: exclusionsData?.map(exc => exc.item) || []
      },
      bestTime: bestTimeData?.map(bt => bt.best_time_item).join(", ") || "Year-round",
      physicalRequirements: physicalReqData?.map(pr => pr.requirement).join(". ") || "Moderate fitness required",
      whatToBring: [
        "Comfortable walking shoes",
        "Camera",
        "Sunscreen",
        "Insect repellent",
        "Personal medications"
      ]
    }

    return transformedTour
  } catch (error) {
    console.error("Error fetching tour:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) {
    return {
      title: "Tour Not Found",
    }
  }

  return {
    title: `${tour.title} | Samba Tours & Travel`,
    description: tour.description,
    openGraph: {
      title: tour.title,
      description: tour.description,
      images: [tour.image],
    },
  }
}

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const tour = await getTour(id)

  if (!tour) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <TourHero tour={tour} />

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <TourDetails tour={tour} />

              <Suspense fallback={<LoadingSpinner />}>
                <TourItinerary itinerary={tour.itinerary} />
              </Suspense>

                <Suspense fallback={<LoadingSpinner />}>
              <TourInclusions inclusions={tour.inclusions} />
                </Suspense>

              <Suspense fallback={<LoadingSpinner />}>
                <TourGallery gallery={tour.gallery} title={tour.title} />
              </Suspense>

              <Suspense fallback={<LoadingSpinner />}>
                <TourReviews tourId={tour.id} rating={tour.rating} reviewCount={tour.reviewCount} />
              </Suspense>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <TourBooking tour={tour as any} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingSpinner />}>
        <RelatedTours currentTour={tour} />
      </Suspense>
    </main>
  )
}
