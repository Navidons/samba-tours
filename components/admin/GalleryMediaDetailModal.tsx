"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Image as ImageIcon, Video as VideoIcon, Heart, Eye } from "lucide-react"

interface GalleryMediaDetailModalProps {
  isOpen: boolean
  onClose: () => void
  media: any | null // Can be an image or video object
}

export default function GalleryMediaDetailModal({ isOpen, onClose, media }: GalleryMediaDetailModalProps) {
  if (!media) return null

  const isImage = media.src && media.src.includes("images") // Simple check for image based on path

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl md:max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{media.title || (isImage ? "Image Details" : "Video Details")}</DialogTitle>
          <DialogDescription>{media.description || "No description provided."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isImage ? (
            <div className="aspect-video relative rounded-md overflow-hidden">
              <img src={media.src} alt={media.title || "Media Image"} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-video relative rounded-md overflow-hidden">
              <video src={media.src} poster={media.thumbnail} controls autoPlay muted loop className="w-full h-full object-cover" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Type:</p>
              <p className="flex items-center gap-1">
                {isImage ? <ImageIcon className="h-4 w-4" /> : <VideoIcon className="h-4 w-4" />}
                {isImage ? "Image" : "Video"}
              </p>
            </div>
            {media.category?.name && (
              <div>
                <p className="font-semibold">Category:</p>
                <Badge variant="secondary">{media.category.name}</Badge>
              </div>
            )}
            {media.location?.name && (
              <div>
                <p className="font-semibold">Location:</p>
                <Badge variant="secondary">{media.location.name}</Badge>
              </div>
            )}
            {media.photographer && (
              <div>
                <p className="font-semibold">Photographer:</p>
                <p>{media.photographer}</p>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-red-500" />
                <span>{media.likes || 0} Likes</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-blue-500" />
                <span>{media.views || 0} Views</span>
              </div>
            </div>
            {media.created_at && (
              <div>
                <p className="font-semibold">Uploaded On:</p>
                <p>{new Date(media.created_at).toLocaleDateString()}</p>
              </div>
            )}
            {media.duration && !isImage && (
              <div>
                <p className="font-semibold">Duration:</p>
                <p>{`${Math.floor(media.duration / 60)}m ${media.duration % 60}s`}</p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 