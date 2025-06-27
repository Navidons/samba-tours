import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star, Users, Globe, Award, Heart } from "lucide-react"

const achievements = [
  {
    icon: Trophy,
    title: "Uganda Tourism Excellence Award",
    year: "2023",
    description: "Recognized for outstanding contribution to Uganda's tourism industry",
    category: "Industry Recognition",
  },
  {
    icon: Star,
    title: "TripAdvisor Certificate of Excellence",
    year: "2022-2024",
    description: "Consistently rated 5 stars by travelers for exceptional service",
    category: "Customer Satisfaction",
  },
  {
    icon: Users,
    title: "500+ Successful Tours",
    year: "2024",
    description: "Milestone achievement in creating unforgettable experiences",
    category: "Service Delivery",
  },
  {
    icon: Globe,
    title: "Sustainable Tourism Certification",
    year: "2023",
    description: "Certified for responsible tourism practices and community impact",
    category: "Sustainability",
  },
  {
    icon: Award,
    title: "Best Safari Operator - East Africa",
    year: "2023",
    description: "Regional recognition for excellence in safari operations",
    category: "Regional Excellence",
  },
  {
    icon: Heart,
    title: "Community Impact Award",
    year: "2022",
    description: "Honored for significant contributions to local community development",
    category: "Social Impact",
  },
]

const statistics = [
  { number: "98%", label: "Customer Satisfaction Rate", description: "Based on post-tour surveys" },
  { number: "500+", label: "Tours Completed", description: "Successful adventures delivered" },
  { number: "25+", label: "Team Members", description: "Local experts and guides" },
  { number: "15+", label: "Destinations", description: "Across Uganda and East Africa" },
  { number: "8+", label: "Years Experience", description: "In Uganda tourism industry" },
  { number: "12", label: "Awards Won", description: "Industry and customer recognition" },
]

export default function AchievementsSection() {
  return (
    <section className="section-padding bg-cream-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">Our Achievements</h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            We're proud of the recognition we've received from industry bodies and, most importantly, from the travelers
            who trust us with their Uganda adventures.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl lg:text-4xl font-bold text-forest-600 mb-2">{stat.number}</div>
              <div className="font-semibold text-earth-900 mb-1">{stat.label}</div>
              <div className="text-xs text-earth-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Awards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <achievement.icon className="h-6 w-6 text-forest-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-forest-600 bg-forest-100 px-2 py-1 rounded">
                        {achievement.category}
                      </span>
                      <span className="text-sm text-earth-500">{achievement.year}</span>
                    </div>
                    <h3 className="font-bold text-earth-900 mb-2">{achievement.title}</h3>
                    <p className="text-sm text-earth-700">{achievement.description}</p>
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
