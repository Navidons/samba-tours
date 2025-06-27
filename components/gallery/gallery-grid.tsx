"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Eye, MapPin, Camera } from "lucide-react"
import GalleryLightbox from "./gallery-lightbox"

interface GalleryGridProps {
  images: any[];
  onImageClick: (index: number) => void;
}

export default function GalleryGrid({ images, onImageClick }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => new Set([...prev, id]))
  }

  const toggleLike = (id: number) => {
    setLikedImages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getGridItemClass = (aspectRatio: string) => {
    switch (aspectRatio) {
      case "1:1":
        return "aspect-square"
      case "3:4":
        return "aspect-[3/4]"
      case "4:3":
        return "aspect-[4/3]"
      case "3:2":
        return "aspect-[3/2]"
      case "8:5":
        return "aspect-[8/5]"
      case "5:3":
        return "aspect-[5/3]"
      case "8:7":
        return "aspect-[8/7]"
      default:
        return "aspect-[4/3]"
    }
  }

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {images.map((item, index) => (
          <Card
            key={item.id}
            className="group break-inside-avoid overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onImageClick(index)}
          >
            <div className="relative overflow-hidden">
              <div className={`relative ${getGridItemClass(item.aspectRatio || "4:3")} w-full`}>
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.title || "Gallery Image"}
                  fill
                  className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                    loadedImages.has(item.id) ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(item.id)}
                />

                {/* Loading skeleton */}
                {!loadedImages.has(item.id) && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-forest-600 text-white capitalize">{item.category?.name || 'N/A'}</Badge>
                </div>

                {/* Action buttons */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                  <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:text-forest-600 hover:bg-white/80 transition-colors"
                      onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                  >
                    <Heart
                        className={`h-5 w-5 ${
                          likedImages.has(item.id) ? "fill-red-500 text-red-500" : "text-white"
                        }`}
                    />
                  </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:text-forest-600 hover:bg-white/80 transition-colors">
                      <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                  <div className="flex items-center text-white text-sm">
                    <Eye className="h-4 w-4 mr-1" /> {item.views || 0}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-earth-900 mb-1">{item.title}</h3>
              <p className="text-sm text-earth-600 mb-2">{item.description}</p>
              <div className="flex items-center text-earth-500 text-xs gap-4">
                {item.photographer && (
                  <span className="flex items-center"><Camera className="h-3 w-3 mr-1" /> {item.photographer}</span>
                )}
                {item.location?.name && (
                  <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> {item.location.name}</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {selectedImage !== null && (
        <GalleryLightbox
          images={images}
          selectedIndex={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  )
}
