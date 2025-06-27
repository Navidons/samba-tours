import Image from "next/image"
import { MessageCircle, Video, Clock, Globe } from "lucide-react"

export default function ContactHero() {
  return (
    <section className="relative bg-gradient-to-br from-forest-900 via-forest-800 to-earth-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0">
        <Image
          src="/images/murchison-falls-spectacular.jpg"
          alt="Serene multi-tiered Murchison Falls representing our commitment to exceptional customer service"
          fill
          className="object-cover opacity-40"
        />
      </div>

      <div className="relative section-padding">
        <div className="container-max text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">We're Here to Help</h1>
            <p className="text-xl md:text-2xl text-forest-100 mb-8 leading-relaxed">
              Connect with our travel experts through your preferred channel. From instant chat to video consultations,
              we're available 24/7 to make your Uganda adventure perfect. Let us guide you to experiences as magnificent
              as the spectacular Murchison Falls.
            </p>

            {/* Quick Contact Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-forest-200">Support Available</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">{"<"}2min</div>
                <div className="text-sm text-forest-200">Response Time</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-forest-200">Languages</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Video className="h-8 w-8" />
                </div>
                <div className="text-2xl font-bold">Free</div>
                <div className="text-sm text-forest-200">Video Consultation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
