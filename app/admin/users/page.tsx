import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Edit, Trash2, Shield, UserCheck, UserX, Mail, Phone } from "lucide-react"
import Link from "next/link"
import LoadingSpinner from "@/components/ui/loading-spinner"

export const metadata = {
  title: "User Management - Samba Tours Admin",
  description: "Manage admin users and permissions.",
}

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@sambatours.com",
    phone: "+256 123 456 789",
    role: "Super Admin",
    status: "active",
    lastLogin: "2024-06-21",
    permissions: ["all"],
    avatar: "/placeholder-user.jpg",
    joinDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@sambatours.com",
    phone: "+256 123 456 790",
    role: "Tour Manager",
    status: "active",
    lastLogin: "2024-06-20",
    permissions: ["tours", "bookings", "customers"],
    avatar: "/placeholder-user.jpg",
    joinDate: "2023-03-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@sambatours.com",
    phone: "+256 123 456 791",
    role: "Content Manager",
    status: "active",
    lastLogin: "2024-06-19",
    permissions: ["blog", "gallery", "content"],
    avatar: "/placeholder-user.jpg",
    joinDate: "2023-06-10",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@sambatours.com",
    phone: "+256 123 456 792",
    role: "Customer Support",
    status: "inactive",
    lastLogin: "2024-06-15",
    permissions: ["customers", "bookings"],
    avatar: "/placeholder-user.jpg",
    joinDate: "2023-09-05",
  },
]

const roles = [
  {
    name: "Super Admin",
    description: "Full system access",
    color: "bg-red-100 text-red-800",
    permissions: "All permissions",
  },
  {
    name: "Tour Manager",
    description: "Manage tours and bookings",
    color: "bg-blue-100 text-blue-800",
    permissions: "Tours, Bookings, Customers",
  },
  {
    name: "Content Manager",
    description: "Manage content and media",
    color: "bg-green-100 text-green-800",
    permissions: "Blog, Gallery, Content",
  },
  {
    name: "Customer Support",
    description: "Handle customer inquiries",
    color: "bg-purple-100 text-purple-800",
    permissions: "Customers, Bookings (view only)",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "inactive":
      return "bg-gray-100 text-gray-800"
    case "suspended":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getRoleColor = (role: string) => {
  const roleConfig = roles.find((r) => r.name === role)
  return roleConfig?.color || "bg-gray-100 text-gray-800"
}

export default function UserManagement() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-earth-900 mb-2">User Management</h1>
              <p className="text-earth-600">Manage admin users and their permissions</p>
            </div>
            <Button asChild className="bg-forest-600 hover:bg-forest-700">
              <Link href="/admin/users/new">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth-600">Total Users</p>
                    <p className="text-2xl font-bold text-earth-900">12</p>
                  </div>
                  <Shield className="h-8 w-8 text-forest-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth-600">Active Users</p>
                    <p className="text-2xl font-bold text-green-600">10</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth-600">Inactive Users</p>
                    <p className="text-2xl font-bold text-gray-600">2</p>
                  </div>
                  <UserX className="h-8 w-8 text-gray-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-earth-600">Roles</p>
                    <p className="text-2xl font-bold text-blue-600">4</p>
                  </div>
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Users List */}
            <div className="lg:col-span-2">
              {/* Filters */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input placeholder="Search users..." className="pl-10" />
                      </div>
                    </div>
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="super-admin">Super Admin</SelectItem>
                        <SelectItem value="tour-manager">Tour Manager</SelectItem>
                        <SelectItem value="content-manager">Content Manager</SelectItem>
                        <SelectItem value="customer-support">Customer Support</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Users */}
              <Suspense fallback={<LoadingSpinner />}>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-earth-900">{user.name}</h3>
                                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-earth-600">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {user.phone}
                                </div>
                                <div>Last login: {user.lastLogin}</div>
                                <div>Joined: {user.joinDate}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </Suspense>
            </div>

            {/* Roles & Permissions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>User Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roles.map((role, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-earth-900">{role.name}</h4>
                          <Badge className={role.color}>{role.name}</Badge>
                        </div>
                        <p className="text-sm text-earth-600 mb-2">{role.description}</p>
                        <p className="text-xs text-earth-500">{role.permissions}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Role
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">John Doe logged in</p>
                      <p className="text-earth-600">2 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Jane Smith updated tour</p>
                      <p className="text-earth-600">4 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Mike Johnson published blog</p>
                      <p className="text-earth-600">6 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Sarah Wilson replied to customer</p>
                      <p className="text-earth-600">8 hours ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
