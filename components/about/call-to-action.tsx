import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MessageCircle } from "lucide-react"

export default function CallToAction() {
  return (
    <section className="section-padding bg-forest-800 text-white">
      <div className="container-max">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-6">Ready to Start Your Uganda Adventure?</h2>
          <p className="text-xl text-forest-100 mb-8">
            Let our expert team help you plan the perfect Uganda experience. Whether you're dreaming of gorilla
            encounters, thrilling safaris, or cultural immersion, we're here to make it happen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-cream-100 hover:bg-cream-200 text-earth-800 px-8 py-4" asChild>
              <Link href="/tours" className="flex items-center space-x-2">
                <span>Browse Our Tours</span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4"
              asChild
            >
              <Link href="/contact" className="flex items-center space-x-2">
                <span>Plan Custom Tour</span>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-forest-700/50 rounded-lg">
              <Phone className="h-8 w-8 mx-auto mb-3 text-forest-300" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-forest-200">+256 700 123 456</p>
            </div>
            <div className="text-center p-4 bg-forest-700/50 rounded-lg">
              <Mail className="h-8 w-8 mx-auto mb-3 text-forest-300" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-forest-200">info@sambatours.com</p>
            </div>
            <div className="text-center p-4 bg-forest-700/50 rounded-lg">
              <MessageCircle className="h-8 w-8 mx-auto mb-3 text-forest-300" />
              <h3 className="font-semibold mb-2">WhatsApp</h3>
              <p className="text-forest-200">Quick Response</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
