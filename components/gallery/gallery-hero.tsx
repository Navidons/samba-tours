import Image from "next/image"
import { Camera, Video, Users, MapPin } from "lucide-react"

const stats = [
  { icon: Camera, value: "2,500+", label: "Photos" },
  { icon: Video, value: "150+", label: "Videos" },
  { icon: Users, value: "500+", label: "Happy Travelers" },
  { icon: MapPin, value: "15+", label: "Destinations" },
]

export default function GalleryHero() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/murchison-falls-spectacular.jpg"
          alt="Breathtaking multi-tiered waterfalls of Murchison Falls - perfect photography destination in Uganda"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-primary text-white mb-6 animate-fade-in">Captured Moments, Lasting Memories</h1>
          <p className="text-xl lg:text-2xl mb-12 text-gray-200 animate-slide-up">
            Immerse yourself in the beauty of Uganda through the lens of our cameras and the eyes of our travelers.
            Every photo and video represents a real adventure, from the spectacular Murchison Falls to hidden gems.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 bg-forest-600/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <stat.icon className="h-8 w-8 text-forest-300" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-gray-300 text-sm lg:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
