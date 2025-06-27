import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "United States",
    rating: 5,
    text: "The gorilla trekking experience was absolutely life-changing! Our guide was knowledgeable and the entire trip was perfectly organized. Samba Tours exceeded all our expectations.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Canada",
    rating: 5,
    text: "From the moment we arrived until departure, everything was seamless. The wildlife viewing at Murchison Falls was incredible, and the accommodations were top-notch.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Emma Thompson",
    location: "United Kingdom",
    rating: 5,
    text: "Uganda is truly the pearl of Africa! The cultural experiences and natural beauty we witnessed were beyond words. Thank you Samba Tours for an unforgettable adventure.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function TestimonialsPreview() {
  return (
    <section className="section-padding bg-forest-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">What Our Travelers Say</h2>
          <p className="text-xl text-earth-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="h-8 w-8 text-forest-200 absolute -top-2 -left-2" />
                  <p className="text-earth-700 italic pl-6">"{testimonial.text}"</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-earth-900">{testimonial.name}</h4>
                    <p className="text-sm text-earth-600">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
