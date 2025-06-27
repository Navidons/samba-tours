import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, ExternalLink, Award, Users, Globe } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Press & Media - Samba Tours & Travel",
  description: "Latest news, press releases, and media resources from Uganda's premier tour operator.",
  keywords: "samba tours press, uganda tourism news, travel industry press releases, media kit",
}

export default function PressPage() {
  const pressReleases = [
    {
      id: 1,
      title: "Samba Tours Wins 'Best Safari Operator' Award 2024",
      date: "2024-03-15",
      excerpt:
        "Recognized for outstanding service and sustainable tourism practices in Uganda's wildlife conservation efforts.",
      category: "Awards",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      title: "New Gorilla Trekking Experience Launched",
      date: "2024-02-28",
      excerpt:
        "Introducing exclusive small-group gorilla encounters with enhanced safety protocols and conservation focus.",
      category: "Product Launch",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 3,
      title: "Partnership with Uganda Wildlife Authority",
      date: "2024-02-10",
      excerpt:
        "Strategic collaboration to promote sustainable tourism and wildlife conservation across Uganda's national parks.",
      category: "Partnership",
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  const awards = [
    { year: "2024", title: "Best Safari Operator", organization: "Uganda Tourism Awards" },
    { year: "2023", title: "Sustainable Tourism Leader", organization: "East Africa Travel Awards" },
    { year: "2023", title: "Excellence in Customer Service", organization: "TripAdvisor Travelers' Choice" },
    { year: "2022", title: "Best Cultural Tour Operator", organization: "Uganda Tourism Board" },
  ]

  const mediaKit = [
    { name: "Company Logo Pack", type: "ZIP", size: "2.5 MB", description: "High-resolution logos in various formats" },
    { name: "Press Photos", type: "ZIP", size: "15.2 MB", description: "Professional photos of tours and wildlife" },
    { name: "Company Fact Sheet", type: "PDF", size: "1.1 MB", description: "Key statistics and company information" },
    { name: "Executive Bios", type: "PDF", size: "800 KB", description: "Leadership team biographies and photos" },
  ]

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-earth-900 to-earth-700 text-white py-24">
        <div className="container-max px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">Press & Media Center</h1>
            <p className="text-xl md:text-2xl text-earth-100 mb-8 leading-relaxed">
              Latest news, press releases, and media resources from Uganda's premier tour operator.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-earth-100">
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6" />
                <span>Award-Winning Service</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>10,000+ Happy Travelers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6" />
                <span>50+ Countries Served</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Latest Press Releases</h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Stay updated with our latest news, achievements, and industry developments.
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {pressReleases.map((release) => (
              <Card key={release.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <Image
                      src={release.image || "/placeholder.svg"}
                      alt={release.title}
                      width={500}
                      height={300}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-forest-600 text-white">{release.category}</Badge>
                        <div className="flex items-center text-earth-600 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(release.date).toLocaleDateString()}
                        </div>
                      </div>
                      <CardTitle className="text-2xl text-earth-900">{release.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-earth-700 mb-4">{release.excerpt}</p>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <span>Read Full Release</span>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {awards.map((award, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-xl text-earth-900 mb-2">{award.title}</h3>
                  <p className="text-earth-600 mb-2">{award.organization}</p>
                  <Badge variant="secondary">{award.year}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Media Kit</h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Download high-quality assets and company information for your stories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {mediaKit.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-earth-900 mb-2">{item.name}</h3>
                      <p className="text-earth-600 mb-4">{item.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-earth-500">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-forest-600 hover:bg-forest-700 flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="section-padding bg-forest-50">
        <div className="container-max">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Press Inquiries</h2>
            <p className="text-xl text-earth-600 mb-8">
              For media inquiries, interviews, or additional information, please contact our press team.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="font-bold text-xl text-earth-900 mb-4">Media Contact</h3>
              <div className="space-y-2 text-earth-700">
                <p>
                  <strong>Sarah Namukasa</strong>
                </p>
                <p>Head of Communications</p>
                <p>Email: press@sambatours.com</p>
                <p>Phone: +256 700 123 456</p>
                <p>Available: Monday - Friday, 9 AM - 6 PM EAT</p>
              </div>
              <Button className="mt-6 bg-forest-600 hover:bg-forest-700">Contact Press Team</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
