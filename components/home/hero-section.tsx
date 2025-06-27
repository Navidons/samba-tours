import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Play, Star, Users, MapPin } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/murchison-falls-spectacular.jpg"
          alt="Spectacular multi-tiered Murchison Falls cascading down layered rock formations in Uganda"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-primary text-white mb-6 animate-fade-in">Discover the Pearl of Africa</h1>
          <p className="text-xl lg:text-2xl mb-8 text-gray-200 animate-slide-up">
            Experience Uganda's breathtaking landscapes, incredible wildlife, and rich culture with our expertly crafted
            tours and adventures. From the magnificent multi-tiered Murchison Falls to pristine wilderness.
          </p>

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

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
