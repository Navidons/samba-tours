"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  MessageSquare,
  Search,
  Filter,
  MoreHorizontal,
  Reply,
  Archive,
  Trash2,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import { differenceInHours, isToday } from 'date-fns'

// Mock data
const contactStats = [
  { title: "Total Messages", value: "1,247", icon: MessageSquare, change: "+12%" },
  { title: "Pending Replies", value: "23", icon: Clock, change: "-5%" },
  { title: "Resolved Today", value: "45", icon: CheckCircle, change: "+18%" },
  { title: "Response Time", value: "2.4h", icon: Reply, change: "-15%" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "replied":
      return "bg-blue-100 text-blue-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-orange-100 text-orange-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ContactManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("contact_inquiries")
          .select("*")
          .order("created_at", { ascending: false })
        if (error) throw error
        setMessages(data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load messages")
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [])

  // Remove dummy stats and calculate real stats
  const totalMessages = messages.length;
  const pendingReplies = messages.filter(m => !m.status || m.status === 'pending').length;
  const resolvedToday = messages.filter(m => m.status === 'resolved' && isToday(new Date(m.created_at))).length;
  // For response time, if you have a 'responded_at' field, calculate average
  let avgResponseTime = null;
  let fastestResponse = null;
  if (messages.length > 0 && messages[0].responded_at) {
    const responseTimes = messages
      .filter(m => m.responded_at)
      .map(m => differenceInHours(new Date(m.responded_at), new Date(m.created_at)));
    if (responseTimes.length > 0) {
      avgResponseTime = (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1);
      fastestResponse = Math.min(...responseTimes);
    }
  }
  // Message sources breakdown
  const sourceCounts = messages.reduce((acc, m) => {
    const src = (m.source || 'Website').toLowerCase();
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sourceTotal = Object.values(sourceCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-earth-900">Contact Management</h1>
        <p className="text-earth-600 mt-2">Manage customer inquiries and communications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600">Total Messages</p>
                <p className="text-2xl font-bold text-earth-900">{totalMessages}</p>
              </div>
              <div className="h-12 w-12 bg-forest-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-forest-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600">Pending Replies</p>
                <p className="text-2xl font-bold text-earth-900">{pendingReplies}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600">Resolved Today</p>
                <p className="text-2xl font-bold text-earth-900">{resolvedToday}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-earth-600">Avg. Response Time</p>
                <p className="text-2xl font-bold text-earth-900">{avgResponseTime ? `${avgResponseTime}h` : '--'}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Reply className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-earth-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Customer inquiries and contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
                  ) : error ? (
                    <TableRow><TableCell colSpan={7} className="text-red-600">{error}</TableCell></TableRow>
                  ) : messages.length === 0 ? (
                    <TableRow><TableCell colSpan={7}>No messages found.</TableCell></TableRow>
                  ) : (
                    messages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.name}</div>
                            <div className="text-sm text-earth-500">{message.email}</div>
                            {message.phone && (
                              <div className="text-xs text-earth-400">{message.phone}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{message.subject || <span className="text-earth-400 italic">(No subject)</span>}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">New</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            message.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                            message.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {message.priority || 'Normal'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(message.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>Website</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => setSelectedMessage(message)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Analytics</CardTitle>
              <CardDescription>Insights into customer communication patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">Message Sources</h4>
                  <ul className="space-y-1">
                    {Object.entries(sourceCounts).map(([src, count]) => (
                      <li key={src} className="flex items-center gap-2">
                        <span className="capitalize font-medium">{src}</span>
                        <span className="inline-block bg-emerald-100 text-emerald-700 rounded px-2 py-0.5 text-xs font-semibold">
                          {((count / sourceTotal) * 100).toFixed(0)}%
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Response Times</h4>
                  <div className="mb-2">Average Response: <span className="font-bold">{avgResponseTime ? `${avgResponseTime} hours` : '--'}</span></div>
                  <div className="mb-2">Fastest Response: <span className="font-bold">{fastestResponse !== null ? `${fastestResponse} hours` : '--'}</span></div>
                  <div>Resolution Rate: <span className="font-bold">{totalMessages > 0 ? `${((resolvedToday / totalMessages) * 100).toFixed(0)}%` : '--'}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Settings</CardTitle>
              <CardDescription>Configure contact form and communication preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Auto-Reply Settings</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-reply message</label>
                  <Textarea
                    placeholder="Thank you for contacting Samba Tours. We'll get back to you within 24 hours..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Notification Settings</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">Email notifications for new messages</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm">SMS notifications for urgent messages</span>
                  </label>
                </div>
              </div>
              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div><span className="font-semibold">Name:</span> {selectedMessage.name}</div>
                <div><span className="font-semibold">Email:</span> {selectedMessage.email}</div>
                <div><span className="font-semibold">Phone:</span> {selectedMessage.phone || <span className="text-earth-400">-</span>}</div>
                <div><span className="font-semibold">Subject:</span> {selectedMessage.subject || <span className="text-earth-400">-</span>}</div>
                <div><span className="font-semibold">Priority:</span> <Badge className={
                  selectedMessage.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' :
                  selectedMessage.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }>{selectedMessage.priority || 'Normal'}</Badge></div>
                <div><span className="font-semibold">Received:</span> {new Date(selectedMessage.created_at).toLocaleString()}</div>
              </div>
              <div>
                <span className="font-semibold">Message:</span>
                <div className="mt-2 p-4 bg-emerald-50 rounded-lg border text-emerald-900 whitespace-pre-line">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
