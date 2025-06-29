import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { SupabaseClient } from "@supabase/supabase-js"

export interface Tour {
  id: number
  title: string
  slug: string
  description: string
  short_description: string
  price: number
  original_price?: number | null
  duration: string
  max_group_size?: number | null
  difficulty?: string | null
  location: string
  featured_image: string | null
  status: "active" | "draft" | "inactive"
  featured?: boolean
  rating: number
  review_count: number
  created_at: string
  updated_at: string
  category_id: number
  category?: {
    id: number
    name: string
    slug: string
  }
  highlights?: string[]
}

export interface TourCategory {
  id: number
  name: string
  slug: string
  description: string | null
}

export async function getAllTours(supabase: SupabaseClient): Promise<Tour[]> {
  try {
    const { data: tours, error } = await supabase
      .from("tours")
      .select(`
        *,
        category:tour_categories(id, name, slug)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching tours:", error)
      return []
    }

    return tours as Tour[] || []
  } catch (error) {
    console.error("Error in getAllTours:", error)
    return []
  }
}

export async function getAllToursAdmin(supabase: SupabaseClient): Promise<Tour[]> {
  try {
    const { data: tours, error } = await supabase
      .from("tours")
      .select(`
        *,
        category:tour_categories(id, name, slug)
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching admin tours:", error)
      return []
    }

    return tours as Tour[] || []
  } catch (error) {
    console.error("Error in getAllToursAdmin:", error)
    return []
  }
}

export async function getTourBySlug(supabase: SupabaseClient, slug: string): Promise<Tour | null> {
  try {
    const { data: tour, error } = await supabase
      .from("tours")
      .select(`
        *,
        category:tour_categories(id, name, slug)
      `)
      .eq("slug", slug)
      .eq("status", "active")
      .single()

    if (error) {
      console.error("Error fetching tour by slug:", error)
      return null
    }

    return tour as Tour
  } catch (error) {
    console.error("Error in getTourBySlug:", error)
    return null
  }
}

export async function getTourById(supabase: SupabaseClient, id: number): Promise<Tour | null> {
  try {
    const { data: tour, error } = await supabase
      .from("tours")
      .select(`
        *,
        category:tour_categories(id, name, slug)
      `)
      .eq("id", id)
      .eq("status", "active")
      .single()

    if (error) {
      console.error("Error fetching tour by ID:", error)
      return null
    }

    return tour as Tour
  } catch (error) {
    console.error("Error in getTourById:", error)
    return null
  }
}

export async function getTourCategories(supabase: SupabaseClient): Promise<TourCategory[]> {
  try {
    const { data: categories, error } = await supabase.from("tour_categories").select("*").order("name")

    if (error) {
      console.error("Error fetching tour categories:", error)
      return []
    }

    return categories || []
  } catch (error) {
    console.error("Error in getTourCategories:", error)
    return []
  }
}

export async function createTour(supabase: SupabaseClient, tourData: Partial<Tour>): Promise<Tour | null> {
  try {
    const { data: tour, error } = await supabase.from("tours").insert([tourData]).select().single()

    if (error) {
      console.error("Error creating tour:", error)
      return null
    }

    return tour as Tour
  } catch (error) {
    console.error("Error in createTour:", error)
    return null
  }
}

export async function updateTour(supabase: SupabaseClient, id: number, tourData: Partial<Tour>): Promise<Tour | null> {
  // Validate input
  if (!supabase) {
    console.error("Supabase client is undefined")
    return null
  }

  if (!id || typeof id !== 'number') {
    console.error("Invalid tour ID:", id)
    return null
  }

  if (!tourData || Object.keys(tourData).length === 0) {
    console.error("No tour data provided for update")
    return null
  }

  try {
    console.log("Updating tour with ID:", id)
    console.log("Tour data to update:", JSON.stringify(tourData, null, 2))

    // Remove undefined or null values and validate data types
    const cleanedTourData: any = {}
    
    // Validate and clean each field
    const validFields: (keyof Tour)[] = [
      'title', 'slug', 'description', 'short_description',
      'price', 'original_price', 'duration', 'max_group_size',
      'difficulty', 'location', 'featured_image', 'status',
      'category_id'
    ]

    validFields.forEach(field => {
      const value = tourData[field]
      
      // Type checking and validation
      switch (field) {
        case 'status':
          const validStatuses: Tour['status'][] = ['active', 'draft', 'inactive']
          if (value !== undefined) {
            const status = value as Tour['status']
            if (validStatuses.includes(status)) {
              cleanedTourData.status = status
            }
          }
          break
        case 'title':
          if (typeof value === 'string' && value.trim().length >= 3) {
            cleanedTourData[field] = value
          }
          break
        case 'slug':
        case 'description':
          if (typeof value === 'string' && value.trim().length >= 10) {
            cleanedTourData[field] = value
          }
          break
        case 'short_description':
        case 'duration':
        case 'location':
        case 'featured_image':
          if (typeof value === 'string' && value.trim() !== '') {
            cleanedTourData[field] = value
          }
          break
        case 'price':
        case 'original_price':
          if (typeof value === 'number' && !isNaN(value) && value > 0) {
            cleanedTourData[field] = value
          }
          break
        case 'max_group_size':
          if (typeof value === 'number' && value > 0) {
            cleanedTourData[field] = value
          }
          break
        case 'difficulty':
          const validDifficulties = ['Easy', 'Moderate', 'Challenging', 'Strenuous']
          if (typeof value === 'string' && validDifficulties.includes(value)) {
            cleanedTourData[field] = value
          }
          break
        case 'category_id':
          if (typeof value === 'number' && value > 0) {
            cleanedTourData[field] = value
          }
          break
      }
    })

    console.log("Cleaned tour data:", JSON.stringify(cleanedTourData, null, 2))

    // Validate cleaned data
    if (Object.keys(cleanedTourData).length === 0) {
      console.error("No valid fields to update after cleaning")
      return null
    }

    // Perform the update
    const { data: tour, error } = await supabase
      .from("tours")
      .update(cleanedTourData)
      .eq("id", id)
      .select()
      .single()

    console.log("Supabase Update Response:", { tour, error })

    if (error) {
      console.error("Detailed Supabase Update Error:", {
        message: error.message,
        details: error,
        code: error.code,
        hint: error.hint,
        tourId: id,
        cleanedData: cleanedTourData
      })
      return null
    }

    if (!tour) {
      console.error("No tour returned from update", {
        tourId: id,
        cleanedData: cleanedTourData
      })
      return null
    }

    console.log("Tour updated successfully:", JSON.stringify(tour, null, 2))
    return tour as Tour
  } catch (error) {
    console.error("Comprehensive Error in updateTour:", {
      error,
      message: (error as Error).message,
      stack: (error as Error).stack,
      tourId: id,
      tourData: tourData
    })
    return null
  }
}

export async function deleteTour(supabase: SupabaseClient, id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("tours").delete().eq("id", id)

    if (error) {
      console.error("Error deleting tour:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteTour:", error)
    return false
  }
}

export async function getToursByCategory(
  supabase: SupabaseClient, 
  categoryId: number, 
  limit: number = 2
): Promise<Tour[]> {
  try {
    const { data: tours, error } = await supabase
      .from("tours")
      .select(`
        *,
        category:tour_categories(id, name, slug)
      `)
      .eq("category_id", categoryId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching tours by category:", error)
      return []
    }

    return tours as Tour[] || []
  } catch (error) {
    console.error("Error in getToursByCategory:", error)
    return []
  }
}
