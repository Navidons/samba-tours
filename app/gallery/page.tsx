"use client"
import { useEffect, useState, useMemo, useCallback } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import GalleryHero from "@/components/gallery/gallery-hero"
import GalleryFilters from "@/components/gallery/gallery-filters"
import GalleryGrid from "@/components/gallery/gallery-grid"
import VideoGallery from "@/components/gallery/video-gallery"
import GalleryStats from "@/components/gallery/gallery-stats"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createClient } from "@/lib/supabase"
import GalleryLightbox from "@/components/gallery/gallery-lightbox"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | number>("all")
  const [activeLocation, setActiveLocation] = useState<string | number>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry") // Assuming default view
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

  const [allCategories, setAllCategories] = useState<any[]>([])
  const [allLocations, setAllLocations] = useState<any[]>([])

  const supabase = useMemo(() => createClient(), []); // Memoize Supabase client

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      const { data: imageData, error: imageError } = await supabase
        .from("gallery_images")
        .select("*, category:gallery_media_categories!category_id(id, name), location:gallery_media_locations!location_id(id, name)")
      if (imageError) console.error("Error fetching images:", imageError.message)
      const imagesWithMediaType = (imageData || []).map(img => ({ ...img, mediaType: 'image' }));

      const { data: videoData, error: videoError } = await supabase
        .from("gallery_videos")
        .select("*, category:gallery_media_categories!category_id(id, name), location:gallery_media_locations!location_id(id, name)")
      if (videoError) console.error("Error fetching videos:", videoError.message)
      const videosWithMediaType = (videoData || []).map(vid => ({ ...vid, mediaType: 'video' }));

      const { data: categoriesData, error: categoriesError } = await supabase.from("gallery_media_categories").select("id, name")
      if (categoriesError) console.error("Error fetching categories:", categoriesError.message)

      const { data: locationsData, error: locationsError } = await supabase.from("gallery_media_locations").select("id, name")
      if (locationsError) console.error("Error fetching locations:", locationsError.message)

      setImages(imagesWithMediaType)
      setVideos(videosWithMediaType)

      // Calculate counts for categories and locations
      const categoryCounts: { [key: number]: number } = {};
      const locationCounts: { [key: number]: number } = {};

      [...(imagesWithMediaType || []), ...(videosWithMediaType || [])].forEach(item => {
        if (item.category?.id) {
          categoryCounts[item.category.id] = (categoryCounts[item.category.id] || 0) + 1;
        }
        if (item.location?.id) {
          locationCounts[item.location.id] = (locationCounts[item.location.id] || 0) + 1;
        }
      });

      const categoriesWithCounts = (categoriesData || []).map((cat: any) => ({
        ...cat,
        count: categoryCounts[cat.id] || 0,
      }));

      const locationsWithCounts = (locationsData || []).map((loc: any) => ({
        ...loc,
        count: locationCounts[loc.id] || 0,
      }));

      setAllCategories(categoriesWithCounts || [])
      setAllLocations(locationsWithCounts || [])
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const handleImageClick = (index: number) => {
    setSelectedMediaIndex(index)
    setSelectedMediaType('image');
  }

  const handleVideoClick = (index: number) => {
    setSelectedMediaIndex(index)
    setSelectedMediaType('video');
  }

  const handleUpdateMedia = useCallback((id: number, mediaType: 'image' | 'video', newViews?: number, newLikes?: number) => {
    if (mediaType === 'image') {
      setImages(prevImages =>
        prevImages.map(img =>
          img.id === id ? { ...img, views: newViews ?? img.views, likes: newLikes ?? img.likes } : img
        )
      );
    } else if (mediaType === 'video') {
      setVideos(prevVideos =>
        prevVideos.map(vid =>
          vid.id === id ? { ...vid, views: newViews ?? vid.views, likes: newLikes ?? vid.likes } : vid
        )
      );
    }
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter(image => {
      const matchesCategory = String(activeCategory) === "all" || String(image.category?.id) === String(activeCategory)
      const matchesLocation = String(activeLocation) === "all" || String(image.location?.id) === String(activeLocation)
      const matchesSearch = searchTerm.toLowerCase() === "" ||
        image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.photographer?.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesCategory && matchesLocation && matchesSearch
    })
  }, [images, activeCategory, activeLocation, searchTerm])

  const filteredVideos = useMemo(() => {
    return videos.filter(video => {
      const matchesCategory = String(activeCategory) === "all" || String(video.category?.id) === String(activeCategory)
      const matchesLocation = String(activeLocation) === "all" || String(video.location?.id) === String(activeLocation)
      const matchesSearch = searchTerm.toLowerCase() === "" ||
        video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesCategory && matchesLocation && matchesSearch
    })
  }, [videos, activeCategory, activeLocation, searchTerm])

  const currentFilteredMedia = useMemo(() => {
    if (selectedMediaType === 'image') return filteredImages;
    if (selectedMediaType === 'video') return filteredVideos;
    return [];
  }, [selectedMediaType, filteredImages, filteredVideos]);

  if (loading) return (
    <main className="min-h-screen bg-cream-50 flex justify-center items-center">
      <LoadingSpinner />
    </main>
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50">
        <GalleryHero />
        {/* GalleryStats currently uses dummy data, will need to update if you want dynamic stats */}
        <GalleryStats />
        <section className="section-padding">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="heading-secondary">Explore Our Adventures</h2>
              <p className="text-xl text-earth-600 max-w-3xl mx-auto">
                Every image tells a story of incredible encounters, breathtaking landscapes, and unforgettable moments.
                Browse through our collection of photos and videos captured during real tours with our travelers.
              </p>
            </div>
            <GalleryFilters
              categories={allCategories}
              locations={allLocations}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeLocation={activeLocation}
              setActiveLocation={setActiveLocation}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <GalleryGrid images={filteredImages} onImageClick={handleImageClick} />
          </div>
        </section>
        <VideoGallery videos={filteredVideos} onVideoClick={handleVideoClick} />
      </main>
      <Footer />

      {selectedMediaIndex !== null && selectedMediaType !== null && (
        <GalleryLightbox
          media={currentFilteredMedia}
          selectedIndex={selectedMediaIndex}
          onClose={() => {
            setSelectedMediaIndex(null);
            setSelectedMediaType(null);
          }}
          onIndexChange={setSelectedMediaIndex}
          supabase={supabase}
          onUpdateMedia={handleUpdateMedia}
        />
      )}
    </>
  )
}
