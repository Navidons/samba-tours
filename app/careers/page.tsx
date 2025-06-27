import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Award, Heart, Globe, Briefcase, GraduationCap } from "lucide-react"

export const metadata: Metadata = {
  title: "Careers - Join Samba Tours & Travel Team",
  description:
    "Join our passionate team and help create unforgettable travel experiences. Explore career opportunities in Uganda's leading tour company.",
  keywords: "careers samba tours, jobs uganda tourism, travel industry jobs, tour guide jobs kampala",
}

export default function CareersPage() {
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Tour Guide",
      department: "Operations",
      location: "Kampala, Uganda",
      type: "Full-time",
      experience: "3+ years",
      description:
        "Lead unforgettable safari and cultural tours across Uganda. Share your passion for wildlife and local culture with international visitors.",
      requirements: [
        "Fluent in English and local languages",
        "Wildlife knowledge",
        "First Aid certification",
        "Valid driving license",
      ],
    },
    {
      id: 2,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Kampala, Uganda",
      type: "Full-time",
      experience: "5+ years",
      description:
        "Drive our digital marketing strategy and brand growth. Create compelling campaigns that showcase Uganda's natural beauty.",
      requirements: [
        "Digital marketing expertise",
        "Content creation skills",
        "Analytics proficiency",
        "Travel industry experience",
      ],
    },
    {
      id: 3,
      title: "Customer Experience Specialist",
      department: "Customer Service",
      location: "Remote/Kampala",
      type: "Full-time",
      experience: "2+ years",
      description:
        "Ensure exceptional customer experiences from booking to post-trip follow-up. Be the friendly face of Samba Tours.",
      requirements: [
        "Excellent communication skills",
        "Problem-solving abilities",
        "CRM experience",
        "Multilingual preferred",
      ],
    },
  ]

  const benefits = [
    { icon: Globe, title: "Travel Opportunities", description: "Experience Uganda's destinations firsthand" },
    { icon: Heart, title: "Health Insurance", description: "Comprehensive medical coverage" },
    { icon: GraduationCap, title: "Professional Development", description: "Training and certification programs" },
    { icon: Users, title: "Team Building", description: "Regular team retreats and activities" },
  ]

  return (
    <main className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-forest-900 to-forest-700 text-white py-24">
        <div className="container-max px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">Join Our Adventure Team</h1>
            <p className="text-xl md:text-2xl text-forest-100 mb-8 leading-relaxed">
              Help us create unforgettable experiences while building your career in Uganda's thriving tourism industry.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-forest-100">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>50+ Team Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-6 w-6" />
                <span>Award-Winning Company</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6" />
                <span>International Recognition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Current Openings</h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              Discover exciting career opportunities and join our mission to showcase Uganda's natural wonders.
            </p>
          </div>

          <div className="grid gap-8 max-w-4xl mx-auto">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl text-earth-900">{job.title}</CardTitle>
                      <div className="flex flex-wrap gap-4 mt-2 text-earth-600">
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-forest-600 text-white w-fit">{job.experience}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-earth-700 mb-4">{job.description}</p>
                  <div className="mb-6">
                    <h4 className="font-semibold text-earth-900 mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1 text-earth-700">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <Button className="bg-forest-600 hover:bg-forest-700">Apply Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-earth-900 mb-4">Why Work With Us</h2>
            <p className="text-xl text-earth-600 max-w-3xl mx-auto">
              We believe in taking care of our team so they can take care of our guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-forest-600" />
                  </div>
                  <h3 className="font-bold text-xl text-earth-900 mb-2">{benefit.title}</h3>
                  <p className="text-earth-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
