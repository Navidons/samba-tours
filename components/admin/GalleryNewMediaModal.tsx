"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Upload, Image as ImageIcon, Video as VideoIcon } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

// Mock data for categories and locations (from components/gallery/gallery-filters.tsx)
// const categories = [
//   { id: "gorillas", label: "Gorilla Trekking" },
//   { id: "wildlife", label: "Wildlife Safari" },
//   { id: "landscapes", label: "Landscapes" },
//   { id: "cultural", label: "Cultural" },
//   { id: "adventure", label: "Adventure" },
//   { id: "birds", label: "Bird Watching" },
// ]

// const locations = [
//   { id: "bwindi", label: "Bwindi Forest" },
//   { id: "murchison", label: "Murchison Falls" },
//   { id: "queen-elizabeth", label: "Queen Elizabeth NP" },
//   { id: "kibale", label: "Kibale Forest" },
//   { id: "lake-mburo", label: "Lake Mburo" },
//   { id: "mount-elgon", label: "Mount Elgon" },
// ]

interface GalleryNewMediaModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: () => void
}

export default function GalleryNewMediaModal({ isOpen, onClose, onUploadComplete }: GalleryNewMediaModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | null>("image")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [newCategoryName, setNewCategoryName] = useState<string>("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [newLocationName, setNewLocationName] = useState<string>("")
  const [showNewLocationInput, setShowNewLocationInput] = useState(false)
  const [photographer, setPhotographer] = useState<string>("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [dbLocations, setDbLocations] = useState<any[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dbGalleries, setDbGalleries] = useState<any[]>([])
  const [selectedGallery, setSelectedGallery] = useState<string>("")

  useEffect(() => {
    if (isOpen) {
      const fetchAttributes = async () => {
        const supabase = createClient()
        const { data: categoriesData, error: categoriesError } = await supabase.from("gallery_media_categories").select("id, name")
        const { data: locationsData, error: locationsError } = await supabase.from("gallery_media_locations").select("id, name")
        const { data: galleriesData, error: galleriesError } = await supabase.from("galleries").select("id, name")

        if (categoriesError) console.error("Error fetching categories:", categoriesError.message)
        if (locationsError) console.error("Error fetching locations:", locationsError.message)
        if (galleriesError) console.error("Error fetching galleries:", galleriesError.message)

        setDbCategories(categoriesData || [])
        setDbLocations(locationsData || [])
        setDbGalleries(galleriesData || [])
        setUploadProgress(0)
      }
      fetchAttributes()
    } else {
      // Reset state when modal closes
      setFile(null)
      setMediaType("image")
      setTitle("")
      setDescription("")
      setSelectedCategory("")
      setNewCategoryName("")
      setShowNewCategoryInput(false)
      setSelectedLocation("")
      setNewLocationName("")
      setShowNewLocationInput(false)
      setPhotographer("")
      setIsFeatured(false)
      setUploading(false)
      setError(null)
      setPreviewUrl(null)
      setSelectedGallery("")
    }
  }, [isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      if (selectedFile.type.startsWith("image/")) {
        setMediaType("image")
      } else if (selectedFile.type.startsWith("video/")) {
        setMediaType("video")
      } else {
        setMediaType(null)
        setError("Unsupported file type. Please select an image or video.")
      }
    } else {
      setMediaType(null)
      setPreviewUrl(null)
    }
  }

  const handleUpload = async () => {
    if (!file || !mediaType || !title || (!selectedCategory && !newCategoryName) || (!selectedLocation && !newLocationName) || !selectedGallery) {
      setError("Please fill in all required fields and select a file.")
      return
    }

    setUploading(true)
    setError(null)

    const supabase = createClient()
    let categoryId = null;
    let locationId = null;

    try {
      // Handle new category creation or selection
      if (showNewCategoryInput && newCategoryName) {
        const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-')
        // First, try to find an existing category
        const { data: existingCategory, error: fetchCategoryError } = await supabase.from("gallery_media_categories").select("id").eq("slug", slug).single()
        if (existingCategory) {
          categoryId = existingCategory.id
        } else {
          // If not found, insert new category
          const { data, error: categoryError } = await supabase.from("gallery_media_categories").insert([{ name: newCategoryName, slug }]).select("id").single()
          if (categoryError) throw categoryError
          categoryId = data.id
        }
      } else if (selectedCategory) {
        categoryId = selectedCategory // Assuming selectedCategory is already the ID
      }

      // Handle new location creation or selection
      if (showNewLocationInput && newLocationName) {
        const slug = newLocationName.toLowerCase().replace(/\s+/g, '-')
        // First, try to find an existing location
        const { data: existingLocation, error: fetchLocationError } = await supabase.from("gallery_media_locations").select("id").eq("slug", slug).single()
        if (existingLocation) {
          locationId = existingLocation.id
        } else {
          // If not found, insert new location
          const { data, error: locationError } = await supabase.from("gallery_media_locations").insert([{ name: newLocationName, slug }]).select("id").single()
          if (locationError) throw locationError
          locationId = data.id
        }
      } else if (selectedLocation) {
        locationId = selectedLocation // Assuming selectedLocation is already the ID
      }

      const fileExtension = file.name.split(".").pop()
      const subfolder = mediaType === "image" ? "images" : "videos";
      const fileName = `${subfolder}/${uuidv4()}.${fileExtension}`;
      const bucket = "gallery"; // Always use the main 'gallery' bucket
      const tableName = mediaType === "image" ? "gallery_images" : "gallery_videos"

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          },
        })

      if (uploadError) throw uploadError

      const publicUrl = supabase.storage.from(bucket).getPublicUrl(fileName).data.publicUrl

      let insertData: any = {
        title,
        description,
        category_id: categoryId, // Use category_id
        location_id: locationId, // Use location_id
        photographer,
        gallery_id: selectedGallery,
        featured: isFeatured,
      }

      if (mediaType === "image") {
        insertData.src = publicUrl
        insertData.size = file.size
      } else {
        insertData.src = publicUrl
        insertData.duration = 0 // Placeholder, can be updated later
        insertData.size = file.size
        insertData.thumbnail = publicUrl; // Set thumbnail to video URL for preview
      }

      const { error: insertError } = await supabase.from(tableName).insert([insertData])

      if (insertError) throw insertError

      toast({
        title: "Upload Successful!",
        description: `${mediaType === "image" ? "Image" : "Video"} "${title}" uploaded successfully.`,
      })
      onUploadComplete()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to upload media.")
      toast({
        title: "Upload Failed",
        description: err.message || "There was an error uploading your media.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleCategoryChange = (value: string) => {
    if (value === "add-new") {
      setShowNewCategoryInput(true)
      setSelectedCategory("")
    } else {
      setShowNewCategoryInput(false)
      setSelectedCategory(value)
    }
  }

  const handleLocationChange = (value: string) => {
    if (value === "add-new") {
      setShowNewLocationInput(true)
      setSelectedLocation("")
    } else {
      setShowNewLocationInput(false)
      setSelectedLocation(value)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]"> {/* Wider and scrollable */}
        <DialogHeader>
          <DialogTitle>Add New Media</DialogTitle>
          <DialogDescription>Upload a single photo or video to your gallery.</DialogDescription>
        </DialogHeader>
        <Tabs value={mediaType || "image"} onValueChange={(value) => setMediaType(value as "image" | "video")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="image">
              <ImageIcon className="h-4 w-4 mr-2" /> Photo
            </TabsTrigger>
            <TabsTrigger value="video">
              <VideoIcon className="h-4 w-4 mr-2" /> Video
            </TabsTrigger>
          </TabsList>
          <TabsContent value="image">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageFile" className="text-right">
                  Image File
                </Label>
                <Input
                  id="imageFile"
                  type="file"
                  className="col-span-3"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={mediaType !== "image"}
                />
              </div>
              {previewUrl && mediaType === "image" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Preview</Label>
                  <div className="col-span-3">
                    <img src={previewUrl} alt="Image Preview" className="w-full h-auto max-h-48 object-contain rounded-md" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="imageTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="imageDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imagePhotographer" className="text-right">
                  Photographer
                </Label>
                <Input
                  id="imagePhotographer"
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                  className="col-span-3"
                  placeholder="Name of photographer (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageGallery" className="text-right">
                  Gallery
                </Label>
                <Select value={selectedGallery} onValueChange={setSelectedGallery}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a gallery" />
                  </SelectTrigger>
                  <SelectContent>
                    {dbGalleries.map((gallery) => (
                      <SelectItem key={gallery.id} value={gallery.id}>
                        {gallery.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageCategory" className="text-right">
                  Category
                </Label>
                {showNewCategoryInput ? (
                  <Input
                    id="newImageCategory"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    className="col-span-3"
                    onBlur={() => !newCategoryName && setShowNewCategoryInput(false)} // Hide if empty on blur
                  />
                ) : (
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="add-new">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageLocation" className="text-right">
                  Location
                </Label>
                {showNewLocationInput ? (
                  <Input
                    id="newImageLocation"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="Enter new location name"
                    className="col-span-3"
                    onBlur={() => !newLocationName && setShowNewLocationInput(false)} // Hide if empty on blur
                  />
                ) : (
                  <Select value={selectedLocation} onValueChange={handleLocationChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="add-new">+ Add New Location</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageFeatured" className="text-right">
                  Featured
                </Label>
                <Switch
                  id="imageFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                  className="col-span-3"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="video">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoFile" className="text-right">
                  Video File
                </Label>
                <Input
                  id="videoFile"
                  type="file"
                  className="col-span-3"
                  onChange={handleFileChange}
                  accept="video/*"
                  disabled={mediaType !== "video"}
                />
              </div>
              {previewUrl && mediaType === "video" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Preview</Label>
                  <div className="col-span-3">
                    <video src={previewUrl} controls className="w-full h-auto max-h-48 object-contain rounded-md" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoTitle" className="text-right">
                  Title
                </Label>
                <Input
                  id="videoTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="videoDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoPhotographer" className="text-right">
                  Photographer
                </Label>
                <Input
                  id="videoPhotographer"
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                  className="col-span-3"
                  placeholder="Name of photographer (optional)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoGallery" className="text-right">
                  Gallery
                </Label>
                <Select value={selectedGallery} onValueChange={setSelectedGallery}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a gallery" />
                  </SelectTrigger>
                  <SelectContent>
                    {dbGalleries.map((gallery) => (
                      <SelectItem key={gallery.id} value={gallery.id}>
                        {gallery.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoCategory" className="text-right">
                  Category
                </Label>
                {showNewCategoryInput ? (
                  <Input
                    id="newVideoCategory"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter new category name"
                    className="col-span-3"
                    onBlur={() => !newCategoryName && setShowNewCategoryInput(false)} // Hide if empty on blur
                  />
                ) : (
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="add-new">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoLocation" className="text-right">
                  Location
                </Label>
                {showNewLocationInput ? (
                  <Input
                    id="newVideoLocation"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="Enter new location name"
                    className="col-span-3"
                    onBlur={() => !newLocationName && setShowNewLocationInput(false)} // Hide if empty on blur
                  />
                ) : (
                  <Select value={selectedLocation} onValueChange={handleLocationChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbLocations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="add-new">+ Add New Location</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="videoFeatured" className="text-right">
                  Featured
                </Label>
                <Switch
                  id="videoFeatured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                  className="col-span-3"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {uploading && <p className="text-center text-sm text-earth-600 mt-2">Uploading... {uploadProgress}%</p>}
        {error && <p className="text-red-500 text-center col-span-4">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : `Upload ${mediaType === "image" ? "Image" : "Video"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
