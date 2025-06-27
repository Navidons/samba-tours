import { NextResponse } from "next/server"
import { getAllTours } from "@/lib/tours"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextRequest } from "next/server"

export async function GET() {
  try {
    const supabase = createClient()
    const tours = await getAllTours(supabase)
    return NextResponse.json(tours)
  } catch (error) {
    console.error("Error in tours API:", error)
    return NextResponse.json({ error: "Failed to fetch tours" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const supabase = createClient()

  try {
    const tourData = await req.json()
    const { 
      title, 
      category_id, 
      description, 
      duration, 
      price, 
      max_guests, 
      images, 
      itinerary, 
      inclusions, 
      exclusions 
    } = tourData

    // Validate required fields
    if (!title || !category_id || !description || !duration || !price) {
      return NextResponse.json({ error: "Missing required tour information" }, { status: 400 })
    }

    // Insert tour
    const { data: tourInsertData, error: tourInsertError } = await supabase
      .from('tours')
      .insert({
        title,
        category_id,
        description,
        duration,
        price: parseFloat(price),
        max_guests: max_guests ? parseInt(max_guests) : null,
        featured_image: images.length > 0 ? images[0] : null,
      })
      .select('id')

    if (tourInsertError) {
      console.error("Tour Insert Error:", tourInsertError)
      return NextResponse.json({ error: "Failed to create tour" }, { status: 500 })
    }

    const newTourId = tourInsertData[0].id

    // Insert tour itinerary
    if (itinerary && itinerary.length > 0) {
      const itineraryInserts = itinerary.map((day: any) => ({
        tour_id: newTourId,
        day: day.day,
        title: day.title,
        location: day.location,
        activities: day.activities,
      }))

      const { error: itineraryInsertError } = await supabase
        .from('tour_itinerary')
        .insert(itineraryInserts)

      if (itineraryInsertError) {
        console.error("Itinerary Insert Error:", itineraryInsertError)
      }
    }

    // Insert inclusions and exclusions
    if (inclusions && inclusions.length > 0) {
      const inclusionInserts = inclusions.map((inclusion: string) => ({
        tour_id: newTourId,
        item: inclusion,
        type: 'included',
      }))

      await supabase.from('tour_services').insert(inclusionInserts)
    }

    if (exclusions && exclusions.length > 0) {
      const exclusionInserts = exclusions.map((exclusion: string) => ({
        tour_id: newTourId,
        item: exclusion,
        type: 'excluded',
      }))

      await supabase.from('tour_services').insert(exclusionInserts)
    }

    return NextResponse.json({ 
      id: newTourId, 
      message: "Tour created successfully" 
    }, { status: 201 })

  } catch (error) {
    console.error("Unexpected Error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
