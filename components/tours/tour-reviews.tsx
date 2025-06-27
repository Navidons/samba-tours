import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

interface TourReviewsProps {
  tourId: number
  rating: number
  reviewCount: number
}

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "United States",
    rating: 5,
    date: "2024-03-15",
    comment:
      "Absolutely incredible experience! The gorilla trekking was life-changing and our guide James was exceptional. Every detail was perfectly organized.",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Michael Chen",
    country: "Canada",
    rating: 5,
    date: "2024-03-10",
    comment:
      "Outstanding safari experience. The wildlife viewing was spectacular and the accommodations exceeded our expectations. Highly recommend Samba Tours!",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Emma Thompson",
    country: "United Kingdom",
    rating: 4,
    date: "2024-03-05",
    comment:
      "Wonderful cultural experience. Learning about local traditions and meeting community members was the highlight of our trip. Very well organized.",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function TourReviews({ tourId, rating, reviewCount }: TourReviewsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-forest-600" />
            <span>Customer Reviews</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span className="font-bold">{rating}</span>
            </div>
            <span className="text-earth-600">({reviewCount} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={review.image || "/placeholder.svg"} alt={review.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-earth-900">{review.name}</h4>
                      <p className="text-sm text-earth-600">{review.country}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-earth-500">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-earth-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
