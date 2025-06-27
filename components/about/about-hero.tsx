import Image from "next/image"
import { Award, Users, Globe, Heart } from "lucide-react"

const stats = [
  { icon: Users, value: "500+", label: "Happy Travelers" },
  { icon: Globe, value: "15+", label: "Destinations" },
  { icon: Award, value: "8+", label: "Years Experience" },
  { icon: Heart, value: "98%", label: "Satisfaction Rate" },
]

export default function AboutHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/murchison-falls-spectacular.jpg"
          alt="Majestic Murchison Falls showcasing the natural wonders we help preserve and share with visitors"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-max px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="heading-primary text-white mb-6 animate-fade-in">Passionate About Uganda's Beauty</h1>
          <p className="text-xl lg:text-2xl mb-12 text-gray-200 animate-slide-up max-w-3xl mx-auto">
            For over 8 years, we've been crafting extraordinary adventures that showcase the incredible diversity and
            natural beauty of Uganda and East Africa. From the spectacular cascading tiers of Murchison Falls to
            intimate wildlife encounters, our mission is to create life-changing experiences while supporting local
            communities.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 bg-forest-600/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <stat.icon className="h-8 w-8 text-forest-300" />
                  </div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                <p className="text-gray-300 text-sm lg:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
