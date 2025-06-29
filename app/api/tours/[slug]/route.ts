import { NextResponse } from "next/server"
import { getTourBySlug } from "@/lib/tours"
import { createClient } from "@/lib/supabase"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const supabase = createClient()
    const tour = await getTourBySlug(supabase, params.slug)

    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 })
    }

    return NextResponse.json(tour)
  } catch (error) {
    console.error("Error in tour API:", error)
    return NextResponse.json({ error: "Failed to fetch tour" }, { status: 500 })
  }
}