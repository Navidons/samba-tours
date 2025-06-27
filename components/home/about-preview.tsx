import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Heart } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "Expert Guides",
    description: "Local guides with deep knowledge of Uganda's culture and wildlife",
  },
  {
    icon: Users,
    title: "Small Groups",
    description: "Intimate group sizes for personalized experiences",
  },
  {
    icon: Globe,
    title: "Sustainable Tourism",
    description: "Committed to responsible travel that benefits local communities",
  },
  {
    icon: Heart,
    title: "Passionate Service",
    description: "Dedicated to creating unforgettable memories for every traveler",
  },
]

export default function AboutPreview() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="heading-secondary">Why Choose Samba Tours?</h2>
            <p className="text-xl text-earth-600 mb-8">
              We are passionate about showcasing the incredible beauty and diversity of Uganda and East Africa. Our team
              of experienced guides and travel experts ensure every journey is safe, memorable, and authentic.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-forest-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-earth-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-earth-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" asChild>
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Uganda wildlife"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Local culture"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Beautiful landscapes"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Adventure activities"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
