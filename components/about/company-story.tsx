import Image from "next/image"
import { Calendar, MapPin, Users, Award } from "lucide-react"

const milestones = [
  {
    year: "2016",
    title: "Founded in Kampala",
    description: "Started with a vision to showcase Uganda's natural beauty to the world",
    icon: MapPin,
  },
  {
    year: "2018",
    title: "First International Recognition",
    description: "Received Uganda Tourism Board's Excellence Award for outstanding service",
    icon: Award,
  },
  {
    year: "2020",
    title: "Expanded Operations",
    description: "Extended our services to cover all major national parks in East Africa",
    icon: Users,
  },
  {
    year: "2024",
    title: "500+ Adventures Completed",
    description: "Celebrated our milestone of creating unforgettable memories for over 500 travelers",
    icon: Calendar,
  },
]

export default function CompanyStory() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="heading-secondary">Our Story</h2>
            <div className="space-y-6 text-body">
              <p className="text-lg leading-relaxed">
                Samba Tours & Travel was born from a deep love for Uganda's extraordinary landscapes and rich cultural
                heritage. Founded in 2016 by a group of passionate local guides and travel enthusiasts, we set out with
                a simple mission: to share the magic of the "Pearl of Africa" with travelers from around the world.
              </p>
              <p>
                What started as a small operation in Kampala has grown into one of Uganda's most trusted tour operators.
                We've built our reputation on delivering authentic, sustainable, and unforgettable experiences that go
                beyond typical tourism. Every journey we craft tells a story – of incredible wildlife encounters,
                breathtaking landscapes, vibrant cultures, and the warm hospitality that Uganda is famous for.
              </p>
              <p>
                Today, we're proud to be a locally-owned company that employs over 25 people, supports numerous local
                communities, and continues to set the standard for responsible tourism in East Africa. Our commitment to
                excellence has earned us recognition from international travel organizations and, more importantly, the
                trust of hundreds of satisfied travelers.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Samba Tours founders"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Team planning expedition"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-32 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Community engagement"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt="Award ceremony"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-3xl font-playfair font-bold text-center text-earth-900 mb-16">Our Journey</h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-forest-200 hidden lg:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} flex-col lg:gap-16`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"} text-center lg:text-left`}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-forest-100">
                      <div className="flex items-center justify-center lg:justify-start mb-4">
                        <div className="w-12 h-12 bg-forest-600 rounded-full flex items-center justify-center mr-3">
                          <milestone.icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-forest-600">{milestone.year}</span>
                      </div>
                      <h4 className="text-xl font-bold text-earth-900 mb-2">{milestone.title}</h4>
                      <p className="text-earth-700">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:block w-4 h-4 bg-forest-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
