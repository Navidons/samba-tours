import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal } from "lucide-react"

const recentBookings = [
  {
    id: "BK001",
    customerName: "Sarah Johnson",
    tourName: "Gorilla Trekking Adventure",
    date: "2024-07-15",
    status: "confirmed",
    amount: "$1,200",
  },
  {
    id: "BK002",
    customerName: "Michael Chen",
    tourName: "Murchison Falls Safari",
    date: "2024-07-18",
    status: "pending",
    amount: "$800",
  },
  {
    id: "BK003",
    customerName: "Emma Thompson",
    tourName: "Queen Elizabeth Wildlife Tour",
    date: "2024-07-20",
    status: "confirmed",
    amount: "$950",
  },
  {
    id: "BK004",
    customerName: "David Wilson",
    tourName: "Cultural Heritage Experience",
    date: "2024-07-22",
    status: "cancelled",
    amount: "$650",
  },
  {
    id: "BK005",
    customerName: "Lisa Anderson",
    tourName: "Mount Elgon Adventure",
    date: "2024-07-25",
    status: "confirmed",
    amount: "$1,100",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function RecentBookings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-earth-900">{booking.customerName}</h4>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
                <p className="text-sm text-earth-600 mb-1">{booking.tourName}</p>
                <p className="text-xs text-earth-500">
                  Booking ID: {booking.id} • Date: {booking.date}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-semibold text-forest-600">{booking.amount}</span>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline">View All Bookings</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentBookings
