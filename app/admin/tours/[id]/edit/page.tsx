"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient, createAdminClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { getTourCategories, TourCategory, updateTour, Tour } from "@/lib/tours"

interface TourImageData {
  image_url: string;
}

interface TourInclusionData {
  item: string;
}

interface TourExclusionData {
  item: string;
}

interface ImageFile {
  file: File
  preview: string
  isNew: boolean
}

interface TourItinerary {
  id?: number
  day_number: number
  title: string
  location: string
  description: string
  activities: string[]
}

// Define predefined lists for inclusions and exclusions
const predefinedInclusions = [
  "Accommodation",
  "Meals as specified",
  "Transportation",
  "Park entrance fees",
  "Guide services",
];

const predefinedExclusions = [
  "International flights",
  "Visa fees",
  "Travel insurance",
  "Personal expenses",
  "Tips and gratuities",
];

export default function EditTour() {
  const params = useParams()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [customInclusionInput, setCustomInclusionInput] = useState('');
  const [customExclusionInput, setCustomExclusionInput] = useState('');
  const [customPhysicalRequirementInput, setCustomPhysicalRequirementInput] = useState('');

  const [formData, setFormData] = useState<Tour & {
    itinerary: TourItinerary[]
    inclusions: string[]
    exclusions: string[]
    location?: string
    difficulty?: string | null
    highlights: string[]
    best_time: string[]
    physical_requirements: string[]
  }>({
    id: 0,
    title: "",
    slug: "",
    short_description: "",
    description: "",
    duration: "",
    price: 0,
    original_price: null,
    max_group_size: null,
    featured_image: null,
    status: "draft",
    rating: 0,
    review_count: 0,
    created_at: "",
    updated_at: "",
    category_id: 0,
    category: undefined,
    highlights: [],
    best_time: [],
    physical_requirements: [],
    itinerary: [{ day_number: 1, title: "", location: "", description: "", activities: [] }],
    inclusions: [],
    exclusions: [],
    location: "",
    difficulty: null,
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<TourCategory[]>([])
  const [images, setImages] = useState<ImageFile[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  // Fetch tour details and categories on component mount
  useEffect(() => {
    const fetchTourAndCategories = async () => {
      try {
        const supabase = createClient()
        const tourId = params.id as string

        // Fetch tour details
        const { data: tourData, error: tourError } = await supabase
          .from('tours')
          .select('*')
          .eq('id', tourId)
          .single()

        if (tourError) {
          throw tourError
        }

        // Fetch tour images
        const { data: imageData, error: imageError } = await supabase
          .from('tour_images')
          .select('image_url')
          .eq('tour_id', tourId) as { data: TourImageData[] | null, error: any }

        if (imageError) {
          console.warn('Error fetching tour images:', imageError)
        }

        // Fetch tour itinerary
        const { data: itineraryData, error: itineraryError } = await supabase
          .from('tour_itinerary')
          .select('id, day_number, title, location, description, activities')
          .eq('tour_id', tourId)
          .order('day_number')

        if (itineraryError) {
          console.warn('Error fetching tour itinerary:', itineraryError)
        }

        // Fetch tour inclusions
        const { data: inclusionsData, error: inclusionsError } = await supabase
          .from('tour_inclusions')
          .select('item')
          .eq('tour_id', tourId) as { data: TourInclusionData[] | null, error: any }

        if (inclusionsError) {
          console.warn('Error fetching tour inclusions:', inclusionsError)
        }

        // Fetch tour exclusions
        const { data: exclusionsData, error: exclusionsError } = await supabase
          .from('tour_exclusions')
          .select('item')
          .eq('tour_id', tourId) as { data: TourExclusionData[] | null, error: any }

        if (exclusionsError) {
          console.warn('Error fetching tour exclusions:', exclusionsError)
        }

        // Fetch tour highlights
        const { data: highlightsData, error: highlightsError } = await supabase
          .from('tour_highlights')
          .select('highlight')
          .eq('tour_id', tourId)
          .order('order_index')

        if (highlightsError) {
          console.warn('Error fetching tour highlights:', highlightsError)
        }

        console.log('Fetched highlights data:', highlightsData)

        // Fetch categories
        const categories = await getTourCategories(supabase)
        
        setFormData({
          id: tourData.id as number,
          title: tourData.title as string,
          slug: tourData.slug as string,
          short_description: tourData.short_description as string,
          description: tourData.description as string,
          duration: tourData.duration as string,
          price: tourData.price as number,
          original_price: tourData.original_price as number | null,
          max_group_size: tourData.max_group_size as number | null,
          featured_image: tourData.featured_image as string | null,
          status: tourData.status as "active" | "draft" | "inactive",
          rating: tourData.rating as number,
          review_count: tourData.review_count as number,
          created_at: tourData.created_at as string,
          updated_at: tourData.updated_at as string,
          category_id: tourData.category_id as number,
          category: tourData.category as TourCategory | undefined,
          highlights: highlightsData?.map(h => h.highlight) || [],
          best_time: Array.isArray(tourData.best_time)
            ? tourData.best_time
            : typeof tourData.best_time === 'string' && tourData.best_time.trim().startsWith('[')
              ? JSON.parse(tourData.best_time)
              : [],
          physical_requirements: Array.isArray(tourData.physical_requirements)
            ? tourData.physical_requirements
            : typeof tourData.physical_requirements === 'string' && tourData.physical_requirements.trim().startsWith('[')
              ? JSON.parse(tourData.physical_requirements)
              : [],
          itinerary: itineraryData?.length ? itineraryData.map((item: any) => ({
            id: item.id as number,
            day_number: item.day_number as number,
            title: item.title as string,
            location: item.location as string,
            description: item.description as string || "", // Ensure description is a string
            activities: item.activities as string[] || [] // Ensure activities is an array
          })) : [{ day_number: 1, title: "", location: "", description: "", activities: [] }],
          inclusions: inclusionsData?.map(inc => inc.item) || [],
          exclusions: exclusionsData?.map(exc => exc.item) || [],
          location: tourData.location ?? "",
          difficulty: tourData.difficulty as string | null | undefined,
        })

        // Set existing images
        if (imageData) {
          setExistingImages(imageData.map(img => img.image_url))
        }

        setCategories(categories)
      } catch (error) {
        console.error('Error fetching tour details:', error)
        toast.error('Failed to load tour details')
        router.push('/admin/tours')
      } finally {
        setLoading(false)
      }
    }

    fetchTourAndCategories()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "number" ? parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      category_id: parseInt(value, 10),
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      const newImageFiles: ImageFile[] = newFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true
      }))

      setImages(prev => [...prev, ...newImageFiles])
    }
  }

  const removeImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index))
    } else {
      // Revoke object URL for new images
      URL.revokeObjectURL(images[index].preview)
      setImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleItineraryChange = (index: number, field: keyof TourItinerary, value: string) => {
    const newItinerary = [...formData.itinerary]
    if (field === 'activities') {
      newItinerary[index] = { ...newItinerary[index], [field]: value.split('\n').map(item => item.trim()) }
    } else {
      newItinerary[index] = { ...newItinerary[index], [field]: value }
    }
    setFormData((prevData) => ({ ...prevData, itinerary: newItinerary }))
  }

  const addItineraryDay = () => {
    setFormData((prevData) => ({
      ...prevData,
      itinerary: [...prevData.itinerary, { day_number: prevData.itinerary.length + 1, title: "", location: "", description: "", activities: [] }],
    }))
  }

  const removeItineraryDay = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      itinerary: prevData.itinerary.filter((_, i) => i !== index).map((item, i) => ({ ...item, day_number: i + 1 })),
    }))
  }

  const handleCheckboxChange = (type: "inclusions" | "exclusions", item: string, checked: boolean | "indeterminate") => {
    setFormData((prevData) => {
      const currentList = prevData[type]
      const isChecked = checked === true; // Ensure checked is a boolean
      if (isChecked) {
        // Only add if not already present to avoid duplicates visually, though Set handles it too.
        // This makes sure the actual state array doesn't grow with duplicates.
        if (!currentList.includes(item)) {
          return { ...prevData, [type]: [...currentList, item] }
        }
      } else {
        return { ...prevData, [type]: currentList.filter((i: string) => i !== item) }
      }
      return prevData; // Return previous state if no change
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const supabase = createClient() // Keep regular client for reading
      const adminSupabase = createAdminClient() // Use admin client for writing
      
      // Validate required fields
      if (!formData.title || !formData.category_id) {
        toast.error("Please fill in all required fields")
        return
      }

      // Comprehensive logging of form data before submission
      console.group("Tour Update Submission")
      console.log("Tour ID:", formData.id)
      console.log("Supabase Client:", supabase)
      console.log("Admin Supabase Client:", adminSupabase)
      console.log("Basic Tour Data:", {
        title: formData.title,
        category_id: formData.category_id,
        description: formData.description,
        duration: formData.duration,
        price: formData.price,
        original_price: formData.original_price,
        max_group_size: formData.max_group_size,
      })
      console.log("Highlights:", formData.highlights)
      console.log("Itinerary:", JSON.stringify(formData.itinerary, null, 2))
      console.log("Inclusions:", formData.inclusions)
      console.log("Exclusions:", formData.exclusions)
      console.groupEnd()

      // Debugging: Check Supabase connection and permissions
      try {
        const { data: testData, error: testError } = await supabase
          .from('tours')
          .select('*')
          .eq('id', formData.id)
          .single()

        console.log("Test Tour Fetch:", { data: testData, error: testError })

        if (testError) {
          console.error("Supabase Permission/Connection Test Failed:", testError)
          throw new Error(`Supabase connection test failed: ${testError.message}`)
        }
      } catch (connectionError) {
        console.error("Supabase Connection Test Error:", connectionError)
        toast.error("Failed to connect to Supabase. Please check your configuration.")
        return
      }

      // Upload new images to Supabase Storage
      const newImageUrls: string[] = []
      for (const imageFile of images.filter(img => img.isNew)) {
        try {
          const fileExt = imageFile.file.name.split('.').pop()
          const fileName = `tours/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('tour-images')
            .upload(fileName, imageFile.file)

          if (uploadError) {
            console.error("Image Upload Error Details:", {
              message: uploadError.message,
              name: uploadError.name,
            })
            toast.error(`Failed to upload image: ${uploadError.message}`)
            continue
          }

          const { data: { publicUrl } } = supabase.storage
            .from('tour-images')
            .getPublicUrl(fileName)

          newImageUrls.push(publicUrl)
        } catch (imageUploadError) {
          console.error("Unexpected Image Upload Error:", imageUploadError)
          toast.error("An unexpected error occurred while uploading images")
        }
      }

      // Combine existing and new image URLs
      const allImageUrls = [...existingImages, ...newImageUrls]

      // Update tour using the updateTour function
      const tourDataToUpdate: Partial<Tour> = {
        title: formData.title,
        category_id: formData.category_id,
        description: formData.description,
        duration: formData.duration,
        price: formData.price,
        original_price: formData.original_price,
        max_group_size: formData.max_group_size,
        featured_image: allImageUrls.length > 0 ? allImageUrls[0] : null,
        status: formData.status,
        location: formData.location,
        difficulty: formData.difficulty,
        // highlights: formData.highlights, // Temporarily disabled - column doesn't exist
        // updated_at is managed by a database trigger, no need to send it from frontend
      };

      const updatedTour = await updateTour(supabase, formData.id, tourDataToUpdate);

      if (!updatedTour) {
        throw new Error("Failed to update tour")
      }

      // Update tour images using admin client
      if (allImageUrls.length > 0) {
        try {
          // First, delete existing tour images - using correct table name
          const { data: deleteData, error: deleteImageError } = await adminSupabase
            .from('tour_images')
            .delete()
            .eq('tour_id', formData.id)

          console.log("Image Deletion Result:", { 
            deleteData, 
            deleteImageError,
            tourId: formData.id 
          })

          if (deleteImageError) {
            console.error("Detailed Image Deletion Error:", {
              message: deleteImageError.message,
              hint: deleteImageError.hint,
            })
            throw deleteImageError
          }

          // Then insert new image records
          const imageInserts = allImageUrls.map(url => ({
            tour_id: formData.id,
            image_url: url,
          }))

          const { data: insertedImages, error: imageError } = await adminSupabase
            .from('tour_images')
            .insert(imageInserts)

          console.log("Image Insertion Result:", { 
            insertedImages, 
            imageError,
            imageInserts 
          })

          if (imageError) {
            console.error("Detailed Image Insert Error:", {
              message: imageError.message,
              hint: imageError.hint,
              originalError: imageError
            })
            throw imageError
          }
        } catch (imageOperationError) {
          console.error("Comprehensive Image Operation Error:", imageOperationError)
          toast.error("An unexpected error occurred while managing tour images")
        }
      }

      // Update tour itinerary using admin client
      if (formData.itinerary.length > 0) {
        try {
          // First, delete existing itinerary
          const { data: deleteData, error: deleteItineraryError } = await adminSupabase
            .from('tour_itinerary')
            .delete()
            .eq('tour_id', formData.id)

          console.log("Itinerary Deletion Result:", { 
            deleteData, 
            deleteItineraryError,
            tourId: formData.id 
          })

          if (deleteItineraryError) {
            console.error("Detailed Itinerary Deletion Error:", {
              message: deleteItineraryError.message,
              hint: deleteItineraryError.hint,
            })
            throw deleteItineraryError
          }

          // Then insert new itinerary
          const itineraryInserts = formData.itinerary.map(day => ({
            tour_id: formData.id,
            day_number: day.day_number,
            title: day.title,
            location: day.location,
            description: day.description,
            activities: day.activities,
          }))

          console.log("Itinerary Inserts:", JSON.stringify(itineraryInserts, null, 2))

          // Validate itinerary data before insertion
          const validItineraryInserts = itineraryInserts.filter(item => 
            item.tour_id && 
            item.day_number && 
            (item.title || item.location || item.description || item.activities?.length > 0)
          )

          if (validItineraryInserts.length === 0) {
            console.warn("No valid itinerary items to insert")
            toast.warning("No valid itinerary items to save")
          } else {
            const { data: insertedItinerary, error: itineraryError } = await adminSupabase
              .from('tour_itinerary')
              .insert(validItineraryInserts)

            console.log("Itinerary Insertion Result:", { 
              insertedItinerary, 
              itineraryError,
              validItineraryInserts 
            })
            
            if (itineraryError) {
              console.error("Detailed Itinerary Insert Error:", {
                message: itineraryError.message,
                hint: itineraryError.hint,
                originalError: itineraryError
              })
              throw itineraryError
            }
          }
        } catch (itineraryError) {
          console.error("Comprehensive Itinerary Error:", itineraryError)
          toast.error(`Failed to update tour itinerary: ${(itineraryError as Error).message || 'Unknown error'}`)
        }
      }

      // Update tour inclusions using admin client
      try {
        // Delete existing inclusions
        const { error: deleteInclusionsError } = await adminSupabase
          .from('tour_inclusions')
          .delete()
          .eq('tour_id', formData.id);

        if (deleteInclusionsError) {
          console.error("Detailed Inclusions Deletion Error:", {
            message: deleteInclusionsError.message,
            hint: deleteInclusionsError.hint,
          });
          throw deleteInclusionsError;
        }

        const inclusionInserts = formData.inclusions.map(item => ({
          tour_id: formData.id,
          item,
        }));

        if (inclusionInserts.length > 0) {
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
        }
      } catch (inclusionsError) {
        console.error("Comprehensive Inclusions Error:", inclusionsError);
        toast.error(`Failed to update tour inclusions: ${(inclusionsError as Error).message || 'Unknown error'}`);
      }

      // Update tour exclusions using admin client
      try {
        // Delete existing exclusions
        const { error: deleteExclusionsError } = await adminSupabase
          .from('tour_exclusions')
          .delete()
          .eq('tour_id', formData.id);

        if (deleteExclusionsError) {
          console.error("Detailed Exclusions Deletion Error:", {
            message: deleteExclusionsError.message,
            hint: deleteExclusionsError.hint,
          });
          throw deleteExclusionsError;
        }

        const exclusionInserts = formData.exclusions.map(item => ({
          tour_id: formData.id,
          item,
        }));

        if (exclusionInserts.length > 0) {
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
        }
      } catch (exclusionsError) {
        console.error("Comprehensive Exclusions Error:", exclusionsError);
        toast.error(`Failed to update tour exclusions: ${(exclusionsError as Error).message || 'Unknown error'}`);
      }

      // Update tour highlights using admin client
      try {
        // Delete existing highlights
        const { error: deleteHighlightsError } = await adminSupabase
          .from('tour_highlights')
          .delete()
          .eq('tour_id', formData.id);

        if (deleteHighlightsError) {
          console.error("Detailed Highlights Deletion Error:", {
            message: deleteHighlightsError.message,
            hint: deleteHighlightsError.hint,
          });
          throw deleteHighlightsError;
        }

        // Convert highlights from objects to strings and insert
        const highlightInserts = formData.highlights.map((item, index) => ({
          tour_id: formData.id,
          highlight: typeof item === 'string' ? item : item || '',
          order_index: index + 1,
        })).filter(item => item.highlight.trim() !== '');

        if (highlightInserts.length > 0) {
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

          console.log("Highlights Insertion Result:", { 
            highlightInserts,
            count: highlightInserts.length 
          });
        }
      } catch (highlightsError) {
        console.error("Comprehensive Highlights Error:", highlightsError);
        toast.error(`Failed to update tour highlights: ${(highlightsError as Error).message || 'Unknown error'}`);
      }

      toast.success("Tour updated successfully!")
      router.push("/admin/tours")
    } catch (error) {
      console.error("Tour update failed:", error)
      toast.error(`Failed to update tour: ${(error as Error).message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading tour details...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/tours">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tours
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Tour: {formData.title}</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tour Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tour Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select
                  onValueChange={handleSelectChange}
                  value={String(formData.category_id ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (number of days)</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_group_size">Max Group Size (persons)</Label>
                <Input
                  id="max_group_size"
                  type="number"
                  value={formData.max_group_size || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  value={formData.difficulty || ''}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Challenging">Challenging</SelectItem>
                    <SelectItem value="Strenuous">Strenuous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as "active" | "draft" | "inactive" }))}
                  value={formData.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price (Optional)</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={formData.original_price || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tour Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {existingImages.map((imageUrl, index) => (
                <div key={`existing-${index}`} className="relative w-full h-32 border rounded-md overflow-hidden group">
                  <img src={imageUrl} alt="Tour image" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index, true)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {images.map((image, index) => (
                <div key={`new-${index}`} className="relative w-full h-32 border rounded-md overflow-hidden group">
                  <img src={image.preview} alt="New tour image" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index, false)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              multiple
              accept="image/*"
            />
            <Button type="button" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Upload Images
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tour Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.itinerary.map((day, index) => (
              <div key={index} className="space-y-4 mb-6 p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Day {day.day_number}</h3>
                  {formData.itinerary.length > 1 && (
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItineraryDay(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`day-${index}-title`}>Title</Label>
                    <Input
                      id={`day-${index}-title`}
                      value={day.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`day-${index}-location`}>Location</Label>
                    <Input
                      id={`day-${index}-location`}
                      value={day.location}
                      onChange={(e) => handleItineraryChange(index, 'location', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor={`day-${index}-description`}>Description</Label>
                    <Textarea
                      id={`day-${index}-description`}
                      value={day.description}
                      onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <Label htmlFor={`day-${index}-activities`}>Activities (one per line)</Label>
                    <Textarea
                      id={`day-${index}-activities`}
                      value={Array.isArray(day.activities) ? day.activities.join('\n') : ''}
                      onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" onClick={addItineraryDay}>
              <Plus className="mr-2 h-4 w-4" /> Add Day
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...new Set(["Cultural immersion", "Wildlife viewing", "Scenic landscapes", "Adventure activities", "Historical sites", ...formData.highlights])].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`highlight-${item.replace(/\s+/g, '-')}`}
                    checked={formData.highlights.includes(item)}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        highlights: checked
                          ? [...prev.highlights, item]
                          : prev.highlights.filter((h: string) => h !== item)
                      }))
                    }}
                  />
                  <Label htmlFor={`highlight-${item.replace(/\s+/g, '-')}`}>{item}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  id="custom-highlight-input"
                  placeholder="Add custom highlight"
                  value={customInclusionInput}
                  onChange={(e) => setCustomInclusionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customInclusionInput.trim() !== '') {
                      setFormData(prev => ({
                        ...prev,
                        highlights: [...prev.highlights, customInclusionInput.trim()]
                      }))
                      setCustomInclusionInput('')
                    }
                  }}
                />
                <Button type="button" onClick={() => {
                  if (customInclusionInput.trim() !== '') {
                    setFormData(prev => ({
                      ...prev,
                      highlights: [...prev.highlights, customInclusionInput.trim()]
                    }))
                    setCustomInclusionInput('')
                  }
                }}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Time to Visit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...new Set(["Dry Season (June-October)", "Wet Season (November-May)", "Year-round", "Specific Months (e.g., Jan, Feb)", ...(formData.best_time || [])])].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`best-time-${item.replace(/\s+|\(|\)/g, '-')}`}
                    checked={formData.best_time?.includes(item)}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        best_time: checked
                          ? [...(prev.best_time || []), item]
                          : (prev.best_time || []).filter(bt => bt !== item)
                      }))
                    }}
                  />
                  <Label htmlFor={`best-time-${item.replace(/\s+|\(|\)/g, '-')}`}>{item}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  id="custom-best-time-input"
                  placeholder="Add custom best time"
                  value={customExclusionInput}
                  onChange={(e) => setCustomExclusionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customExclusionInput.trim() !== '') {
                      setFormData(prev => ({
                        ...prev,
                        best_time: [...(prev.best_time || []), customExclusionInput.trim()]
                      }))
                      setCustomExclusionInput('')
                    }
                  }}
                />
                <Button type="button" onClick={() => {
                  if (customExclusionInput.trim() !== '') {
                    setFormData(prev => ({
                      ...prev,
                      best_time: [...(prev.best_time || []), customExclusionInput.trim()]
                    }))
                    setCustomExclusionInput('')
                  }
                }}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Physical Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...new Set(["Easy (suitable for all fitness levels)", "Moderate (some walking/light hiking involved)", "Challenging (requires good physical fitness)", "Strenuous (demands high fitness level)", ...(formData.physical_requirements || [])])].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`physical-requirement-${item.replace(/\s+|\(|\)/g, '-')}`}
                    checked={formData.physical_requirements?.includes(item)}
                    onCheckedChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        physical_requirements: checked
                          ? [...(prev.physical_requirements || []), item]
                          : (prev.physical_requirements || []).filter(pr => pr !== item)
                      }))
                    }}
                  />
                  <Label htmlFor={`physical-requirement-${item.replace(/\s+|\(|\)/g, '-')}`}>{item}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  id="custom-physical-requirement-input"
                  placeholder="Add custom physical requirement"
                  value={customPhysicalRequirementInput}
                  onChange={(e) => setCustomPhysicalRequirementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customPhysicalRequirementInput.trim() !== '') {
                      setFormData(prev => ({
                        ...prev,
                        physical_requirements: [...(prev.physical_requirements || []), customPhysicalRequirementInput.trim()]
                      }))
                      setCustomPhysicalRequirementInput('')
                    }
                  }}
                />
                <Button type="button" onClick={() => {
                  if (customPhysicalRequirementInput.trim() !== '') {
                    setFormData(prev => ({
                      ...prev,
                      physical_requirements: [...(prev.physical_requirements || []), customPhysicalRequirementInput.trim()]
                    }))
                    setCustomPhysicalRequirementInput('')
                  }
                }}>
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What's Included & Excluded?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Inclusions</h3>
                {[...new Set([...predefinedInclusions, ...formData.inclusions])].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`inclusion-${item.replace(/\s+/g, '-')}`}
                      checked={formData.inclusions.includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange("inclusions", item, checked === true)}
                    />
                    <Label htmlFor={`inclusion-${item.replace(/\s+/g, '-')}`}>{item}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    id="custom-inclusion-input"
                    placeholder="Add custom inclusion"
                    value={customInclusionInput}
                    onChange={(e) => setCustomInclusionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customInclusionInput.trim() !== '') {
                        handleCheckboxChange("inclusions", customInclusionInput.trim(), true)
                        setCustomInclusionInput('')
                      }
                    }}
                  />
                  <Button type="button" onClick={() => {
                    if (customInclusionInput.trim() !== '') {
                      handleCheckboxChange("inclusions", customInclusionInput.trim(), true)
                      setCustomInclusionInput('')
                    }
                  }}>
                    Add
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Exclusions</h3>
                {[...new Set([...predefinedExclusions, ...formData.exclusions])].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`exclusion-${item.replace(/\s+/g, '-')}`}
                      checked={formData.exclusions.includes(item)}
                      onCheckedChange={(checked) => handleCheckboxChange("exclusions", item, checked === true)}
                    />
                    <Label htmlFor={`exclusion-${item.replace(/\s+/g, '-')}`}>{item}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    id="custom-exclusion-input"
                    placeholder="Add custom exclusion"
                    value={customExclusionInput}
                    onChange={(e) => setCustomExclusionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customExclusionInput.trim() !== '') {
                        handleCheckboxChange("exclusions", customExclusionInput.trim(), true)
                        setCustomExclusionInput('')
                      }
                    }}
                  />
                  <Button type="button" onClick={() => {
                    if (customExclusionInput.trim() !== '') {
                      handleCheckboxChange("exclusions", customExclusionInput.trim(), true)
                      setCustomExclusionInput('')
                    }
                  }}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}