"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, Eye, Calendar } from "lucide-react"

interface VideoGalleryProps {
  videos: any[];
  onVideoClick: (index: number) => void;
}

export default function VideoGallery({ videos, onVideoClick }: VideoGalleryProps) {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null)

  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index);
    onVideoClick(index);
  }

  const VideoThumbnail = ({ videoSrc, videoId }: { videoSrc: string; videoId: string }) => {
    const [thumbnail, setThumbnail] = useState<string | null>(null);

    useEffect(() => {
      if (!videoSrc) return;

      const video = document.createElement('video');
      video.src = videoSrc;
      video.crossOrigin = 'anonymous'; // Important for cross-origin videos (e.g., Supabase Storage)
      video.currentTime = 5; // Seek to 5 seconds

      video.onloadedmetadata = () => {
        console.log("Video metadata loaded for", videoId);
      };

      video.onseeked = () => {
        console.log("Video seeked to 5s for", videoId);
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setThumbnail(canvas.toDataURL('image/png'));
        }
        video.remove(); // Clean up the temporary video element
      };

      video.onerror = (e) => {
        console.error("Error loading video for thumbnail generation:", videoId, e);
        // Fallback to placeholder if error occurs
        setThumbnail("/placeholder.svg");
      };

      // Trigger load for the video element
      video.load();

      return () => {
        video.removeEventListener('loadedmetadata', video.onloadedmetadata);
        video.removeEventListener('seeked', video.onseeked);
        video.removeEventListener('error', video.onerror);
        video.remove();
      };
    }, [videoSrc, videoId]);

    if (!thumbnail) {
      return <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center text-earth-500">Loading thumbnail...</div>;
    }

    return (
      <Image
        src={thumbnail}
        alt="Video Thumbnail"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
    );
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="heading-secondary">Video Gallery</h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Experience Uganda through motion. Our video collection captures the sounds, movements, and emotions of real
            adventures with our travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {videos.map((video, index) => (
            <Card key={video.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <VideoThumbnail videoSrc={video.src} videoId={video.id} />

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm h-16 w-16 rounded-full p-0"
                    onClick={() => handleVideoClick(index)}
                  >
                    <Play className="h-8 w-8 ml-1" />
                  </Button>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{video.duration || '--:--'}</span>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-forest-600 text-white capitalize">{video.category?.name || 'N/A'}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-earth-900 mb-2 group-hover:text-forest-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-earth-700 mb-4 line-clamp-2">{video.description}</p>

                <div className="flex items-center justify-between text-sm text-earth-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{video.views?.toLocaleString() || 0} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{video.created_at ? new Date(video.created_at).toLocaleDateString() : '-'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline">
            View All Videos
          </Button>
        </div>
      </div>
    </section>
  )
}
