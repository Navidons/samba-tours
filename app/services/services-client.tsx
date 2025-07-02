"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ServiceWithDetails, ServiceCategory } from "@/lib/services"

interface ServicesClientProps {
  services: ServiceWithDetails[]
  categories: ServiceCategory[]
  currentCategory?: string
}

export function ServicesClient({ services, categories, currentCategory }: ServicesClientProps) {
  return (
    <>
      {/* Category Filter */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-12 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant={!currentCategory ? "default" : "outline"}
          className="rounded-full"
          asChild
        >
          <Link href="/services">
            All Services
          </Link>
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.slug ? "default" : "outline"}
            className="rounded-full"
            asChild
          >
            <Link href={`/services?category=${category.slug}`}>
              {category.name}
            </Link>
          </Button>
        ))}
      </motion.div>

      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const primaryImage = service.images?.find((img) => img.is_primary)

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card 
                className="group overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={primaryImage?.url || '/placeholder.jpg'}
                    alt={primaryImage?.alt_text || service.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  <Shield className="absolute top-4 right-4 h-6 w-6 text-white" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-2">
                    {service.features?.map((feature, index) => (
                      <div key={feature.id || index} className="flex items-center text-sm">
                        <Shield className="h-4 w-4 mr-2 text-forest-600" />
                        {typeof feature === 'string' ? feature : feature.title}
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-6"
                    asChild
                  >
                    <Link href={`/services/${service.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* No Results Message */}
      {services.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No services found</h3>
          <p className="text-muted-foreground">
            No services were found in this category. Please try another category or view all services.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            asChild
          >
            <Link href="/services">
              View All Services
            </Link>
          </Button>
        </div>
      )}
    </>
  )
} 