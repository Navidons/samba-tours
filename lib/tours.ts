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
  highlights?: { highlight: string }[]
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
  try {
    const { data: tour, error } = await supabase.from("tours").update(tourData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating tour:", error)
      return null
    }

    return tour as Tour
  } catch (error) {
    console.error("Error in updateTour:", error)
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
