"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
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
import { getTourCategories, TourCategory, createTour } from "@/lib/tours"
import { createClient } from "@/lib/supabase"

const FORM_CACHE_KEY = 'new_tour_draft'

// --- Interfaces (aligned with edit page) ---
interface Tour {
  id?: number // ID might not exist for new tour yet
  title: string
  category_id: number
  description: string
  duration: string
  price: number
  original_price?: number | null
  max_group_size?: number | null
  featured_image?: string | null
  status: "active" | "draft" | "inactive"
  location: string
  difficulty?: string | null
  best_time?: string[] | null
  physical_requirements?: string[] | null
}

interface TourImageData {
  image_url: string;
}

interface TourItinerary {
  id?: number
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

const predefinedHighlights = [
  "Wildlife viewing",
  "Cultural immersion",
  "Scenic landscapes",
  "Adventure activities",
  "Historical sites",
];

const predefinedBestTimes = [
  "Dry Season (June-October)",
  "Wet Season (November-May)",
  "Year-round",
  "Specific Months (e.g., Jan, Feb)",
];

const predefinedPhysicalRequirements = [
  "Easy (suitable for all fitness levels)",
  "Moderate (some walking/light hiking involved)",
  "Challenging (requires good physical fitness)",
  "Strenuous (demands high fitness level)",
];

const predefinedDifficulties = [
  "Easy",
  "Moderate",
  "Challenging",
  "Strenuous",
];

export default function NewTour() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [customInclusionInput, setCustomInclusionInput] = useState('');
  const [customExclusionInput, setCustomExclusionInput] = useState('');
  const [customHighlightInput, setCustomHighlightInput] = useState('');
  const [customBestTimeInput, setCustomBestTimeInput] = useState('');
  const [customPhysicalRequirementInput, setCustomPhysicalRequirementInput] = useState('');

  const [formData, setFormData] = useState<Tour & {
    itinerary: TourItinerary[]
    inclusions: string[]
    exclusions: string[]
    highlights: string[]
    best_time: string[]
    physical_requirements: string[]
  }>({
    title: "",
    category_id: 0,
    description: "",
    duration: "",
    price: 0,
    original_price: null,
    max_group_size: null,
    featured_image: null,
    status: "draft",
    location: "",
    difficulty: null,
    best_time: [],
    physical_requirements: [],
    itinerary: [{ day_number: 1, title: "", location: "", description: "", activities: [] }],
    inclusions: [],
    exclusions: [],
    highlights: [],
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false) // Use saving for submit button state
  const [categories, setCategories] = useState<TourCategory[]>([])
  const [images, setImages] = useState<File[]>([]) // Files selected for upload
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]) // URLs for previewing new images

  // Load cached form data on component mount and fetch categories
  useEffect(() => {
    const cachedFormData = localStorage.getItem(FORM_CACHE_KEY)
    if (cachedFormData) {
      try {
        const parsedData = JSON.parse(cachedFormData);

        // Define a base object with default nulls for optional number fields
        // and 0 for required number fields, and empty strings for other fields.
        // This ensures all controlled fields have a defined initial value.
        const defaultFormDataShape: typeof formData = {
          title: "",
          category_id: 0,
          description: "",
          duration: "",
          price: 0,
          original_price: null,
          max_group_size: null,
          featured_image: null,
          status: "draft",
          location: "",
          difficulty: null,
          best_time: [],
          physical_requirements: [],
          itinerary: [{ day_number: 1, title: "", location: "", description: "", activities: [] }],
          inclusions: [],
          exclusions: [],
          highlights: [],
        };

        // Merge parsed data into the default shape, providing fallback for missing/undefined/null/empty string values
        const mergedFormData = {
          ...defaultFormDataShape,
          ...parsedData,
          // Explicitly handle string fields to ensure they are strings
          title: typeof parsedData.title === 'string' ? parsedData.title : '',
          description: typeof parsedData.description === 'string' ? parsedData.description : '',
          duration: typeof parsedData.duration === 'string' ? parsedData.duration : '',
          location: typeof parsedData.location === 'string' ? parsedData.location : '',
          // Handle optional string fields like difficulty
          difficulty: typeof parsedData.difficulty === 'string' ? parsedData.difficulty : null,

          // Explicitly handle number fields to ensure they are number or null
          price: typeof parsedData.price === 'number' ? parsedData.price : 0,
          original_price: (typeof parsedData.original_price === 'number' || parsedData.original_price === null) ? parsedData.original_price : null,
          max_group_size: (typeof parsedData.max_group_size === 'number' || parsedData.max_group_size === null) ? parsedData.max_group_size : null,
          // Itinerary, inclusions, exclusions, highlights should be arrays
          itinerary: Array.isArray(parsedData.itinerary) ? parsedData.itinerary : defaultFormDataShape.itinerary,
          inclusions: Array.isArray(parsedData.inclusions) ? parsedData.inclusions : defaultFormDataShape.inclusions,
          exclusions: Array.isArray(parsedData.exclusions) ? parsedData.exclusions : defaultFormDataShape.exclusions,
          highlights: Array.isArray(parsedData.highlights) ? parsedData.highlights : defaultFormDataShape.highlights,
          best_time: Array.isArray(parsedData.best_time) ? parsedData.best_time : defaultFormDataShape.best_time,
          physical_requirements: Array.isArray(parsedData.physical_requirements) ? parsedData.physical_requirements : defaultFormDataShape.physical_requirements,
        };

        setFormData(mergedFormData);

      } catch (error) {
        console.error("Error parsing cached form data:", error)
      }
    }

    const fetchCategories = async () => {
      try {
        const supabase = createClient(); // Create client for fetching categories
        const categories = await getTourCategories(supabase)
        setCategories(categories)
        if (categories.length === 0) {
          toast.warning("No tour categories found. Please add categories first.")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories")
      }
    }

    fetchCategories()
  }, [])

  // Cache form data whenever it changes
  useEffect(() => {
    localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(formData))
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData((prevData) => {
      let newValue: string | number | null;

      if (type === "number") {
        if (id === "price") {
          newValue = value === "" ? 0 : parseFloat(value);
          if (isNaN(newValue as number)) {
            newValue = 0;
          }
        } else if (id === "original_price" || id === "max_group_size") {
          newValue = value === "" ? null : parseFloat(value);
          if (isNaN(newValue as number) && newValue !== null) {
            newValue = null;
          }
        } else {
          // For any other number type inputs, ensure it's a number or null
          newValue = value === "" ? null : parseFloat(value);
          if (isNaN(newValue as number) && newValue !== null) {
            newValue = null;
          }
        }
      } else {
        // For string inputs, ensure newValue is always a string (empty if input is cleared)
        newValue = value;
      }

      // Explicitly handle fields that are expected to be strings but might receive null/undefined
      // This is a failsafe to ensure controlled inputs never get null.
      if (typeof prevData[id as keyof typeof prevData] === 'string' && (newValue === null || newValue === undefined)) {
        newValue = '';
      }

      return {
        ...prevData,
        [id]: newValue,
      } as typeof prevData;
    });
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: parseInt(value, 10),
    }))
  }

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as "active" | "draft" | "inactive" }))
  }

  const handleDifficultyChange = (value: string) => {
    setFormData(prev => ({ ...prev, difficulty: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImages(prev => [...prev, ...newFiles])

      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file))
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    // Revoke object URL for the image being removed
    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
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

  const handleCheckboxChange = (type: "inclusions" | "exclusions" | "highlights" | "best_time" | "physical_requirements", item: string, checked: boolean) => {
    setFormData((prevData) => {
      const currentList = prevData[type]
      if (checked) {
        if (!currentList.includes(item)) {
          return { ...prevData, [type]: [...currentList, item] }
        }
      } else {
        return { ...prevData, [type]: currentList.filter((i) => i !== item) }
      }
      return prevData;
    })
  }

  const handleAddCustomInclusion = () => {
    if (customInclusionInput.trim() !== '') {
      handleCheckboxChange("inclusions", customInclusionInput.trim(), true)
      setCustomInclusionInput('')
    }
  }

  const handleAddCustomExclusion = () => {
    if (customExclusionInput.trim() !== '') {
      handleCheckboxChange("exclusions", customExclusionInput.trim(), true)
      setCustomExclusionInput('')
    }
  }

  const handleAddCustomHighlight = () => {
    if (customHighlightInput.trim() !== '') {
      handleCheckboxChange("highlights", customHighlightInput.trim(), true)
      setCustomHighlightInput('')
    }
  }

  const handleAddCustomBestTime = () => {
    if (customBestTimeInput.trim() !== '') {
      handleCheckboxChange("best_time", customBestTimeInput.trim(), true)
      setCustomBestTimeInput('')
    }
  }

  const handleAddCustomPhysicalRequirement = () => {
    if (customPhysicalRequirementInput.trim() !== '') {
      handleCheckboxChange("physical_requirements", customPhysicalRequirementInput.trim(), true)
      setCustomPhysicalRequirementInput('')
    }
  }

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric, non-space, non-hyphen characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.category_id || formData.price <= 0 || !formData.location) {
        toast.error("Please fill in all required fields (Title, Category, Price, Location)")
        setSaving(false)
        return
      }

      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('category_id', formData.category_id.toString());
      submitFormData.append('description', formData.description);
      submitFormData.append('duration', formData.duration);
      submitFormData.append('price', formData.price.toString());
      if (formData.original_price != null) {
        submitFormData.append('original_price', formData.original_price.toString());
      }
      if (formData.max_group_size != null) {
        submitFormData.append('max_group_size', formData.max_group_size.toString());
      }
      submitFormData.append('status', formData.status);
      submitFormData.append('location', formData.location);
      if (formData.difficulty != null) {
        submitFormData.append('difficulty', formData.difficulty);
      }
      
      // Append arrays as JSON strings
      submitFormData.append('itinerary', JSON.stringify(formData.itinerary));
      submitFormData.append('inclusions', JSON.stringify(formData.inclusions));
      submitFormData.append('exclusions', JSON.stringify(formData.exclusions));
      submitFormData.append('highlights', JSON.stringify(formData.highlights));
      submitFormData.append('best_time', JSON.stringify(formData.best_time));
      submitFormData.append('physical_requirements', JSON.stringify(formData.physical_requirements));

      // Append images
      images.forEach((file) => {
        submitFormData.append('images', file, file.name);
      });

      const response = await fetch('/api/tours', {
        method: 'POST',
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create tour');
      }

      localStorage.removeItem(FORM_CACHE_KEY); // Clear cache on successful submission
      toast.success("Tour created successfully!")
      router.push("/admin/tours")
    } catch (error) {
      console.error("Tour creation failed:", error)
      toast.error(`Failed to create tour: ${(error as Error).message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
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
        <h1 className="text-3xl font-bold">Create New Tour</h1>
            </div>
      <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
            <CardTitle>Basic Tour Information</CardTitle>
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
                  onValueChange={(value) => handleSelectChange('category_id', value)}
                  value={formData.category_id.toString()}
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
                <Label htmlFor="original_price">Original Price (Optional)</Label>
                <Input
                  id="original_price"
                  type="number"
                  value={String(formData.original_price === null ? '' : formData.original_price)}
                  onChange={handleChange}
                />
                </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
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
                <Label htmlFor="max_group_size">Max Group Size (persons)</Label>
                    <Input
                      id="max_group_size"
                      type="number"
                  value={String(formData.max_group_size === null ? '' : formData.max_group_size)}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                    <Select
                  onValueChange={handleStatusChange}
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
                  <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location ?? ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                  onValueChange={handleDifficultyChange}
                  value={formData.difficulty ?? ''}
                    >
                      <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                    {predefinedDifficulties.map((difficultyOption) => (
                      <SelectItem key={difficultyOption} value={difficultyOption}>
                        {difficultyOption}
                      </SelectItem>
                    ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
            <CardTitle>Tour Images</CardTitle>
              </CardHeader>
              <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      {imagePreviewUrls.map((previewUrl, index) => (
                <div key={index} className="relative w-full h-32 border rounded-md overflow-hidden group">
                  <img src={previewUrl} alt={`Tour image preview ${index + 1}`} className="w-full h-full object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
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
            <CardTitle>Daily Itinerary Plan</CardTitle>
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
              {/* Map over a combined set of predefined and current highlights */}
              {[...new Set([...predefinedHighlights, ...formData.highlights])].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`highlight-${item.replace(/\s+/g, '-')}`}
                    checked={formData.highlights.includes(item)}
                    onCheckedChange={(checked) => handleCheckboxChange("highlights", item, checked === true)}
                  />
                  <Label htmlFor={`highlight-${item.replace(/\s+/g, '-')}`}>{item}</Label>
                </div>
              ))}
              {/* Add a custom input for new highlights */}
              <div className="flex items-center space-x-2">
                <Input
                  id="custom-highlight-input"
                  placeholder="Add custom highlight"
                  value={customHighlightInput}
                  onChange={(e) => setCustomHighlightInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customHighlightInput.trim() !== '') {
                      handleAddCustomHighlight()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddCustomHighlight}>
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
              {[...new Set([...predefinedBestTimes, ...formData.best_time])].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`best-time-${item.replace(/\s+|\(|\)/g, '-')}`}
                    checked={formData.best_time.includes(item)}
                    onCheckedChange={(checked) => handleCheckboxChange("best_time", item, checked === true)}
                  />
                  <Label htmlFor={`best-time-${item.replace(/\s+|\(|\)/g, '-')}`}>{item}</Label>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  id="custom-best-time-input"
                  placeholder="Add custom best time"
                  value={customBestTimeInput}
                  onChange={(e) => setCustomBestTimeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customBestTimeInput.trim() !== '') {
                      handleAddCustomBestTime()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddCustomBestTime}>
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
              {[...new Set([...predefinedPhysicalRequirements, ...formData.physical_requirements])].map((item) => (
                <div key={item} className="flex items-center space-x-2">
                  <Checkbox
                    id={`physical-requirement-${item.replace(/\s+|\(|\)/g, '-')}`}
                    checked={formData.physical_requirements.includes(item)}
                    onCheckedChange={(checked) => handleCheckboxChange("physical_requirements", item, checked === true)}
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
                      handleAddCustomPhysicalRequirement()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddCustomPhysicalRequirement}>
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
                {/* Map over a combined set of predefined and current inclusions */}
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
                {/* Add a custom input for new inclusions */}
                    <div className="flex items-center space-x-2">
                      <Input
                        id="custom-inclusion-input"
                        placeholder="Add custom inclusion"
                        value={customInclusionInput}
                        onChange={(e) => setCustomInclusionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customInclusionInput.trim() !== '') {
                        handleAddCustomInclusion()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddCustomInclusion}>
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Exclusions</h3>
                {/* Map over a combined set of predefined and current exclusions */}
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
                {/* Add a custom input for new exclusions */}
                    <div className="flex items-center space-x-2">
                      <Input
                        id="custom-exclusion-input"
                        placeholder="Add custom exclusion"
                        value={customExclusionInput}
                        onChange={(e) => setCustomExclusionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customExclusionInput.trim() !== '') {
                        handleAddCustomExclusion()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddCustomExclusion}>
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                </CardContent>
              </Card>

        <Button type="submit" className="w-full" disabled={saving}>
          {saving ? 'Creating...' : 'Create Tour'}
              </Button>
          </form>
        </div>
  )
}