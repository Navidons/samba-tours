"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Mail,
  Globe,
  User,
  CreditCard,
  TrendingUp,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  Tag,
  Hash,
  CalendarDays,
  Building2,
  Plane,
  Car,
  Hotel,
  UtensilsCrossed,
  Wifi,
  Shield,
  Zap,
  Heart,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  ChevronRight,
  ChevronDown,
  Info,
  AlertTriangle,
  Check,
  X,
  Clock3,
  Timer,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  CalendarPlus,
  PhoneCall,
  Video,
  MessageCircle,
  Send,
  Archive,
  RefreshCw,
  Settings,
  Bell,
  BellOff,
  Star as StarIcon,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  BookOpen,
  Map,
  Navigation,
  Compass,
  Flag,
  Home,
  Briefcase,
  Camera,
  Music,
  Coffee,
  ShoppingBag,
  CreditCard as CreditCardIcon,
  Wallet,
  Receipt,
  Calculator,
  Percent,
  TrendingDown,
  DollarSign as DollarSignIcon,
  Euro,
  PoundSterling,
  Bitcoin,
  Zap as ZapIcon,
  Sparkles,
  Crown,
  Gem,
  Diamond,
  Trophy,
  Medal,
  Ribbon,
  BadgeCheck,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  QrCode,
  Barcode,
  Tag as TagIcon,
  Hash as HashIcon,
  AtSign,
  Hash as HashIcon2,
  Hash as HashIcon3,
  Hash as HashIcon4,
  Hash as HashIcon5,
  Hash as HashIcon6,
  Hash as HashIcon7,
  Hash as HashIcon8,
  Hash as HashIcon9,
  Hash as HashIcon10
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import { getBookingsByEmail, updateBookingStatus, addCommunication } from "@/lib/bookings"
import type { Booking } from "@/lib/bookings"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { toast } from "sonner"

// PATCH/UPDATE Checklist for Supabase:
// 1. Ensure JSON body field names match the table schema exactly (e.g., payment_status: 'paid').
// 2. Use correct headers: 'Content-Type: application/json', 'apikey', 'Authorization'.
// 3. Allowed values for payment_status: 'pending', 'paid', 'refunded'.
// 4. If you get a 400 error, check for typos or missing fields.
// 5. If you get a 42702 error (ambiguous column), check your trigger function for ambiguous column references and use table prefixes or unique variable names.
// 6. Make sure permissions and RLS policies allow UPDATE for your role.
//
// See the backend SQL for permissions and RLS policy setup.

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showCommunicationDialog, setShowCommunicationDialog] = useState(false)
  const [communicationData, setCommunicationData] = useState({
    type: "email" as "email" | "phone" | "whatsapp" | "in_person",
    notes: "",
    outcome: "",
    nextFollowUpDate: ""
  })
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [expandedBookings, setExpandedBookings] = useState<Set<number>>(new Set())

  // Load all bookings
  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select(`
            *,
            items:booking_items(*),
            guests:booking_guests(*)
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error loading bookings:', error)
          toast.error("Failed to load bookings")
        } else {
          setBookings(bookingsData || [])
        }
      } catch (err) {
        console.error('Error loading bookings:', err)
        toast.error("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = 
      booking.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booking_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.items && booking.items.some(item => 
        item.tour_title.toLowerCase().includes(searchQuery.toLowerCase())
      ))

    if (statusFilter === "all") return matchesSearch
    return matchesSearch && booking.status === statusFilter
  })

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100"
    case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100"
    case "cancelled":
        return "bg-red-50 text-red-700 border-red-200 ring-red-100"
    case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100"
    default:
        return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-100"
  }
}

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100"
    case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100"
    case "failed":
        return "bg-red-50 text-red-700 border-red-200 ring-red-100"
    case "refunded":
        return "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100"
    default:
        return "bg-gray-50 text-gray-700 border-gray-200 ring-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getCustomerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const toggleExpanded = (bookingId: number) => {
    const newExpanded = new Set(expandedBookings)
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId)
    } else {
      newExpanded.add(bookingId)
    }
    setExpandedBookings(newExpanded)
  }

  const handleStatusUpdate = async (bookingId: number, newStatus: Booking['status']) => {
    try {
      setUpdatingStatus(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId)

      if (error) {
        console.error('Error updating booking status:', error)
        toast.error(error.message || 'Failed to update status')
        return
      }

      // --- Trigger Confirmation Email on 'confirmed' status ---
      const booking = bookings.find(b => b.id === bookingId);
      if (booking && newStatus === 'confirmed') {
        toast.info("Sending confirmation email...");
        fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: booking.customer_email,
            subject: `Your Booking is Confirmed! #${booking.booking_reference}`,
            template: 'bookingConfirmed',
            data: {
              customerName: booking.customer_name,
              bookingReference: booking.booking_reference,
              bookingDate: new Date(booking.created_at!).toLocaleDateString(),
            }
          })
        })
        .then(res => { if(res.ok) toast.success("Confirmation email sent!")})
        .catch(err => console.error("Failed to send confirmation email:", err));
      }
      // ---------------------------------------------------------

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ))
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, status: newStatus } : null)
      }
      toast.success(`Booking status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handlePaymentStatusUpdate = async (bookingId: number, newPaymentStatus: Booking['payment_status']) => {
    try {
      setUpdatingStatus(true)
      const supabase = createClient()
      
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: newPaymentStatus })
        .eq('id', bookingId)

      if (error) {
        console.error('Error updating payment status:', error)
        toast.error(error.message || 'Failed to update payment status')
        return
      }

      // --- Trigger Payment Confirmation Email on 'paid' status ---
      const booking = bookings.find(b => b.id === bookingId);
      if (booking && newPaymentStatus === 'paid') {
        toast.info("Sending payment confirmation email...");
        fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: booking.customer_email,
            subject: `Payment Received for Booking #${booking.booking_reference}`,
            template: 'paymentConfirmation',
            data: {
              customerName: booking.customer_name,
              bookingReference: booking.booking_reference,
              paymentDate: new Date().toLocaleDateString(),
              paymentAmount: booking.total_amount,
            }
          })
        })
        .then(res => { if(res.ok) toast.success("Payment confirmation sent!")})
        .catch(err => console.error("Failed to send payment confirmation email:", err));
      }
      // -----------------------------------------------------------

      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, payment_status: newPaymentStatus } : booking
      ))
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(prev => prev ? { ...prev, payment_status: newPaymentStatus } : null)
      }
      toast.success(`Payment status updated to ${newPaymentStatus}`)
    } catch (error) {
      console.error('Error updating payment status:', error)
      toast.error('Failed to update payment status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAddCommunication = async () => {
    if (!selectedBooking || !communicationData.notes.trim()) {
      toast.error("Please enter communication notes")
      return
    }

    try {
      const supabase = createClient()
      
      const result = await addCommunication(
        supabase,
        selectedBooking.id!,
        communicationData.type,
        communicationData.notes,
        "Admin",
        communicationData.outcome,
        communicationData.nextFollowUpDate || undefined
      )

      if (result.success) {
        toast.success("Communication record added")
        setShowCommunicationDialog(false)
        setCommunicationData({
          type: "email",
          notes: "",
          outcome: "",
          nextFollowUpDate: ""
        })
      } else {
        toast.error(result.error || "Failed to add communication")
      }
    } catch (error) {
      console.error('Error adding communication:', error)
      toast.error("Failed to add communication")
    }
  }

  const exportBookings = () => {
    const csvContent = [
      ['Booking Reference', 'Customer Name', 'Email', 'Phone', 'Tour', 'Date', 'Guests', 'Status', 'Payment Status', 'Amount', 'Created Date'],
      ...filteredBookings.map(booking => [
        booking.booking_reference,
        booking.customer_name,
        booking.customer_email,
        booking.customer_phone,
        booking.items?.[0]?.tour_title || 'N/A',
        booking.items?.[0]?.travel_date || 'N/A',
        booking.items?.[0]?.number_of_guests || 'N/A',
        booking.status,
        booking.payment_status,
        `$${booking.total_amount}`,
        new Date(booking.created_at!).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const refreshBookings = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          *,
          items:booking_items(*),
          guests:booking_guests(*)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error refreshing bookings:', error)
        toast.error("Failed to refresh bookings")
      } else {
        setBookings(bookingsData || [])
        toast.success("Bookings refreshed successfully")
      }
    } catch (err) {
      console.error('Error refreshing bookings:', err)
      toast.error("Failed to refresh bookings")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="section-padding">
        <div className="container-max">
          {/* Enhanced Header with Stats */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
            <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Booking Management
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Manage all tour bookings and reservations
                    </p>
                  </div>
                </div>
            </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={refreshBookings} className="border-gray-200 hover:bg-gray-50">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportBookings} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                      <p className="text-3xl font-bold text-gray-900">{filteredBookings.length}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">
                        ${filteredBookings.reduce((sum, b) => sum + b.total_amount, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {filteredBookings.filter(b => b.status === 'pending').length}
                      </p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Confirmed</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {filteredBookings.filter(b => b.status === 'confirmed').length}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Filters */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      placeholder="Search bookings by name, email, tour, or booking ID..." 
                      className="pl-12 h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px] h-14 border-gray-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-14 border-gray-200 px-6">
                  <Filter className="h-5 w-5 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Bookings List */}
          <div className="space-y-6">
            {filteredBookings.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-16 text-center">
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-3">No bookings found</h3>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
                    {searchQuery || statusFilter !== "all" 
                      ? "Try adjusting your search criteria or filters" 
                      : "No bookings have been made yet. They will appear here once customers start booking tours."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => {
                const isExpanded = expandedBookings.has(booking.id!)
                return (
                  <Card key={booking.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Enhanced Header Section */}
                      <div className="p-6 border-b border-gray-100 cursor-pointer select-none flex items-center justify-between" onClick={() => toggleExpanded(booking.id!)}>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 ring-4 ring-blue-100">
                            <AvatarFallback className="text-white font-bold text-lg">
                              {getCustomerInitials(booking.customer_name)}
                            </AvatarFallback>
                          </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {booking.customer_name}
                              </h3>
                              <Badge className={`${getStatusColor(booking.status)} border px-3 py-1 ring-1`}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(booking.status)}
                                  <span className="capitalize font-semibold">{booking.status}</span>
                                </div>
                              </Badge>
                              <Badge className={`${getPaymentStatusColor(booking.payment_status)} border px-3 py-1 ring-1`}>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-3 w-3" />
                                  <span className="capitalize font-semibold">{booking.payment_status}</span>
                                </div>
                              </Badge>
                              {/* Customer Status Indicator */}
                              {booking.status === 'confirmed' && booking.payment_status === 'paid' && (
                                <Badge className="bg-purple-50 text-purple-700 border-purple-200 ring-purple-100 border px-3 py-1 ring-1">
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span className="capitalize font-semibold">Customer Record</span>
                                  </div>
                                </Badge>
                              )}
                              {(booking.status === 'pending' || booking.payment_status === 'pending') && (
                                <Badge className="bg-amber-50 text-amber-700 border-amber-200 ring-amber-100 border px-3 py-1 ring-1">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span className="capitalize font-semibold">Pending Customer</span>
                                  </div>
                          </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {booking.customer_email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" />
                                {booking.customer_phone}
                              </span>
                              {booking.customer_country && (
                                <span className="flex items-center gap-1">
                                  <Globe className="h-4 w-4" />
                                  {booking.customer_country}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Hash className="h-4 w-4" />
                                #{booking.booking_reference}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                          className="ml-4 p-2 rounded-full hover:bg-gray-100 transition"
                          onClick={e => { e.stopPropagation(); toggleExpanded(booking.id!) }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-6 w-6 text-gray-500" />
                          ) : (
                            <ChevronRight className="h-6 w-6 text-gray-500" />
                          )}
                        </button>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">${booking.total_amount}</p>
                            <p className="text-sm text-gray-500">Total Amount</p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Content Section */}
                      {isExpanded && (
                        <div className="p-6 bg-gray-50/50">
                          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Tour Information */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <MapPin className="h-5 w-5 text-blue-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Tour Details</h4>
                              </div>
                              
                              {booking.items && booking.items.length > 0 ? (
                                <div className="space-y-4">
                                  {booking.items.map((item, index) => (
                                    <Card key={index} className="bg-white border-0 shadow-sm">
                                      <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                          <h5 className="font-semibold text-gray-900 text-lg">{item.tour_title}</h5>
                                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                            Tour #{index + 1}
                                          </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                          <div>
                                              <p className="text-sm text-gray-600">Travel Date</p>
                                              <p className="font-medium text-gray-900">
                                                {new Date(item.travel_date).toLocaleDateString()}
                            </p>
                          </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <div>
                                              <p className="text-sm text-gray-600">Guests</p>
                                              <p className="font-medium text-gray-900">{item.number_of_guests}</p>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <DollarSign className="h-4 w-4 text-gray-500" />
                                            <div>
                                              <p className="text-sm text-gray-600">Price/Person</p>
                                              <p className="font-medium text-gray-900">${item.tour_price}</p>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                                            <CreditCard className="h-4 w-4 text-emerald-500" />
                          <div>
                                              <p className="text-sm text-emerald-600">Total</p>
                                              <p className="font-bold text-emerald-700">${item.total_price}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              ) : (
                                <Card className="bg-white border-0 shadow-sm">
                                  <CardContent className="p-6 text-center">
                                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No tour details available</p>
                                  </CardContent>
                                </Card>
                              )}
                            </div>

                            {/* Booking Information */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                  <FileText className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Booking Information</h4>
                              </div>
                              
                              <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Hash className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Booking ID</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm font-semibold text-gray-900">
                                          #{booking.booking_reference}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(booking.booking_reference)}
                                          className="p-1 h-6 w-6"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <CalendarDays className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Created</span>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900">
                                        {new Date(booking.created_at!).toLocaleDateString()}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <DollarSign className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm text-emerald-600">Total Amount</span>
                                      </div>
                                      <span className="text-lg font-bold text-emerald-700">
                                        ${booking.total_amount}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Contact Method</span>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900 capitalize">
                                        {booking.contact_method}
                                      </span>
                                    </div>
                                    
                                    {booking.preferred_contact_time && (
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                          <Clock className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm text-gray-600">Preferred Time</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                          {booking.preferred_contact_time}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <Zap className="h-5 w-5 text-purple-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Quick Actions</h4>
                              </div>
                              
                              <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                  <div className="space-y-3">
                                    <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          className="w-full justify-start h-12"
                                          onClick={() => setSelectedBooking(booking)}
                                        >
                                          <Eye className="h-4 w-4 mr-3" />
                                          View Full Details
                                        </Button>
                                      </DialogTrigger>
                                    </Dialog>

                                    <Dialog open={showCommunicationDialog} onOpenChange={setShowCommunicationDialog}>
                                      <DialogTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          className="w-full justify-start h-12"
                                          onClick={() => setSelectedBooking(booking)}
                                        >
                                          <MessageSquare className="h-4 w-4 mr-3" />
                                          Add Communication
                                        </Button>
                                      </DialogTrigger>
                                    </Dialog>

                                    {/* Show View Customer button only when confirmed and paid */}
                                    {booking.status === 'confirmed' && booking.payment_status === 'paid' && (
                                      <Button 
                                        variant="outline" 
                                        className="w-full justify-start h-12 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                                        onClick={() => window.open('/admin/customers', '_blank')}
                                      >
                                        <Users className="h-4 w-4 mr-3" />
                                        View Customer Record
                                      </Button>
                                    )}

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <Phone className="h-4 w-4 mr-3" />
                                      Call Customer
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <Mail className="h-4 w-4 mr-3" />
                                      Send Email
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <MessageCircle className="h-4 w-4 mr-3" />
                                      WhatsApp
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <Video className="h-4 w-4 mr-3" />
                                      Video Call
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          {/* Special Requests */}
                          {booking.special_requests && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Special Requests</h4>
                              </div>
                              <Card className="bg-amber-50 border border-amber-200">
                                <CardContent className="p-6">
                                  <p className="text-amber-800 leading-relaxed">{booking.special_requests}</p>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Enhanced Pagination */}
          {filteredBookings.length > 0 && (
            <div className="flex justify-center mt-12">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="px-4 py-2">
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="px-4 py-2 bg-blue-600 text-white border-blue-600">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="px-4 py-2">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="px-4 py-2">
                      3
                    </Button>
                    <Button variant="outline" size="sm" className="px-4 py-2">
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Booking Details - {selectedBooking?.booking_reference}
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-900 font-medium">{selectedBooking.customer_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email Address</label>
                        <p className="text-gray-900">{selectedBooking.customer_email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone Number</label>
                        <p className="text-gray-900">{selectedBooking.customer_phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Country</label>
                        <p className="text-gray-900">{selectedBooking.customer_country || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Preferred Contact Method</label>
                        <p className="text-gray-900 capitalize">{selectedBooking.contact_method}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Preferred Contact Time</label>
                        <p className="text-gray-900">{selectedBooking.preferred_contact_time || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tour Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Tour Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedBooking.items && selectedBooking.items.length > 0 ? (
                    <div className="space-y-4">
                      {selectedBooking.items.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                          <h4 className="font-semibold text-lg mb-4">{item.tour_title}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                              <label className="text-sm font-medium text-gray-600">Travel Date</label>
                              <p className="text-gray-900">{new Date(item.travel_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Number of Guests</label>
                              <p className="text-gray-900">{item.number_of_guests}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">Price per Person</label>
                              <p className="text-gray-900">${item.tour_price}</p>
                          </div>
                          <div>
                              <label className="text-sm font-medium text-gray-600">Total Amount</label>
                              <p className="text-gray-900 font-semibold">${item.total_price}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No tour details available</p>
                  )}
                </CardContent>
              </Card>

              {/* Status Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Status Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Information Note */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800">Customer Record Creation</h4>
                          <p className="text-sm text-blue-600">
                            When you set both Booking Status to "Confirmed" and Payment Status to "Paid", 
                            a customer record will automatically be created or updated in the customers database 
                            with booking statistics, loyalty points, and customer classification.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Record Status Indicator */}
                    {selectedBooking.status === 'confirmed' && selectedBooking.payment_status === 'paid' && (
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-purple-600" />
                          <div>
                            <h4 className="font-semibold text-purple-800">Customer Record Active</h4>
                            <p className="text-sm text-purple-600">
                              This customer has been added to the customers database with updated statistics.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {(selectedBooking.status === 'pending' || selectedBooking.payment_status === 'pending') && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-amber-600" />
                          <div>
                            <h4 className="font-semibold text-amber-800">Pending Customer Record</h4>
                            <p className="text-sm text-amber-600">
                              Customer record will be created when booking is confirmed and payment is received.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                        <Select 
                          value={selectedBooking.status} 
                          onValueChange={(value) => handleStatusUpdate(selectedBooking.id!, value as Booking['status'])}
                          disabled={updatingStatus}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        {updatingStatus && (
                          <p className="text-sm text-gray-500 mt-1">Updating status...</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                        <Select 
                          value={selectedBooking.payment_status} 
                          onValueChange={(value) => handlePaymentStatusUpdate(selectedBooking.id!, value as Booking['payment_status'])}
                          disabled={updatingStatus}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                        {updatingStatus && (
                          <p className="text-sm text-gray-500 mt-1">Updating payment status...</p>
                        )}
                        </div>
                      </div>

                    {/* Customer Record Action */}
                    {selectedBooking.status === 'confirmed' && selectedBooking.payment_status === 'paid' && (
                      <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <div>
                            <h4 className="font-semibold text-emerald-800">Customer Record Created</h4>
                            <p className="text-sm text-emerald-600">
                              View customer details and booking history
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                          onClick={() => window.open('/admin/customers', '_blank')}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Customer
                        </Button>
                      </div>
                    )}
                    </div>
                  </CardContent>
                </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Communication Dialog */}
      <Dialog open={showCommunicationDialog} onOpenChange={setShowCommunicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Add Communication Record
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Communication Type</label>
              <Select 
                value={communicationData.type} 
                onValueChange={(value) => setCommunicationData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <Textarea 
                placeholder="Enter communication notes..."
                value={communicationData.notes}
                onChange={(e) => setCommunicationData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Outcome</label>
              <Input 
                placeholder="e.g., Customer confirmed, Payment received"
                value={communicationData.outcome}
                onChange={(e) => setCommunicationData(prev => ({ ...prev, outcome: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Next Follow-up Date</label>
              <Input 
                type="date"
                value={communicationData.nextFollowUpDate}
                onChange={(e) => setCommunicationData(prev => ({ ...prev, nextFollowUpDate: e.target.value }))}
              />
            </div>
            <Button onClick={handleAddCommunication} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              Add Communication Record
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
