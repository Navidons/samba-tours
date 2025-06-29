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
import { Image as ImageIcon, Video as VideoIcon } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

interface GalleryMediaEditModalProps {
  isOpen: boolean
  onClose: () => void
  media: any | null // The media object to be edited
  onUpdateComplete: () => void
}

export default function GalleryMediaEditModal({ isOpen, onClose, media, onUpdateComplete }: GalleryMediaEditModalProps) {
  console.log("GalleryMediaEditModal: Rendered with media prop:", media); // Log at component entry
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [newCategoryName, setNewCategoryName] = useState<string>("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [newLocationName, setNewLocationName] = useState<string>("")
  const [showNewLocationInput, setShowNewLocationInput] = useState(false)
  const [photographer, setPhotographer] = useState<string>("")
  const [selectedGallery, setSelectedGallery] = useState<string>("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isImage, setIsImage] = useState(false)

  const [dbCategories, setDbCategories] = useState<any[]>([])
  const [dbLocations, setDbLocations] = useState<any[]>([])
  const [dbGalleries, setDbGalleries] = useState<any[]>([])

  useEffect(() => {
    console.log("GalleryMediaEditModal useEffect: isOpen changed or media changed. isOpen:", isOpen, "media:", media); // Log on effect run
    if (isOpen && media) {
      // Populate form fields with existing media data
      setTitle(media.title || "")
      setDescription(media.description || "")
      setSelectedCategory(media.category_id || "")
      setSelectedLocation(media.location_id || "")
      setPhotographer(media.photographer || "")
      setSelectedGallery(media.gallery_id || "")
      setIsFeatured(media.featured || false)
      setIsImage(typeof media?.src === 'string' && media.src.includes("images"))
      console.log("GalleryMediaEditModal useEffect (open): After state set. isImage:", isImage, "media.src:", media.src); // Log after state update

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
      }
      fetchAttributes()
    } else if (!isOpen) {
      console.log("GalleryMediaEditModal useEffect (close): Resetting state."); // Log on close
      // Reset state when modal closes
      setTitle("")
      setDescription("")
      setSelectedCategory("")
      setNewCategoryName("")
      setShowNewCategoryInput(false)
      setSelectedLocation("")
      setNewLocationName("")
      setShowNewLocationInput(false)
      setPhotographer("")
      setSelectedGallery("")
      setIsFeatured(false)
      setSaving(false)
      setError(null)
      setIsImage(false)
    }
  }, [isOpen, media])

  const handleSave = async () => {
    if (!media || !title || (!selectedCategory && !newCategoryName) || (!selectedLocation && !newLocationName) || !selectedGallery) {
      setError("Please fill in all required fields.")
      return
    }

    setSaving(true)
    setError(null)

    const supabase = createClient()
    let categoryId = null;
    let locationId = null;

    try {
      // Handle new category creation or selection
      if (showNewCategoryInput && newCategoryName) {
        const slug = newCategoryName.toLowerCase().replace(/\s+/g, '-')
        const { data: existingCategory } = await supabase.from("gallery_media_categories").select("id").eq("slug", slug).single()
        if (existingCategory) {
          categoryId = existingCategory.id
        } else {
          const { data, error: categoryError } = await supabase.from("gallery_media_categories").insert([{ name: newCategoryName, slug }]).select("id").single()
          if (categoryError) throw categoryError
          categoryId = data.id
        }
      } else if (selectedCategory) {
        categoryId = selectedCategory
      } else {
        setError("Please select or add a category.")
        return
      }

      // Handle new location creation or selection
      if (showNewLocationInput && newLocationName) {
        const slug = newLocationName.toLowerCase().replace(/\s+/g, '-')
        const { data: existingLocation } = await supabase.from("gallery_media_locations").select("id").eq("slug", slug).single()
        if (existingLocation) {
          locationId = existingLocation.id
        } else {
          const { data, error: locationError } = await supabase.from("gallery_media_locations").insert([{ name: newLocationName, slug }]).select("id").single()
          if (locationError) throw locationError
          locationId = data.id
        }
      } else if (selectedLocation) {
        locationId = selectedLocation
      } else {
        setError("Please select or add a location.")
        return
      }

      const tableName = media?.src?.includes("images") ? "gallery_images" : "gallery_videos"

      const { error: updateError } = await supabase
        .from(tableName)
        .update({
          title,
          description,
          category_id: categoryId,
          location_id: locationId,
          photographer,
          gallery_id: selectedGallery,
          featured: isFeatured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", media.id)

      if (updateError) throw updateError

      toast({
        title: "Update Successful!",
        description: `Media "${title}" updated successfully.`,
      })
      onUpdateComplete()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to update media.")
      toast({
        title: "Update Failed",
        description: err.message || "There was an error updating your media.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
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

  // Strict check: if media or media.src is null/undefined, do not render.
  if (!media?.src) {
    console.log("GalleryMediaEditModal: media or media.src is null/undefined. Returning null.", media);
    return null;
  }

  // Safely get media source and thumbnail, ensuring they are strings
  const mediaSrc = media?.src || "";
  const mediaThumbnail = media?.thumbnail || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit {isImage ? "Image" : "Video"} Details</DialogTitle>
          <DialogDescription>{media?.description || "No description provided."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Media Preview (read-only) */}
          <div className="aspect-video relative rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            {isImage && mediaSrc ? (
              <img src={mediaSrc} alt={media?.title || "Media Preview"} className="w-full h-full object-contain" />
            ) : !isImage && mediaSrc ? (
              <video src={mediaSrc} poster={mediaThumbnail} controls className="w-full h-full object-contain" />
            ) : (
              <div className="text-earth-600">No preview available.</div>
            )}
          </div>

          {/* Edit Fields */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photographer" className="text-right">Photographer</Label>
            <Input id="photographer" value={photographer} onChange={(e) => setPhotographer(e.target.value)} className="col-span-3" placeholder="Name of photographer (optional)" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gallery" className="text-right">Gallery</Label>
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
            <Label htmlFor="category" className="text-right">Category</Label>
            {showNewCategoryInput ? (
              <Input
                id="newCategory"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter new category name"
                className="col-span-3"
                onBlur={() => !newCategoryName && setShowNewCategoryInput(false)}
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
            <Label htmlFor="location" className="text-right">Location</Label>
            {showNewLocationInput ? (
              <Input
                id="newLocation"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Enter new location name"
                className="col-span-3"
                onBlur={() => !newLocationName && setShowNewLocationInput(false)}
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
            <Label htmlFor="featured" className="text-right">Featured</Label>
            <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} className="col-span-3" />
          </div>
          {error && <p className="text-red-500 text-center col-span-4">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
