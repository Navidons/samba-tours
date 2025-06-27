import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Send, Calendar, Check, X, Eye, Trash2, Edit } from "lucide-react"

export const metadata = {
  title: "Notifications - Samba Tours Admin",
  description: "Manage notifications and communications.",
}

const notifications = [
  {
    id: 1,
    title: "New booking received",
    message: "Sarah Johnson booked Gorilla Trekking Adventure for July 15-18",
    type: "booking",
    priority: "high",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    title: "Payment confirmation",
    message: "Payment of $2,400 received from Michael Chen",
    type: "payment",
    priority: "medium",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Tour review posted",
    message: "Emma Thompson left a 5-star review for Queen Elizabeth Tour",
    type: "review",
    priority: "low",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "System backup completed",
    message: "Daily system backup completed successfully",
    type: "system",
    priority: "low",
    time: "6 hours ago",
    read: true,
  },
]

const campaigns = [
  {
    id: 1,
    name: "Summer Safari Special",
    type: "email",
    recipients: 1247,
    sent: "2024-06-20",
    status: "sent",
    openRate: "24.5%",
    clickRate: "3.2%",
  },
  {
    id: 2,
    name: "Gorilla Trekking Reminder",
    type: "sms",
    recipients: 45,
    sent: "2024-06-21",
    status: "sent",
    openRate: "98.2%",
    clickRate: "12.1%",
  },
  {
    id: 3,
    name: "New Blog Post Alert",
    type: "push",
    recipients: 892,
    sent: "2024-06-19",
    status: "sent",
    openRate: "15.8%",
    clickRate: "2.1%",
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "booking":
      return "bg-blue-100 text-blue-800"
    case "payment":
      return "bg-green-100 text-green-800"
    case "review":
      return "bg-purple-100 text-purple-800"
    case "system":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "sent":
      return "bg-green-100 text-green-800"
    case "draft":
      return "bg-yellow-100 text-yellow-800"
    case "scheduled":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-earth-900 mb-2">Notifications</h1>
              <p className="text-earth-600">Manage notifications and communication campaigns</p>
            </div>
            <Button className="bg-forest-600 hover:bg-forest-700">
              <Send className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>

          <Tabs defaultValue="inbox" className="space-y-6">
            <TabsList>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="compose">Compose</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            {/* Inbox */}
            <TabsContent value="inbox">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Stats */}
                <div className="lg:col-span-1">
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-earth-600">Unread</p>
                            <p className="text-2xl font-bold text-red-600">8</p>
                          </div>
                          <Bell className="h-8 w-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-earth-600">Today</p>
                            <p className="text-2xl font-bold text-earth-900">23</p>
                          </div>
                          <Calendar className="h-8 w-8 text-forest-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Notifications</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Check className="h-4 w-4 mr-1" />
                            Mark All Read
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear All
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border rounded-lg ${
                              !notification.read ? "bg-blue-50 border-blue-200" : "bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium text-earth-900">{notification.title}</h4>
                                  <Badge className={getTypeColor(notification.type)}>{notification.type}</Badge>
                                  <Badge className={getPriorityColor(notification.priority)}>
                                    {notification.priority}
                                  </Badge>
                                  {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                </div>
                                <p className="text-sm text-earth-600 mb-2">{notification.message}</p>
                                <p className="text-xs text-earth-500">{notification.time}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Campaigns */}
            <TabsContent value="campaigns">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-earth-900">{campaign.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                              <Badge variant="outline">{campaign.type}</Badge>
                            </div>
                          </div>
                          <div className="text-right text-sm text-earth-600">
                            <p>Sent: {campaign.sent}</p>
                            <p>Recipients: {campaign.recipients.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-earth-600">Open Rate: </span>
                            <span className="font-medium">{campaign.openRate}</span>
                          </div>
                          <div>
                            <span className="text-earth-600">Click Rate: </span>
                            <span className="font-medium">{campaign.clickRate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compose */}
            <TabsContent value="compose">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Campaign Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Audience</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Customers</SelectItem>
                          <SelectItem value="subscribers">Newsletter Subscribers</SelectItem>
                          <SelectItem value="recent">Recent Customers</SelectItem>
                          <SelectItem value="vip">VIP Customers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Enter subject line" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Enter your message..." rows={8} />
                  </div>

                  <div className="flex gap-3">
                    <Button className="bg-forest-600 hover:bg-forest-700">
                      <Send className="h-4 w-4 mr-2" />
                      Send Now
                    </Button>
                    <Button variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button variant="outline">Save Draft</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Templates */}
            <TabsContent value="templates">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Booking Confirmation",
                    type: "Email",
                    description: "Sent when a customer makes a booking",
                    usage: "High",
                  },
                  {
                    name: "Payment Receipt",
                    type: "Email",
                    description: "Sent after successful payment",
                    usage: "High",
                  },
                  {
                    name: "Tour Reminder",
                    type: "SMS",
                    description: "Reminder sent 24 hours before tour",
                    usage: "Medium",
                  },
                  {
                    name: "Welcome Message",
                    type: "Email",
                    description: "Sent to new newsletter subscribers",
                    usage: "Medium",
                  },
                  {
                    name: "Feedback Request",
                    type: "Email",
                    description: "Sent after tour completion",
                    usage: "Low",
                  },
                  {
                    name: "Special Offer",
                    type: "Email",
                    description: "Promotional campaigns",
                    usage: "Low",
                  },
                ].map((template, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-semibold text-earth-900 mb-2">{template.name}</h3>
                        <Badge variant="outline" className="mb-2">
                          {template.type}
                        </Badge>
                        <p className="text-sm text-earth-600">{template.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-earth-500">Usage: {template.usage}</span>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
