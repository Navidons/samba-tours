import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { createClient, getAdminClient } from "./supabase"
import type { SupabaseClient } from '@supabase/supabase-js'

const supabase = createClientComponentClient<Database>()

export type ServiceCategory = Database['public']['Tables']['service_categories']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type ServiceFeature = Database['public']['Tables']['service_features']['Row']
export type ServiceImage = Database['public']['Tables']['service_images']['Row']

export type ServiceWithDetails = Service & {
  category: ServiceCategory | null
  features: ServiceFeature[]
  images: ServiceImage[]
}

// Fetch all services with their images
export async function getServices(supabase?: SupabaseClient<Database>) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('services')
    .select(`
      *,
      category:service_categories(*),
      features:service_features(*),
      images:service_images(*)
    `)
    .eq('status', 'active')
    .order('title')
  
  if (error) {
    console.error('Error fetching services:', error)
    throw error
  }
  
  return data as ServiceWithDetails[]
}

// Create a new service
export async function createService(
  service: Pick<Service, 'title' | 'description' | 'category_id' | 'status'>,
  images: File[]
) {
  try {
    const supabase = getAdminClient() // Use admin client for creation

    // Generate slug from title
    const slug = service.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Insert the service first
    const { data: newService, error: serviceError } = await supabase
      .from('services')
      .insert({
        ...service,
        slug
      })
      .select(`
        *,
        category:service_categories(*)
      `)
      .single()

    if (serviceError) {
      console.error('Error creating service:', serviceError)
      throw serviceError
    }

    if (!newService) {
      throw new Error('No data returned from service creation')
    }

    // Upload images and create image records
    const imagePromises = images.map(async (file, index) => {
      try {
        // Generate a unique file name
        const fileExt = file.name.split('.').pop()
        const fileName = `${newService.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        // Convert file to buffer for upload
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload the file
        const { error: uploadError } = await supabase
          .storage
          .from('services')
          .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true
          })

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          throw uploadError
        }

        // Get file metadata
        const { data: { publicUrl } } = supabase
          .storage
          .from('services')
          .getPublicUrl(fileName)

        // Create image record
        const { data: image, error: imageError } = await supabase
          .from('service_images')
          .insert({
            service_id: newService.id,
            url: publicUrl,
            alt_text: file.name,
            is_primary: index === 0 // First image is primary
          })
          .select()
          .single()

        if (imageError) {
          console.error('Error creating image record:', imageError)
          throw imageError
        }

        if (!image) {
          throw new Error('No data returned from image creation')
        }

        return { ...image, url: publicUrl }
      } catch (error) {
        console.error('Error processing image:', error)
        throw error
      }
    })

    const serviceImages = await Promise.all(imagePromises)

    return {
      ...newService,
      images: serviceImages
    }
  } catch (error) {
    console.error('Error in createService:', error)
    throw error
  }
}

// Update a service
export async function updateService(
  id: string,
  service: Partial<Pick<Service, 'title' | 'description' | 'category_id' | 'status'>>,
  newImages: File[] = [],
  deletedImageIds: string[] = []
) {
  try {
    const supabase = getAdminClient() // Use admin client for updates

    // Update service details
    const { data: updatedService, error: serviceError } = await supabase
      .from('services')
      .update(service)
      .eq('id', id)
      .select(`
        *,
        category:service_categories(*)
      `)
      .single()

    if (serviceError) {
      console.error('Error updating service:', serviceError)
      throw serviceError
    }

    if (!updatedService) {
      throw new Error('No data returned from service update')
    }

    // Delete removed images
    if (deletedImageIds.length > 0) {
      try {
        const { data: imagesToDelete, error: fetchError } = await supabase
          .from('service_images')
          .select('storage_path')
          .in('id', deletedImageIds)

        if (fetchError) {
          console.error('Error fetching images to delete:', fetchError)
          throw fetchError
        }

        // Delete from storage
        await Promise.all(
          imagesToDelete.map(async (img) => {
            const { error: deleteStorageError } = await supabase
              .storage
              .from('services')
              .remove([img.storage_path])

            if (deleteStorageError) {
              console.error('Error deleting image from storage:', deleteStorageError)
              throw deleteStorageError
            }
          })
        )

        // Delete records
        const { error: deleteError } = await supabase
          .from('service_images')
          .delete()
          .in('id', deletedImageIds)

        if (deleteError) {
          console.error('Error deleting image records:', deleteError)
          throw deleteError
        }
      } catch (error) {
        console.error('Error handling image deletion:', error)
        throw error
      }
    }

    // Upload new images
    const newImagePromises = newImages.map(async (file) => {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase
          .storage
          .from('services')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Error uploading new image:', uploadError)
          throw uploadError
        }

        const { data: { publicUrl } } = supabase
          .storage
          .from('services')
          .getPublicUrl(fileName)

        const { data: image, error: imageError } = await supabase
          .from('service_images')
          .insert({
            service_id: id,
            storage_path: fileName,
            file_name: file.name,
            mime_type: file.type,
            size: file.size,
            alt_text: file.name
          })
          .select()
          .single()

        if (imageError) {
          console.error('Error creating new image record:', imageError)
          throw imageError
        }

        if (!image) {
          throw new Error('No data returned from new image creation')
        }

        return { ...image, url: publicUrl }
      } catch (error) {
        console.error('Error processing new image:', error)
        throw error
      }
    })

    const newServiceImages = await Promise.all(newImagePromises)

    // Get all current images
    const { data: currentImages, error: imagesError } = await supabase
      .from('service_images')
      .select('*')
      .eq('service_id', id)

    if (imagesError) {
      console.error('Error fetching current images:', imagesError)
      throw imagesError
    }

    const imagesWithUrls = await Promise.all(
      currentImages.map(async (image) => {
        const { data: { publicUrl } } = supabase
          .storage
          .from('services')
          .getPublicUrl(image.storage_path)

        return { ...image, url: publicUrl }
      })
    )

    return {
      ...updatedService,
      images: imagesWithUrls
    }
  } catch (error) {
    console.error('Error in updateService:', error)
    throw error
  }
}

// Delete a service
export async function deleteService(id: string) {
  try {
    const supabase = getAdminClient() // Use admin client for deletion

    // First, get all images associated with the service
    const { data: images, error: imagesError } = await supabase
      .from('service_images')
      .select('storage_path')
      .eq('service_id', id)

    if (imagesError) {
      console.error('Error fetching service images:', imagesError)
      throw imagesError
    }

    // Delete all images from storage
    if (images && images.length > 0) {
      try {
        const { error: storageError } = await supabase
          .storage
          .from('services')
          .remove(images.map(img => img.storage_path))

        if (storageError) {
          console.error('Error deleting images from storage:', storageError)
          throw storageError
        }
      } catch (error) {
        console.error('Error in storage deletion:', error)
        throw error
      }
    }

    // Delete the service (this will cascade delete the image records due to FK constraint)
    const { error: deleteError } = await supabase
      .from('services')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Error deleting service:', deleteError)
      throw deleteError
    }

    return true
  } catch (error) {
    console.error('Error in deleteService:', error)
    throw error instanceof Error ? error : new Error('Failed to delete service: ' + JSON.stringify(error))
  }
}

// Get service categories
export async function getServiceCategories(supabase?: SupabaseClient<Database>) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('service_categories')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Error fetching service categories:', error)
    throw error
  }
  
  return data
}

// Create service category
export async function createServiceCategory(
  category: Pick<ServiceCategory, 'name' | 'description'>
) {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .insert(category)
      .select()
      .single()

    if (error) {
      console.error('Error creating service category:', error)
      throw error
    }

    if (!data) {
      throw new Error('No data returned from service category creation')
    }

    return data
  } catch (error) {
    console.error('Error in createServiceCategory:', error)
    throw error
  }
}

// Update service category
export async function updateServiceCategory(
  id: string,
  category: Partial<Pick<ServiceCategory, 'name' | 'description'>>
) {
  const { data, error } = await supabase
    .from('service_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete service category
export async function deleteServiceCategory(id: string) {
  const { error } = await supabase
    .from('service_categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Update image primary status
export async function updateImagePrimary(imageId: string, serviceId: string) {
  // First, set all images of this service to non-primary
  const { error: resetError } = await supabase
    .from('service_images')
    .update({ is_primary: false })
    .eq('service_id', serviceId)

  if (resetError) throw resetError

  // Then set the selected image as primary
  const { data, error } = await supabase
    .from('service_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Function to get a single service category by slug
export async function getServiceCategoryBySlug(slug: string, supabase?: SupabaseClient<Database>) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('service_categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching service category:', error)
    throw error
  }
  
  return data
}

// Function to get services by category
export async function getServicesByCategory(categorySlug: string, supabase?: SupabaseClient<Database>) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('services')
    .select(`
      *,
      category:service_categories(*),
      features:service_features(*),
      images:service_images(*)
    `)
    .eq('status', 'active')
    .eq('category.slug', categorySlug)
    .order('title')
  
  if (error) {
    console.error('Error fetching services by category:', error)
    throw error
  }
  
  return data as ServiceWithDetails[]
}

// Function to get a single service by slug
export async function getServiceBySlug(slug: string, supabase?: SupabaseClient<Database>) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('services')
    .select(`
      *,
      category:service_categories(*),
      features:service_features(*),
      images:service_images(*)
    `)
    .eq('slug', slug)
    .single()
  
  if (error) {
    console.error('Error fetching service:', error)
    throw error
  }
  
  return data as ServiceWithDetails
}

// Function to search services
export async function searchServices(query: string, supabase?: SupabaseClient<Database>) {
  const client = supabase || createClient()
  
  const { data, error } = await client
    .from('services')
    .select(`
      *,
      category:service_categories(*),
      features:service_features(*),
      images:service_images(*)
    `)
    .eq('status', 'active')
    .or(`
      title.ilike.%${query}%,
      description.ilike.%${query}%,
      short_description.ilike.%${query}%
    `)
    .order('title')
  
  if (error) {
    console.error('Error searching services:', error)
    throw error
  }
  
  return data as ServiceWithDetails[]
} 