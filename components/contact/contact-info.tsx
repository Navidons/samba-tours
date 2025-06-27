import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const phoneNumbers = [
      { label: "Main Office", value: "+256 700 123 456", href: "tel:+256700123456" },
      { label: "WhatsApp", value: "+256 700 123 456", href: "https://wa.me/256700123456" },
]

const emailAddresses = [
      { label: "General Inquiries", value: "info@sambatours.com", href: "mailto:info@sambatours.com" },
      { label: "Bookings", value: "bookings@sambatours.com", href: "mailto:bookings@sambatours.com" },
      { label: "Support", value: "support@sambatours.com", href: "mailto:support@sambatours.com" },
]

const officeLocations = [
      { label: "Kampala HQ", value: "Plot 123, Kampala Road, Kampala", href: "https://maps.google.com" },
      { label: "Entebbe Office", value: "Airport Road, Entebbe", href: "https://maps.google.com" },
]

export default function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-forest-600" />
          Get in Touch
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Quick Actions */}
        <div className="flex flex-col gap-3 bg-forest-50 p-4 rounded-lg border border-forest-100">
          <h4 className="font-semibold text-earth-900 mb-2 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-forest-600" /> Quick Actions
          </h4>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button asChild variant="outline" className="flex-1 justify-center">
              <a href="https://wa.me/256700123456">
                <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1 justify-center">
              <a href="tel:+256700123456">
                <Phone className="h-4 w-4 mr-2" /> Call
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1 justify-center">
              <a href="mailto:info@sambatours.com">
                <Mail className="h-4 w-4 mr-2" /> Email
              </a>
            </Button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Numbers */}
          <div className="bg-white rounded-lg border border-earth-100 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-earth-900 mb-3">
              <Phone className="h-4 w-4 text-forest-600" /> Phone Numbers
            </h4>
            <div className="space-y-2">
              {phoneNumbers.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-sm text-earth-600">{item.label}</span>
                  <a
                    href={item.href}
                    className="text-forest-600 hover:text-forest-700 font-medium hover:underline"
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {item.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* Email Addresses */}
          <div className="bg-white rounded-lg border border-earth-100 p-4">
            <h4 className="flex items-center gap-2 font-semibold text-earth-900 mb-3">
              <Mail className="h-4 w-4 text-forest-600" /> Email Addresses
            </h4>
            <div className="space-y-2">
              {emailAddresses.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-sm text-earth-600">{item.label}</span>
                  <a
                    href={item.href}
                    className="text-forest-600 hover:text-forest-700 font-medium hover:underline"
                  >
                    {item.value}
                  </a>
          </div>
        ))}
            </div>
          </div>
          {/* Office Locations */}
          <div className="bg-white rounded-lg border border-earth-100 p-4 md:col-span-2">
            <h4 className="flex items-center gap-2 font-semibold text-earth-900 mb-3">
              <MapPin className="h-4 w-4 text-forest-600" /> Office Locations
            </h4>
          <div className="space-y-2">
              {officeLocations.map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-sm text-earth-600">{item.label}</span>
                  <a
                    href={item.href}
                    className="text-forest-600 hover:text-forest-700 font-medium hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.value}
              </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-forest-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-forest-600" />
            <span className="font-semibold text-forest-900">Current Status</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-forest-700">Online - We're available now!</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
