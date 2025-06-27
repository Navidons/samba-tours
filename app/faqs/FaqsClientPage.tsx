"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MessageCircle,
  Plane,
  Shield,
  CreditCard,
  MapPin,
} from "lucide-react"
import { useState } from "react"

const faqCategories = [
  {
    id: "booking",
    name: "Booking & Payments",
    icon: CreditCard,
    color: "bg-blue-100 text-blue-600",
    questions: [
      {
        question: "How do I book a tour with Samba Tours?",
        answer:
          "You can book directly through our website, call us at +256 700 123 456, or email info@sambatours.com. We require a 30% deposit to confirm your booking, with the balance due 30 days before departure.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and mobile money payments. All payments are processed securely through our encrypted payment system.",
      },
      {
        question: "Can I cancel or modify my booking?",
        answer:
          "Yes, cancellations and modifications are possible subject to our terms and conditions. Cancellations made 60+ days before departure receive a full refund minus processing fees. Please contact us for specific details.",
      },
    ],
  },
  {
    id: "travel",
    name: "Travel Requirements",
    icon: Plane,
    color: "bg-green-100 text-green-600",
    questions: [
      {
        question: "Do I need a visa to visit Uganda?",
        answer:
          "Most visitors need a visa to enter Uganda. You can obtain a tourist visa on arrival ($50 USD) or apply online in advance. Some nationalities are exempt. We recommend checking with the Ugandan embassy in your country.",
      },
      {
        question: "What vaccinations are required?",
        answer:
          "Yellow fever vaccination is mandatory and you must present a valid certificate. We also recommend vaccinations for hepatitis A & B, typhoid, and malaria prophylaxis. Consult your doctor 4-6 weeks before travel.",
      },
      {
        question: "What should I pack for my Uganda safari?",
        answer:
          "Pack lightweight, neutral-colored clothing, comfortable walking shoes, rain jacket, hat, sunscreen, insect repellent, and binoculars. We provide a detailed packing list upon booking confirmation.",
      },
    ],
  },
  {
    id: "safety",
    name: "Safety & Security",
    icon: Shield,
    color: "bg-red-100 text-red-600",
    questions: [
      {
        question: "Is Uganda safe for tourists?",
        answer:
          "Yes, Uganda is generally safe for tourists. We work with experienced local guides, use reliable transportation, and maintain 24/7 emergency support. We continuously monitor conditions and adjust itineraries as needed for your safety.",
      },
      {
        question: "What safety measures do you have in place?",
        answer:
          "All our guides are trained in first aid, we use well-maintained 4WD vehicles, provide emergency communication devices, and have partnerships with local medical facilities. We also carry comprehensive insurance coverage.",
      },
    ],
  },
  {
    id: "tours",
    name: "Tours & Activities",
    icon: MapPin,
    color: "bg-purple-100 text-purple-600",
    questions: [
      {
        question: "What's included in the tour price?",
        answer:
          "Our tours typically include accommodation, meals as specified, transportation, park fees, professional guide services, and activities mentioned in the itinerary. International flights, visas, tips, and personal expenses are usually excluded.",
      },
      {
        question: "Can you customize tours for our group?",
        answer:
          "Absolutely! We specialize in creating custom itineraries based on your interests, budget, and time constraints. Contact us with your requirements and we'll design a personalized experience for you.",
      },
      {
        question: "What's the best time to visit Uganda?",
        answer:
          "Uganda can be visited year-round, but the dry seasons (December-February and June-September) are ideal for wildlife viewing and gorilla trekking. The wet seasons offer lush landscapes and fewer crowds.",
      },
    ],
  },
]

export default function FaqsClientPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-forest-900 to-forest-700 text-white py-24">
        <div className="container-max px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl text-forest-100 mb-8 leading-relaxed">
              Find answers to common questions about Uganda tours, booking process, and travel requirements.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Find answers organized by topic for quick and easy reference.
            </p>
          </div>

          <div className="space-y-12">
            {faqCategories.map((category) => (
              <div key={category.id} className="max-w-4xl mx-auto">
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-playfair text-3xl font-bold text-earth-900">{category.name}</h3>
                </div>

                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const itemId = `${category.id}-${index}`
                    const isExpanded = expandedItems.includes(itemId)

                    return (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleExpanded(itemId)}
                            className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="font-semibold text-lg text-earth-900 pr-4">{faq.question}</h4>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-earth-600 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-earth-600 flex-shrink-0" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="px-6 pb-6">
                              <p className="text-earth-700 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Still Have Questions?</h2>
            <p className="text-xl text-earth-600 mb-12">
              Our friendly team is here to help you plan your perfect Uganda adventure.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-forest-600" />
                  </div>
                  <h3 className="font-bold text-xl text-earth-900 mb-2">Call Us</h3>
                  <p className="text-earth-600 mb-4">Speak directly with our travel experts</p>
                  <Button className="bg-forest-600 hover:bg-forest-700">+256 700 123 456</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-forest-600" />
                  </div>
                  <h3 className="font-bold text-xl text-earth-900 mb-2">Email Us</h3>
                  <p className="text-earth-600 mb-4">Get detailed answers to your questions</p>
                  <Button className="bg-forest-600 hover:bg-forest-700">Send Email</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-forest-600" />
                  </div>
                  <h3 className="font-bold text-xl text-earth-900 mb-2">Live Chat</h3>
                  <p className="text-earth-600 mb-4">Chat with us in real-time</p>
                  <Button className="bg-forest-600 hover:bg-forest-700">Start Chat</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
