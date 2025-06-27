"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Search, Filter, Edit, Trash2, Eye, FolderPlus, Video as VideoIcon, Image as ImageIcon } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase"
import GalleryNewMediaModal from "@/components/admin/GalleryNewMediaModal"
import GalleryCreateModal from "@/components/admin/GalleryCreateModal"
import GalleryMediaDetailModal from "@/components/admin/GalleryMediaDetailModal"
import GalleryMediaEditModal from "@/components/admin/GalleryMediaEditModal"
import GalleryMediaDeleteConfirmModal from "@/components/admin/GalleryMediaDeleteConfirmModal"
import { toast } from "@/components/ui/use-toast"

export default function GalleryManagement() {
  const [galleries, setGalleries] = useState<any[]>([])
  const [images, setImages] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState("photos")
  const [isNewMediaModalOpen, setIsNewMediaModalOpen] = useState(false)
  const [isMediaDetailModalOpen, setIsMediaDetailModalOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null)
  const [isMediaEditModalOpen, setIsMediaEditModalOpen] = useState(false)
  const [mediaToEdit, setMediaToEdit] = useState<any | null>(null)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [mediaToDelete, setMediaToDelete] = useState<any | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      // Fetch galleries
      const { data: galleryData, error: galleryError } = await supabase
        .from("galleries")
        .select("*, images:gallery_images(*), videos:gallery_videos(*)")
        .order("updated_at", { ascending: false })
      if (galleryError) throw galleryError
      setGalleries(galleryData || [])
      // Fetch all images for stats and display
      const { data: imageData, error: imageError } = await supabase
        .from("gallery_images")
        .select("*, category:gallery_media_categories!category_id(name), location:gallery_media_locations!location_id(name)") // Corrected join syntax
      if (imageError) throw imageError
      setImages(imageData || [])
      // Fetch all videos for stats and display
      const { data: videoData, error: videoError } = await supabase
        .from("gallery_videos")
        .select("*, category:gallery_media_categories!category_id(name), location:gallery_media_locations!location_id(name)") // Corrected join syntax
      if (videoError) throw videoError
      setVideos(videoData || [])
    } catch (err: any) {
      setError(err.message || "Failed to load galleries")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMedia = async (media: any) => {
    const supabase = createClient()
    try {
      const isImage = typeof media.src === 'string' && media.src.includes("images")
      const tableName = isImage ? "gallery_images" : "gallery_videos"
      const storagePath = isImage ? `images/${media.file_name}` : `videos/${media.file_name}`

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([storagePath])

      if (storageError) {
        console.error("Storage deletion error:", storageError)
        // Don't throw here, allow database deletion to proceed if storage deletion fails
        // You might want more sophisticated error handling depending on requirements
      }

      // Delete from database
      const { error: dbError } = await supabase.from(tableName).delete().eq("id", media.id)
      if (dbError) throw dbError

      toast({
        title: "Deletion Successful!",
        description: `Media "${media.title}" deleted successfully.`,
      })
      fetchData()
    } catch (err: any) {
      toast({
        title: "Deletion Failed",
        description: err.message || "There was an error deleting your media.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Stats
  const totalImages = images.length
  const totalGalleries = galleries.length
  const featuredImages = images.filter(img => img.featured).length
  const totalVideos = videos.length
  const featuredVideos = videos.filter(v => v.featured).length
  const totalStorage = images.reduce((sum, img) => sum + (img.size || 0), 0) + videos.reduce((sum, v) => sum + (v.size || 0), 0)
  const storageGB = totalStorage ? (totalStorage / (1024 * 1024 * 1024)).toFixed(2) : '--'

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-earth-900 mb-2">Gallery Management</h1>
              <p className="text-earth-600">Manage photo and video galleries and media assets</p>
            </div>
            {/* Admin Modals: Create Gallery & Upload Media */}
            <div className="flex gap-2">
              <GalleryCreateModal onGalleryCreated={fetchData} />
              <Button onClick={() => setIsNewMediaModalOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Add New Media
              </Button>
            </div>
          </div>

          {/* New Media Upload Modal */}
          <GalleryNewMediaModal
            isOpen={isNewMediaModalOpen}
            onClose={() => setIsNewMediaModalOpen(false)}
            onUploadComplete={fetchData}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <ImageIcon className="h-8 w-8 text-forest-600 mb-2" />
                <div className="text-2xl font-bold text-earth-900">{totalImages}</div>
                <p className="text-sm text-earth-600">Total Images</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <VideoIcon className="h-8 w-8 text-blue-600 mb-2" />
                <div className="text-2xl font-bold text-blue-600">{totalVideos}</div>
                <p className="text-sm text-earth-600">Total Videos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <FolderPlus className="h-8 w-8 text-purple-600 mb-2" />
                <div className="text-2xl font-bold text-purple-600">{totalGalleries}</div>
                <p className="text-sm text-earth-600">Galleries</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Badge className="mb-2 bg-yellow-100 text-yellow-800">Featured</Badge>
                <div className="text-lg font-bold text-yellow-700">{featuredImages} images</div>
                <div className="text-lg font-bold text-yellow-700">{featuredVideos} videos</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Upload className="h-8 w-8 text-emerald-600 mb-2" />
                <div className="text-2xl font-bold text-emerald-600">{storageGB} GB</div>
                <p className="text-sm text-earth-600">Storage Used</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Photo/Video Gallery */}
          <Tabs value={tab} onValueChange={setTab} className="mb-8">
            <TabsList>
              <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
              <TabsTrigger value="videos">Video Gallery</TabsTrigger>
            </TabsList>
            <TabsContent value="photos">
              {/* Photo Galleries Grid */}
              {loading ? (
                <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
              ) : error ? (
                <div className="text-center text-red-600 py-12">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.title || "Gallery Image"}
                          className="w-full h-full object-cover"
                        />
                        {image.featured && (
                          <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-earth-900 mb-2">{image.title}</h3>
                          <p className="text-sm text-earth-600 mb-2">{image.description}</p>
                          <div className="flex items-center justify-between text-sm text-earth-600 mb-2">
                            <span>Category: {image.category ? image.category.name : 'N/A'}</span>
                            <span>Location: {image.location ? image.location.name : 'N/A'}</span>
                          </div>
                          {image.photographer && <p className="text-xs text-earth-500 mb-1">Photographer: {image.photographer}</p>}
                          <div className="flex items-center justify-between text-xs text-earth-500">
                            <span>Likes: {image.likes || 0}</span>
                            <span>Views: {image.views || 0}</span>
                          </div>
                          <p className="text-xs text-earth-500">Uploaded: {image.created_at ? new Date(image.created_at).toLocaleDateString() : '-'}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => { 
                            setSelectedMedia(image);
                            setIsMediaDetailModalOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => { 
                            setMediaToEdit(image);
                            setIsMediaEditModalOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => {
                            setMediaToDelete(image);
                            setIsDeleteConfirmModalOpen(true);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="videos">
              {/* Video Gallery Grid */}
              {loading ? (
                <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
              ) : error ? (
                <div className="text-center text-red-600 py-12">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <video
                          src={video.src}
                          poster={video.thumbnail}
                          controls
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                        />
                        {video.featured && (
                          <Badge className="absolute top-3 right-3 bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-earth-900 mb-2">{video.title}</h3>
                          <p className="text-sm text-earth-600 mb-2">{video.description}</p>
                          <div className="flex items-center justify-between text-sm text-earth-600 mb-2">
                            <span>Category: {video.category ? video.category.name : 'N/A'}</span>
                            <span>Location: {video.location ? video.location.name : 'N/A'}</span>
                          </div>
                          {video.photographer && <p className="text-xs text-earth-500 mb-1">Photographer: {video.photographer}</p>}
                          <div className="flex items-center justify-between text-xs text-earth-500">
                            <span>Likes: {video.likes || 0}</span>
                            <span>Views: {video.views || 0}</span>
                          </div>
                          <p className="text-xs text-earth-500">Uploaded: {video.created_at ? new Date(video.created_at).toLocaleDateString() : '-'}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => { 
                            setSelectedMedia(video);
                            setIsMediaDetailModalOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => { 
                            setMediaToEdit(video);
                            setIsMediaEditModalOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => {
                            setMediaToDelete(video);
                            setIsDeleteConfirmModalOpen(true);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Media Detail Modal */}
      <GalleryMediaDetailModal
        isOpen={isMediaDetailModalOpen}
        onClose={() => {
          setIsMediaDetailModalOpen(false);
          setSelectedMedia(null);
        }}
        media={selectedMedia}
      />
      {/* Media Edit Modal */}
      <GalleryMediaEditModal
        isOpen={isMediaEditModalOpen}
        onClose={() => {
          setIsMediaEditModalOpen(false);
          setMediaToEdit(null);
        }}
        media={mediaToEdit}
        onUpdateComplete={fetchData}
      />
      {/* Delete Confirmation Modal */}
      <GalleryMediaDeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={() => {
          setIsDeleteConfirmModalOpen(false);
          setMediaToDelete(null);
        }}
        media={mediaToDelete}
        onConfirmDelete={handleDeleteMedia}
      />
    </main>
  )
}
