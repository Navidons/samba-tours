"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react"

interface TourGalleryProps {
  gallery: string[]
  title: string
}

export default function TourGallery({ gallery, title }: TourGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % gallery.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + gallery.length) % gallery.length)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-forest-600" />
            <span>Photo Gallery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                {/* Shiny border effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-yellow-400/50 via-orange-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-tl from-blue-400/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                
                {/* Inner container with padding for border effect */}
                <div className="relative h-full w-full p-1 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-size-200 animate-shimmer">
                  <div className="relative h-full w-full rounded-md overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${title} - Image ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10 p-0"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 p-0"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="max-w-4xl max-h-[80vh] relative">
            <Image
              src={gallery[selectedImage] || "/placeholder.svg"}
              alt={`${title} - Image ${selectedImage + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {selectedImage + 1} of {gallery.length}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }
        .bg-size-200 {
          background-size: 200% 100%;
        }
      `}</style>
    </>
  )
}
