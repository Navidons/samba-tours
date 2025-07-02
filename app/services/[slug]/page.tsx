import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Shield, Map, Plane, Hotel, Car, Camera, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getServiceBySlug, getServiceCategories } from "@/lib/services"

// Icon mapping
const iconMap: { [key: string]: any } = {
  Map,
  Plane,
  Hotel,
  Car,
  Camera,
  Compass,
}

interface Props {
  params: {
    slug: string
  }
}

export default async function ServicePage({ params }: Props) {
  const service = await getServiceBySlug(params.slug).catch(() => null)
  
  if (!service) {
    notFound()
  }

  const IconComponent = service.icon ? iconMap[service.icon] : Shield
  const primaryImage = service.images?.find(img => img.is_primary)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={primaryImage?.url || '/placeholder.jpg'}
          alt={primaryImage?.alt_text || service.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="flex items-center text-white/60 text-sm mb-4">
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link 
                href={`/services?category=${service.category?.slug}`}
                className="hover:text-white"
              >
                {service.category?.name}
              </Link>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {service.title}
                </h1>
                <p className="text-lg text-white/80 max-w-2xl">
                  {service.short_description || service.description}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 w-72">
                  <IconComponent className="h-8 w-8 text-white mb-4" />
                  <h3 className="text-white font-semibold mb-2">Quick Booking</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Ready to experience this service? Get in touch with us now.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/contact">Book Now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About This Service</h2>
              <div className="prose max-w-none">
                {service.description}
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold mb-4">What's Included</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.features.map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-forest-600" />
                      {feature.title}
                    </h3>
                    {feature.description && (
                      <p className="text-muted-foreground text-sm">
                        {feature.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            {service.images.length > 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.images.map((image) => (
                    <div key={image.id} className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={image.alt_text || service.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mobile Booking Card */}
            <div className="md:hidden bg-white rounded-lg border p-6">
              <IconComponent className="h-8 w-8 text-forest-600 mb-4" />
              <h3 className="font-semibold mb-2">Quick Booking</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Ready to experience this service? Get in touch with us now.
              </p>
              <Button className="w-full" asChild>
                <Link href="/contact">Book Now</Link>
              </Button>
            </div>

            {/* Category Info */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Category Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Category</label>
                  <p className="font-medium">{service.category?.name}</p>
                </div>
                {service.category?.description && (
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <p className="text-sm">{service.category.description}</p>
                  </div>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/services?category=${service.category?.slug}`}>
                    View Similar Services
                  </Link>
                </Button>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about this service? Our team is here to help you.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/faqs">View FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 