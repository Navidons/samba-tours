import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"

interface Inclusions {
  included: string[]
  excluded: string[]
}

interface TourInclusionsProps {
  inclusions: Inclusions
}

export default function TourInclusions({ inclusions }: TourInclusionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Included */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            <span>What's Included</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inclusions.included.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-earth-700">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Excluded */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <XCircle className="h-5 w-5" />
            <span>What's Not Included</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inclusions.excluded.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <XCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-earth-700">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
