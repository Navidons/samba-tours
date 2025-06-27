import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, MapPin, Calendar, Info, CheckCircle } from "lucide-react"

interface Tour {
  title: string
  description: string
  duration: string
  groupSize: string
  location: string
  category: string
  difficulty: string
  highlights: string[]
  bestTime: string
  physicalRequirements: string
  whatToBring: string[]
}

interface TourDetailsProps {
  tour: Tour
}

export default function TourDetails({ tour }: TourDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-forest-600" />
            <span>Tour Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-earth-700 leading-relaxed mb-6">{tour.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-forest-600" />
                <div>
                  <p className="font-semibold text-earth-900">Duration</p>
                  <p className="text-earth-700">{tour.duration}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-forest-600" />
                <div>
                  <p className="font-semibold text-earth-900">Group Size</p>
                  <p className="text-earth-700">Maximum {tour.groupSize}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-forest-600" />
                <div>
                  <p className="font-semibold text-earth-900">Location</p>
                  <p className="text-earth-700">{tour.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-forest-600" />
                <div>
                  <p className="font-semibold text-earth-900">Best Time</p>
                  <p className="text-earth-700">{tour.bestTime}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-forest-600" />
            <span>Tour Highlights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tour.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-forest-600 flex-shrink-0" />
                <span className="text-earth-700">{highlight}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Physical Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Physical Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-earth-700 leading-relaxed mb-4">{tour.physicalRequirements}</p>
          <Badge
            className={`${
              tour.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : tour.difficulty === "Moderate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {tour.difficulty} Level
          </Badge>
        </CardContent>
      </Card>

      {/* What to Bring */}
      <Card>
        <CardHeader>
          <CardTitle>What to Bring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tour.whatToBring.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-forest-600 flex-shrink-0" />
                <span className="text-earth-700">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
