"use client"

import { Phone, Mail, MessageCircle, Video, Headphones, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our travel experts",
    action: "Call Now",
    href: "tel:+256700123456",
    availability: "24/7 Available",
    color: "bg-blue-500",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Quick responses via WhatsApp",
    action: "Chat on WhatsApp",
    href: "https://wa.me/256700123456",
    availability: "Instant Response",
    color: "bg-green-500",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Detailed inquiries and documentation",
    action: "Send Email",
    href: "mailto:info@sambatours.com",
    availability: "Within 2 hours",
    color: "bg-purple-500",
  },
  {
    icon: Video,
    title: "Video Call",
    description: "Face-to-face consultation",
    action: "Book Video Call",
    href: "#video-booking",
    availability: "Schedule Available",
    color: "bg-red-500",
  },
  {
    icon: Headphones,
    title: "Live Chat",
    description: "Instant support on our website",
    action: "Start Chat",
    href: "#live-chat",
    availability: "Online Now",
    color: "bg-orange-500",
  },
  {
    icon: FileText,
    title: "Support Ticket",
    description: "Complex issues and follow-ups",
    action: "Create Ticket",
    href: "#support-ticket",
    availability: "Tracked Support",
    color: "bg-indigo-500",
  },
]

export default function ContactMethods() {
  const handleMethodClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href)
      element?.scrollIntoView({ behavior: "smooth" })
    } else {
      window.open(href, "_blank")
    }
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-earth-900 mb-4">
          Choose Your Preferred Contact Method
        </h2>
        <p className="text-lg text-earth-600 max-w-2xl mx-auto">
          We offer multiple ways to connect with us. Pick the method that works best for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactMethods.map((method, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div
                className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <method.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-earth-900 mb-2">{method.title}</h3>
              <p className="text-earth-600 mb-4">{method.description}</p>
              <div className="text-sm text-forest-600 font-medium mb-4">{method.availability}</div>
              <Button onClick={() => handleMethodClick(method.href)} className="w-full btn-primary">
                {method.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
