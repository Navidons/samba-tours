import { NextResponse } from "next/server"
import { getAllTours, createTour } from "@/lib/tours"
import { createClient, createAdminClient } from "@/lib/supabase"
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
  const supabase = createClient() // Regular client for reading
  const adminSupabase = createAdminClient() // Admin client for writing

  try {
    const formData = await req.formData()

    const title = formData.get('title') as string
    const category_id = parseInt(formData.get('category_id') as string)
    const description = formData.get('description') as string
    const duration = formData.get('duration') as string
    const price = parseFloat(formData.get('price') as string)
    const original_price = formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : null;
    const max_group_size = formData.get('max_group_size') ? parseInt(formData.get('max_group_size') as string) : null;
    const status = formData.get('status') as "active" | "draft" | "inactive"
    const location = formData.get('location') as string
    const difficulty = formData.get('difficulty') as string | null

    const itineraryRaw = formData.get('itinerary') as string
    const inclusionsRaw = formData.get('inclusions') as string
    const exclusionsRaw = formData.get('exclusions') as string
    const highlightsRaw = formData.get('highlights') as string
    const bestTimeRaw = formData.get('best_time') as string
    const physicalRequirementsRaw = formData.get('physical_requirements') as string

    const itinerary = JSON.parse(itineraryRaw)
    const inclusions = JSON.parse(inclusionsRaw)
    const exclusions = JSON.parse(exclusionsRaw)
    const highlights = JSON.parse(highlightsRaw)
    const best_time = JSON.parse(bestTimeRaw)
    const physical_requirements = JSON.parse(physicalRequirementsRaw)

    // Convert highlights from form format to database format
    const highlightsArray = Array.isArray(highlights) 
      ? highlights.map((item: any) => typeof item === 'string' ? item : item.highlight || '').filter((str: string) => str.trim() !== '')
      : []

    // Handle image files
    const imageFiles: File[] = []
    const receivedImages = formData.getAll('images');
    for (const value of receivedImages) {
      if (typeof value === 'object' && value !== null && value instanceof File) {
        imageFiles.push(value);
      } else {
        console.warn('Received non-file or invalid data for images, skipping:', value);
      }
    }

    // Validate required fields
    if (!title || !category_id || price <= 0 || !location) {
      return NextResponse.json({ error: "Missing required tour information" }, { status: 400 })
    }

    const tourSlug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Upload images to Supabase Storage
    const newImageUrls: string[] = []
    for (const imageFile of imageFiles) {
      try {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `tours/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        console.log("Uploading image:", {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size,
          lastModified: imageFile.lastModified,
        });

        const parts = imageFile.name.split('.');
        const inferredFileExt = parts.length > 1 ? parts.pop()?.toLowerCase() : ''; // Get extension safely and lowercase

        let contentType = imageFile.type;

        // Only attempt to infer if the provided type is generic or missing
        if (!contentType || contentType === 'application/octet-stream') {
          switch (inferredFileExt) {
            case 'jpg':
            case 'jpeg':
              contentType = 'image/jpeg';
              break;
            case 'png':
              contentType = 'image/png';
              break;
            case 'gif':
              contentType = 'image/gif';
              break;
            case 'webp':
              contentType = 'image/webp';
              break;
            case 'svg':
              contentType = 'image/svg+xml';
              break;
            default:
              // If no specific image type found, keep as application/octet-stream or fall back to a common type
              // For now, let's let Supabase decide if it can infer from file name, or fail if truly unsupported.
              break;
          }
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('tour-images') // Updated bucket name
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true,
            contentType: contentType // Explicitly set content type
          })

        if (uploadError) {
          console.error("Image Upload Error Details:", {
            message: uploadError.message,
            name: uploadError.name,
          })
          return NextResponse.json({ error: `Failed to upload image: ${uploadError.message}` }, { status: 500 })
        }

        const { data: { publicUrl } } = supabase.storage
          .from('tour-images') // Updated bucket name
          .getPublicUrl(fileName)

        newImageUrls.push(publicUrl)
      } catch (imageUploadError) {
        console.error("Unexpected Image Upload Error:", imageUploadError)
        return NextResponse.json({ error: "An unexpected error occurred while uploading images" }, { status: 500 })
      }
    }

    const featuredImage = newImageUrls.length > 0 ? newImageUrls[0] : null;

    // Create new tour using the createTour function
    const tourDataToCreate = {
      title,
      category_id,
      description,
      duration,
      price,
      original_price,
      max_group_size,
      featured_image: featuredImage,
      status,
      location,
      difficulty,
      best_time: JSON.stringify(best_time),
      physical_requirements: JSON.stringify(physical_requirements),
      highlights: highlightsArray,
      slug: tourSlug,
    };

    const newTour = await createTour(adminSupabase, tourDataToCreate);

    if (!newTour) {
      throw new Error("Failed to create tour")
    }

    const newTourId = newTour.id;

    // Insert tour images
    if (newImageUrls.length > 0) {
      try {
        const imageInserts = newImageUrls.map(url => ({
          tour_id: newTourId,
          image_url: url,
        }))

        const { error: imageInsertError } = await adminSupabase
          .from('tour_images')
          .insert(imageInserts)

        if (imageInsertError) {
          console.error("Detailed Image Insert Error:", {
            message: imageInsertError.message,
            hint: imageInsertError.hint,
          })
          throw imageInsertError
        }
      } catch (imageOperationError) {
        console.error("Comprehensive Image Operation Error:", imageOperationError)
        return NextResponse.json({ error: "An unexpected error occurred while managing tour images" }, { status: 500 })
      }
    }

    // Insert tour itinerary
    if (itinerary.length > 0) {
      try {
        const itineraryInserts = itinerary.map((day: any) => ({
          tour_id: newTourId,
          day_number: day.day_number,
          title: day.title,
          location: day.location,
          description: day.description,
          activities: day.activities,
        }))

        const validItineraryInserts = itineraryInserts.filter((item: any) =>
          item.tour_id &&
          item.day_number &&
          (item.title || item.location || item.description || item.activities?.length > 0)
        )

        if (validItineraryInserts.length > 0) {
          const { error: itineraryError } = await adminSupabase
            .from('tour_itinerary')
            .insert(validItineraryInserts)

          if (itineraryError) {
            console.error("Detailed Itinerary Insert Error:", {
              message: itineraryError.message,
              hint: itineraryError.hint,
            })
            throw itineraryError
          }
        }
      } catch (itineraryError) {
        console.error("Comprehensive Itinerary Error:", itineraryError)
        return NextResponse.json({ error: `Failed to save tour itinerary: ${(itineraryError as Error).message || 'Unknown error'}` }, { status: 500 })
      }
    }

    // Insert tour inclusions
    if (inclusions.length > 0) {
      try {
        const inclusionInserts = inclusions.map((item: string) => ({
          tour_id: newTourId,
          item,
        }));

        const { error: insertInclusionsError } = await adminSupabase
          .from('tour_inclusions')
          .insert(inclusionInserts);

        if (insertInclusionsError) {
          console.error("Detailed Inclusions Insert Error:", {
            message: insertInclusionsError.message,
            hint: insertInclusionsError.hint,
          });
          throw insertInclusionsError;
        }
      } catch (inclusionsError) {
        console.error("Comprehensive Inclusions Error:", inclusionsError);
        return NextResponse.json({ error: `Failed to save tour inclusions: ${(inclusionsError as Error).message || 'Unknown error'}` }, { status: 500 })
      }
    }

    // Insert tour exclusions
    if (exclusions.length > 0) {
      try {
        const exclusionInserts = exclusions.map((item: string) => ({
          tour_id: newTourId,
          item,
        }));

        const { error: insertExclusionsError } = await adminSupabase
          .from('tour_exclusions')
          .insert(exclusionInserts);

        if (insertExclusionsError) {
          console.error("Detailed Exclusions Insert Error:", {
            message: insertExclusionsError.message,
            hint: insertExclusionsError.hint,
          });
          throw insertExclusionsError;
        }
      } catch (exclusionsError) {
        console.error("Comprehensive Exclusions Error:", exclusionsError);
        return NextResponse.json({ error: `Failed to save tour exclusions: ${(exclusionsError as Error).message || 'Unknown error'}` }, { status: 500 })
      }
    }

    // Insert tour highlights
    if (highlights.length > 0) {
      try {
        const highlightInserts = highlights.map((item: string, index: number) => ({
          tour_id: newTourId,
          highlight: item,
          order_index: index + 1,
        }));

        const { error: insertHighlightsError } = await adminSupabase
          .from('tour_highlights')
          .insert(highlightInserts);

        if (insertHighlightsError) {
          console.error("Detailed Highlights Insert Error:", {
            message: insertHighlightsError.message,
            hint: insertHighlightsError.hint,
          });
          throw insertHighlightsError;
        }
      } catch (highlightsError) {
        console.error("Comprehensive Highlights Error:", highlightsError);
        return NextResponse.json({ error: `Failed to save tour highlights: ${(highlightsError as Error).message || 'Unknown error'}` }, { status: 500 })
      }
    }

    // Insert tour best times
    if (best_time.length > 0) {
      try {
        const bestTimeInserts = best_time.map((item: string) => ({
          tour_id: newTourId,
          best_time_item: item,
        }));

        const { error: insertBestTimeError } = await adminSupabase
          .from('tour_best_times')
          .insert(bestTimeInserts);

        if (insertBestTimeError) {
          console.error("Detailed Best Time Insert Error:", {
            message: insertBestTimeError.message,
            hint: insertBestTimeError.hint,
          });
          throw insertBestTimeError;
        }
      } catch (bestTimeError) {
        console.error("Comprehensive Best Time Error:", bestTimeError);
        return NextResponse.json({ error: `Failed to save tour best times: ${(bestTimeError as Error).message || 'Unknown error'}` }, { status: 500 })
      }
    }

    // Insert tour physical requirements
    if (physical_requirements.length > 0) {
      try {
        const physicalRequirementsInserts = physical_requirements.map((item: string) => ({
          tour_id: newTourId,
          requirement: item,
        }));

        const { error: insertPhysicalRequirementsError } = await adminSupabase
          .from('tour_physical_requirements')
          .insert(physicalRequirementsInserts);

        if (insertPhysicalRequirementsError) {
          console.error("Detailed Physical Requirements Insert Error:", {
            message: insertPhysicalRequirementsError.message,
            hint: insertPhysicalRequirementsError.hint,
          });
          throw insertPhysicalRequirementsError;
        }
      } catch (physicalRequirementsError) {
        console.error("Comprehensive Physical Requirements Error:", physicalRequirementsError);
        return NextResponse.json({ error: `Failed to save tour physical requirements: ${(physicalRequirementsError as Error).message || 'Unknown error'}` }, { status: 500 })
      }
    }

    return NextResponse.json({ id: newTourId, message: "Tour created successfully" }, { status: 201 })

  } catch (error) {
    console.error("Unexpected Error:", error)
    return NextResponse.json({ error: `An unexpected error occurred: ${(error as Error).message || 'Unknown error'}` }, { status: 500 })
  }
}