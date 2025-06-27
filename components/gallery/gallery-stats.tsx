import { Camera, Video, Users, Award, MapPin, Calendar } from "lucide-react"

const stats = [
  {
    icon: Camera,
    value: "2,500+",
    label: "Photos Captured",
    description: "High-quality images from real tours",
  },
  {
    icon: Video,
    value: "150+",
    label: "Videos Produced",
    description: "Professional tour documentaries",
  },
  {
    icon: Users,
    value: "500+",
    label: "Featured Travelers",
    description: "Happy customers in our gallery",
  },
  {
    icon: MapPin,
    value: "15+",
    label: "Destinations",
    description: "Locations across Uganda",
  },
  {
    icon: Award,
    value: "50+",
    label: "Photography Awards",
    description: "Recognition for visual excellence",
  },
  {
    icon: Calendar,
    value: "8+",
    label: "Years Documenting",
    description: "Consistent content creation",
  },
]

export default function GalleryStats() {
  return (
    <section className="section-padding bg-forest-50">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-playfair font-bold text-earth-900 mb-4">Our Visual Journey</h2>
          <p className="text-lg text-earth-600 max-w-2xl mx-auto">
            Every photo and video in our gallery represents a real moment from actual tours, captured by our
            professional guides and happy travelers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-6 w-6 text-forest-600" />
              </div>
              <div className="text-2xl font-bold text-forest-600 mb-1">{stat.value}</div>
              <div className="font-semibold text-earth-900 mb-1 text-sm">{stat.label}</div>
              <div className="text-xs text-earth-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
