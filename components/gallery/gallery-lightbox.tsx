"use client"

import { useEffect, useCallback, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart, MapPin, Camera, Calendar, Eye } from "lucide-react"
import { SupabaseClient } from "@supabase/supabase-js"

interface GalleryItem {
  id: number
  src: string
  alt: string | null;
  category: { id: string; name: string };
  location: { id: string; name: string };
  title: string
  description: string
  photographer: string | null;
  created_at: string;
  likes: number | null;
  views: number | null;
  aspectRatio: string | null;
  mediaType: 'image' | 'video';
}

interface GalleryLightboxProps {
  media: GalleryItem[];
  selectedIndex: number
  onClose: () => void
  onIndexChange: (newIndex: number) => void;
  supabase: SupabaseClient;
  onUpdateMedia: (id: number, mediaType: 'image' | 'video', newViews?: number, newLikes?: number) => void;
}

export default function GalleryLightbox({ media, selectedIndex, onClose, onIndexChange, supabase, onUpdateMedia }: GalleryLightboxProps) {
  const currentMedia = media[selectedIndex]
  const [currentLikes, setCurrentLikes] = useState(currentMedia?.likes || 0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  useEffect(() => {
    setCurrentLikes(currentMedia?.likes || 0);
    setShowLikeAnimation(false);

    const incrementView = async () => {
      if (currentMedia) {
        const tableName = currentMedia.mediaType === 'image' ? 'gallery_images' : 'gallery_videos';
        const { data, error } = await supabase.rpc('increment_view_count', {
          row_id: currentMedia.id,
          table_name: tableName
        });
        if (error) console.error('Error incrementing view count:', error);
        else {
          onUpdateMedia(currentMedia.id, currentMedia.mediaType, (currentMedia.views || 0) + 1, currentLikes);
        }
      }
    };
    incrementView();
  }, [currentMedia, supabase, onUpdateMedia]);

  const handleNext = useCallback(() => {
    const nextIndex = (selectedIndex + 1) % media.length
    onIndexChange(nextIndex);
  }, [selectedIndex, media.length, onIndexChange]);

  const handlePrev = useCallback(() => {
    const prevIndex = (selectedIndex - 1 + media.length) % media.length
    onIndexChange(prevIndex);
  }, [selectedIndex, media.length, onIndexChange]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          handlePrev()
          break
        case "ArrowRight":
          handleNext()
          break
      }
    },
    [onClose, handleNext, handlePrev],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [handleKeyDown])

  const handleLike = useCallback(async () => {
    if (currentMedia) {
      const tableName = currentMedia.mediaType === 'image' ? 'gallery_images' : 'gallery_videos';
      const { data, error } = await supabase.rpc('increment_like_count', {
        row_id: currentMedia.id,
        table_name: tableName
      });
      if (error) console.error('Error incrementing like count:', error);
      else {
        const newLikes = currentLikes + 1;
        setCurrentLikes(newLikes);
        setShowLikeAnimation(true);
        setTimeout(() => setShowLikeAnimation(false), 1000);
        onUpdateMedia(currentMedia.id, currentMedia.mediaType, currentMedia.views, newLikes);
      }
    }
  }, [currentMedia, currentLikes, supabase, onUpdateMedia]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: currentMedia.title || "Samba Tours Gallery Image",
        text: currentMedia.description || "Check out this amazing photo from Samba Tours!",
        url: currentMedia.src || window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that do not support the Web Share API
      const imageUrl = currentMedia.src || window.location.href;
      navigator.clipboard.writeText(imageUrl).then(() => {
        alert("Image URL copied to clipboard!");
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  }, [currentMedia]);

  const handleDownload = useCallback(() => {
    if (!currentMedia?.src) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // This is crucial for images loaded from different origins
    img.src = currentMedia.src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0);

        // Add watermark
        const watermarkText = "© Samba Tours";
        const fontSize = Math.max(20, img.width / 30); // Adjust font size based on image width
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // White, semi-transparent
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        const padding = 20;
        ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);

        // Trigger download
        const link = document.createElement('a');
        link.download = `samba-tours-${currentMedia.title || currentMedia.id}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    img.onerror = (e) => {
      console.error("Error loading image for watermark:", e);
      alert("Could not download image. Please try again.");
    };
  }, [currentMedia]);

  if (!currentMedia) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 h-10 w-10 p-0"
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12 p-0"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20 h-12 w-12 p-0"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto p-4">
        {/* Media (Image or Video) */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative max-w-full max-h-full">
            {currentMedia.mediaType === 'image' ? (
            <Image
                src={currentMedia.src || "/placeholder.svg"}
                alt={String(currentMedia.title || currentMedia.alt || "Gallery image")}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
              priority
            />
            ) : (
              <video
                src={currentMedia.src}
                controls
                autoPlay
                loop
                muted
                className="max-w-full max-h-[80vh] object-contain"
              />
            )}
          </div>
        </div>

        {/* Info panel */}
        <div className="lg:w-80 bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white lg:ml-6 mt-4 lg:mt-0">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-forest-600 text-white capitalize">{currentMedia.category?.name || 'N/A'}</Badge>
            <span className="text-sm text-gray-300">
              {selectedIndex + 1} of {media.length}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-3">{currentMedia.title}</h2>
          <p className="text-gray-200 mb-6 leading-relaxed">{currentMedia.description}</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-forest-300" />
              <span>{currentMedia.location?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Camera className="h-4 w-4 text-forest-300" />
              <span>Photo by {currentMedia.photographer || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-forest-300" />
              <span>{currentMedia.created_at ? new Date(currentMedia.created_at).toLocaleDateString() : '-'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{currentLikes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{currentMedia.views || 0}</span>
              </div>
            </div>
          </div>

          <div className="relative flex space-x-2">
            {showLikeAnimation && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart className="h-12 w-12 text-red-500 animate-like-pop" />
              </div>
            )}
            <Button size="sm" variant="secondary" className="flex-1" onClick={handleLike}>
              <Heart className="h-4 w-4 mr-2" />
              Like
            </Button>
            <Button size="sm" variant="secondary" className="flex-1" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button size="sm" variant="secondary" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
        {media.slice(Math.max(0, selectedIndex - 5), selectedIndex + 6).map((item, index) => {
          const actualIndex = Math.max(0, selectedIndex - 5) + index
          return (
            <div
              key={item.id}
              className={`relative w-16 h-16 flex-shrink-0 rounded cursor-pointer overflow-hidden ${
                actualIndex === selectedIndex ? "ring-2 ring-forest-400" : "opacity-60 hover:opacity-100"
              }`}
              onClick={() => {
                onIndexChange(actualIndex);
              }}
            >
              {item.mediaType === 'image' ? (
                <Image src={item.src || "/placeholder.svg"} alt={String(item.title || item.alt || "Gallery thumbnail")} fill className="object-cover" />
              ) : (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
