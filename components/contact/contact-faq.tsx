"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    question: "How far in advance should I book my Uganda tour?",
    answer:
      "We recommend booking at least 2-3 months in advance, especially for gorilla trekking permits which are limited. However, we can accommodate last-minute bookings based on availability.",
  },
  {
    question: "What is included in your tour packages?",
    answer:
      "Our packages typically include accommodation, meals as specified, transportation, park fees, professional guide services, and activities mentioned in the itinerary. International flights and personal expenses are usually excluded.",
  },
  {
    question: "Do you provide travel insurance?",
    answer:
      "We strongly recommend travel insurance but don't provide it directly. We can recommend trusted insurance providers that cover adventure activities and medical evacuation.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, credit cards (Visa, MasterCard), PayPal, and mobile money. A deposit is required to confirm your booking, with the balance due before travel.",
  },
  {
    question: "Can you customize tours for special dietary requirements?",
    answer:
      "We cater to vegetarian, vegan, gluten-free, and other dietary requirements. Please inform us during booking so we can make appropriate arrangements.",
  },
  {
    question: "What happens if I need to cancel my tour?",
    answer:
      "Cancellation policies vary by tour and timing. Generally, cancellations more than 30 days before departure incur minimal fees, while last-minute cancellations may result in higher charges. Full details are provided with your booking.",
  },
  {
    question: "Do you provide airport transfers?",
    answer:
      "Yes, airport transfers are included in most of our packages. We'll meet you at Entebbe International Airport and ensure smooth transportation to your accommodation.",
  },
  {
    question: "What should I pack for a Uganda safari?",
    answer:
      "Essential items include comfortable safari clothing in neutral colors, sturdy walking boots, rain jacket, sun protection, insect repellent, and camera equipment. We provide a detailed packing list upon booking.",
  },
]

export default function ContactFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <section className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-earth-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-earth-600 max-w-2xl mx-auto">
          Quick answers to common questions about our tours and services
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="border border-earth-200">
              <CardHeader
                className="cursor-pointer hover:bg-cream-50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-forest-600" />
                    {faq.question}
                  </span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-earth-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-earth-600" />
                  )}
                </CardTitle>
              </CardHeader>
              {openItems.includes(index) && (
                <CardContent className="pt-0">
                  <p className="text-earth-600 leading-relaxed pl-8">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-earth-600 mb-4">Can't find what you're looking for?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact-form"
              className="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-lg"
            >
              Ask a Question
            </a>
            <a
              href="tel:+256700123456"
              className="btn-outline inline-flex items-center justify-center px-6 py-3 rounded-lg"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
