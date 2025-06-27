import { Shield, Heart, Leaf, Users, Award, Globe } from "lucide-react"

const values = [
  {
    icon: Heart,
    title: "Passion for Excellence",
    description:
      "We pour our hearts into every tour, ensuring each experience exceeds expectations and creates lasting memories.",
  },
  {
    icon: Leaf,
    title: "Sustainable Tourism",
    description:
      "We're committed to responsible travel that protects Uganda's environment and benefits local communities.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We work closely with local communities, ensuring tourism creates positive economic and social impact.",
  },
  {
    icon: Shield,
    title: "Safety & Security",
    description:
      "Your safety is our top priority. We maintain the highest safety standards and comprehensive insurance coverage.",
  },
  {
    icon: Award,
    title: "Authentic Experiences",
    description: "We create genuine, unscripted encounters with Uganda's wildlife, culture, and natural beauty.",
  },
  {
    icon: Globe,
    title: "Cultural Respect",
    description:
      "We honor and celebrate Uganda's diverse cultures, fostering meaningful connections between visitors and locals.",
  },
]

export default function ValuesSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">Our Core Values</h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            These principles guide everything we do, from planning your itinerary to the moment you return home with
            unforgettable memories of Uganda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-lg hover:bg-forest-50 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-forest-200 transition-colors duration-300">
                <value.icon className="h-8 w-8 text-forest-600" />
              </div>
              <h3 className="text-xl font-bold text-earth-900 mb-4">{value.title}</h3>
              <p className="text-earth-700 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
