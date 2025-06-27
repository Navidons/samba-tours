import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import ContactHero from "@/components/contact/contact-hero"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Youtube, Linkedin, TwitterIcon as TikTok } from "lucide-react"

const socialPlatforms = [
  {
    name: "Facebook",
    icon: Facebook,
    handle: "@SambaToursUganda",
    followers: "15.2K",
    description: "Daily updates, customer photos, and travel tips",
    href: "https://facebook.com/sambatours",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "Instagram",
    icon: Instagram,
    handle: "@sambatours_uganda",
    followers: "28.5K",
    description: "Stunning photos and stories from our tours",
    href: "https://instagram.com/sambatours",
    color: "bg-pink-600 hover:bg-pink-700",
  },
  {
    name: "Twitter",
    icon: Twitter,
    handle: "@SambaToursUG",
    followers: "8.3K",
    description: "Real-time updates and travel news",
    href: "https://twitter.com/sambatours",
    color: "bg-sky-500 hover:bg-sky-600",
  },
  {
    name: "YouTube",
    icon: Youtube,
    handle: "Samba Tours Uganda",
    followers: "12.1K",
    description: "Virtual tours and travel documentaries",
    href: "https://youtube.com/sambatours",
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    handle: "Samba Tours & Travel",
    followers: "3.2K",
    description: "Professional updates and industry insights",
    href: "https://linkedin.com/company/sambatours",
    color: "bg-blue-700 hover:bg-blue-800",
  },
  {
    name: "TikTok",
    icon: TikTok,
    handle: "@sambatours_ug",
    followers: "45.7K",
    description: "Fun travel moments and behind-the-scenes",
    href: "https://tiktok.com/@sambatours",
    color: "bg-black hover:bg-gray-800",
  },
]

export const metadata = {
  title: "Contact Samba Tours & Travel - Plan Your Uganda Adventure",
  description:
    "Get in touch with Samba Tours & Travel to plan your perfect Uganda adventure. Contact our expert travel consultants for personalized tour recommendations and bookings.",
  keywords:
    "contact Uganda tours, travel consultation, safari booking, gorilla trekking inquiry, Uganda travel agent contact",
  openGraph: {
    title: "Contact Samba Tours & Travel - Plan Your Uganda Adventure",
    description: "Get in touch with our expert travel consultants to plan your perfect Uganda adventure.",
    images: ["/images/contact-hero.jpg"],
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-cream-50">
        <ContactHero />

        <section className="section-padding">
          <div className="container-max">
            <div className="text-center mb-12">
              <h2 className="heading-secondary">How Can We Help?</h2>
              <p className="text-xl text-earth-600 max-w-3xl mx-auto">
                Reach out to us through the form below or find our contact details.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="p-8 bg-white rounded-lg shadow-md flex flex-col gap-6 items-start">
                <Suspense fallback={<LoadingSpinner />}>
                  <ContactForm />
                </Suspense>
              </div>
              <div className="p-8 bg-white rounded-lg shadow-md flex flex-col gap-8 justify-center">
                <ContactInfo />
                <Separator className="my-4" />
              </div>
            </div>
            {/* Social Media Call-to-Action Card */}
            <div className="w-full mt-8">
              <div className="bg-gradient-to-r from-forest-50 to-earth-50 p-8 rounded-2xl shadow-md w-full max-w-none">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-playfair font-bold text-earth-900 mb-2">
                    Connect With Us on Social Media
                  </h2>
                  <p className="text-lg text-earth-600 max-w-2xl mx-auto">
                    Follow our adventures, get travel inspiration, and stay updated with the latest from Uganda
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {socialPlatforms.map((platform, index) => (
                    <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                          >
                            <platform.icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-earth-900">{platform.name}</h3>
                            <p className="text-sm text-earth-600">{platform.handle}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="text-2xl font-bold text-earth-900 mb-1">{platform.followers}</div>
                          <p className="text-sm text-earth-600">{platform.description}</p>
                        </div>
                        <Button asChild className={`w-full ${platform.color} text-white border-0`}>
                          <a href={platform.href} target="_blank" rel="noopener noreferrer">
                            Follow Us
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
