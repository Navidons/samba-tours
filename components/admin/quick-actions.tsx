import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, MessageSquare, Users, BarChart3, ImageIcon } from "lucide-react"

const quickActions = [
  {
    title: "Add New Tour",
    description: "Create a new tour package",
    icon: Plus,
    href: "/admin/tours/new",
    color: "bg-forest-600 hover:bg-forest-700",
  },
  {
    title: "Manage Tours",
    description: "Edit existing tour packages",
    icon: Edit,
    href: "/admin/tours",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Gallery Management",
    description: "Upload and organize images",
    icon: ImageIcon,
    href: "/admin/gallery",
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    title: "Blog Posts",
    description: "Create and manage blog content",
    icon: MessageSquare,
    href: "/admin/blog",
    color: "bg-orange-600 hover:bg-orange-700",
  },
  {
    title: "Customer Management",
    description: "View and manage customers",
    icon: Users,
    href: "/admin/customers",
    color: "bg-teal-600 hover:bg-teal-700",
  },
  {
    title: "Analytics",
    description: "View detailed reports",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "bg-indigo-600 hover:bg-indigo-700",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {quickActions.map((action, index) => (
            <Button key={index} asChild variant="ghost" className="h-auto p-4 justify-start text-left">
              <Link href={action.href}>
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-earth-900">{action.title}</h4>
                  <p className="text-sm text-earth-600">{action.description}</p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickActions
