import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Users, TrendingUp, MapPin, Camera, FileText, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"
import { AdminStats } from "@/components/admin/admin-stats"
import { QuickActions } from "@/components/admin/quick-actions"
import { RecentBookings } from "@/components/admin/recent-bookings"

export const metadata = {
  title: "Admin Dashboard - Samba Tours",
  description: "Comprehensive admin dashboard for managing tours, bookings, and customers.",
}

const navigationItems = [
  { name: "Tours", href: "/admin/tours", icon: MapPin, description: "Manage tour packages" },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar, description: "View and manage bookings" },
  { name: "Customers", href: "/admin/customers", icon: Users, description: "Customer management" },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3, description: "View detailed analytics" },
  { name: "Gallery", href: "/admin/gallery", icon: Camera, description: "Manage photo galleries" },
  { name: "Blog", href: "/admin/blog", icon: FileText, description: "Manage blog content" },
  { name: "Settings", href: "/admin/settings", icon: Settings, description: "System settings" },
  { name: "Reports", href: "/admin/reports", icon: TrendingUp, description: "Generate reports" },
]

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-earth-900 mb-2">Admin Dashboard</h1>
            <p className="text-earth-600">Welcome back! Here's what's happening with your tours.</p>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <item.icon className="h-8 w-8 mx-auto mb-2 text-forest-600" />
                    <h3 className="font-semibold text-sm text-earth-900">{item.name}</h3>
                    <p className="text-xs text-earth-600 mt-1">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <AdminStats />

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <QuickActions />
            <RecentBookings />
          </div>
        </div>
      </div>
    </main>
  )
}
