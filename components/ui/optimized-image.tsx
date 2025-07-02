"use client"

import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  fill?: boolean
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down"
  placeholder?: "blur" | "empty"
  blurDataURL?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 85,
  fill = false,
  objectFit = "cover",
  placeholder = "empty",
  blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyvi1Dw==",
  ...props
}: OptimizedImageProps & Omit<React.ComponentProps<typeof Image>, keyof OptimizedImageProps>) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  // Generate optimized file name from alt text for SEO
  const generateOptimizedFileName = (altText: string, originalSrc: string) => {
    if (originalSrc.startsWith('http') || originalSrc.startsWith('data:')) {
      return originalSrc
    }
    
    const cleanAlt = altText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
    
    const extension = originalSrc.split('.').pop() || 'jpg'
    const basePath = originalSrc.substring(0, originalSrc.lastIndexOf('/') + 1)
    
    return `${basePath}${cleanAlt}.${extension}`
  }

  const optimizedSrc = generateOptimizedFileName(alt, src)

  if (error) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400",
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <span className="text-sm">Image not available</span>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          fill ? `object-${objectFit}` : ""
        )}
        style={!fill ? { objectFit } : undefined}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Utility function to generate WebP and AVIF versions
export function generateResponsiveImageSources(src: string, sizes: number[] = [480, 768, 1024, 1200]) {
  if (src.startsWith('http') || src.startsWith('data:')) {
    return { webp: src, avif: src, fallback: src }
  }

  const baseName = src.substring(0, src.lastIndexOf('.'))
  const extension = src.split('.').pop()

  return {
    webp: `${baseName}.webp`,
    avif: `${baseName}.avif`,
    fallback: src,
    srcSet: {
      webp: sizes.map(size => `${baseName}-${size}w.webp ${size}w`).join(', '),
      avif: sizes.map(size => `${baseName}-${size}w.avif ${size}w`).join(', '),
      fallback: sizes.map(size => `${baseName}-${size}w.${extension} ${size}w`).join(', ')
    }
  }
}

// Picture component for maximum optimization
interface ResponsiveImageProps extends OptimizedImageProps {
  srcSizes?: number[]
}

export function ResponsiveImage({ 
  src, 
  alt, 
  srcSizes = [480, 768, 1024, 1200],
  ...props 
}: ResponsiveImageProps) {
  const sources = generateResponsiveImageSources(src, srcSizes)

  return (
    <picture>
      <source srcSet={sources.srcSet.avif} type="image/avif" />
      <source srcSet={sources.srcSet.webp} type="image/webp" />
      <OptimizedImage
        src={sources.fallback}
        alt={alt}
        {...props}
      />
    </picture>
  )
} 