import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getServices, getServiceCategories } from "@/lib/services"
import { ServicesClient } from "./services-client"

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Category Filter Skeleton */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-32 rounded-full" />
        ))}
      </div>

      {/* Services Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative h-48">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ServicesPage({ searchParams }: PageProps) {
  // Await all promises in parallel
  const [params, services, categories] = await Promise.all([
    searchParams,
    getServices(),
    getServiceCategories()
  ])

  const categorySlug = typeof params.category === 'string' ? params.category : undefined

  // Filter services by category if a category is selected
  const filteredServices = categorySlug 
    ? services.filter(service => service.category?.slug === categorySlug)
    : services

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <Image
          src="/images/murchison-falls-hero.jpg"
          alt="Services Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {categorySlug 
                ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Services`
                : 'Our Services'
              }
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Comprehensive travel solutions to make your Uganda adventure unforgettable
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <Suspense fallback={<LoadingSkeleton />}>
          <ServicesClient 
            services={filteredServices} 
            categories={categories}
            currentCategory={categorySlug}
          />
        </Suspense>
      </section>

      {/* CTA Section */}
      <section className="bg-forest-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Adventure?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let us help you create the perfect travel experience with our comprehensive services
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 