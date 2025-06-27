import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Bookings",
    value: "23",
    change: "+3",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Total Customers",
    value: "1,234",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "+0.5%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
]

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-earth-600">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-earth-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-earth-900">{stat.value}</div>
            <p className={`text-xs ${stat.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default AdminStats
