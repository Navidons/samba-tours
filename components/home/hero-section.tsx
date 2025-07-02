"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Star, Users, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { PAGE_SEO } from "@/lib/seo"

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1549366021-9f761d450615?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Majestic mountain gorilla in Uganda's Bwindi Impenetrable National Park",
    title: "Gorilla Trekking Adventures",
    subtitle: "Meet our closest relatives in their natural habitat"
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Spectacular Murchison Falls cascading down layered rock formations",
    title: "Murchison Falls National Park",
    subtitle: "Witness the world's most powerful waterfall"
  },
  {
    src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "African elephants in Queen Elizabeth National Park",
    title: "Wildlife Safari Experiences",
    subtitle: "Discover the Big Five and beyond"
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Traditional Ugandan dancers performing cultural dance",
    title: "Cultural Immersion",
    subtitle: "Experience Uganda's rich traditions and heritage"
  },
  {
    src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    alt: "Scenic Lake Victoria shoreline at sunset",
    title: "Lake Victoria & Islands",
    subtitle: "Explore the world's largest tropical lake"
  }
]

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <div className="transition-all duration-1000 transform">
            <h1 className="heading-primary text-white mb-6 animate-fade-in">
              {PAGE_SEO.home.h1}
            </h1>
            <h2 className="text-xl lg:text-2xl mb-8 text-gray-200 animate-slide-up">
              {heroImages[currentImageIndex].subtitle}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
            <Button size="lg" className="btn-primary text-lg px-8 py-4">
              <Link href="/tours" className="flex items-center space-x-2">
                <span>Explore Tours</span>
                <MapPin className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Link href="/gallery" className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Watch Video</span>
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-3xl font-bold">4.9</span>
              </div>
              <p className="text-gray-300">Customer Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-forest-400 mr-2" />
                <span className="text-3xl font-bold">500+</span>
              </div>
              <p className="text-gray-300">Happy Travelers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-forest-400 mr-2" />
                <span className="text-3xl font-bold">15+</span>
              </div>
              <p className="text-gray-300">Destinations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
} 