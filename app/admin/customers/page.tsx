"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MessageSquare, 
  Mail, 
  Phone,
  Globe,
  Calendar,
  DollarSign,
  Users,
  Crown,
  Star,
  TrendingUp,
  RefreshCw,
  BookOpen,
  Award,
  Target,
  Zap,
  ChevronRight,
  ChevronDown,
  Clock,
  MapPin,
  CreditCard,
  Hash
} from "lucide-react"
import { createClient } from "@/lib/supabase"
import { getAllCustomers, getCustomerStats, searchCustomers, filterCustomersByType, exportCustomersToCSV } from "@/lib/customers"
import type { Customer } from "@/lib/customers"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { toast } from "sonner"

export default function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [stats, setStats] = useState<any>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [expandedCustomers, setExpandedCustomers] = useState<Set<number>>(new Set())

  // Load customers and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const [customersData, statsData] = await Promise.all([
          getAllCustomers(supabase),
          getCustomerStats(supabase)
        ])
        
        setCustomers(customersData)
        setFilteredCustomers(customersData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading customers:', error)
        toast.error("Failed to load customers")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter customers based on search and type
  useEffect(() => {
    let filtered = [...customers]

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchQuery))
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(customer => customer.customer_type === typeFilter)
    }

    setFilteredCustomers(filtered)
  }, [customers, searchQuery, typeFilter])

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "inactive":
        return "bg-gray-50 text-gray-700 border-gray-200"
    case "blocked":
        return "bg-red-50 text-red-700 border-red-200"
    default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "vip":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "repeat":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "regular":
        return "bg-green-50 text-green-700 border-green-200"
      case "new":
        return "bg-amber-50 text-amber-700 border-amber-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getCustomerTypeIcon = (type: string) => {
    switch (type) {
      case "vip":
        return <Crown className="h-4 w-4" />
      case "repeat":
        return <Star className="h-4 w-4" />
      case "regular":
        return <Users className="h-4 w-4" />
      case "new":
        return <Target className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getCustomerInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const toggleExpanded = (customerId: number) => {
    const newExpanded = new Set(expandedCustomers)
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId)
    } else {
      newExpanded.add(customerId)
    }
    setExpandedCustomers(newExpanded)
  }

  const exportCustomers = () => {
    const csvContent = exportCustomersToCSV(filteredCustomers)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Customers exported successfully")
  }

  const refreshData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      
      const [customersData, statsData] = await Promise.all([
        getAllCustomers(supabase),
        getCustomerStats(supabase)
      ])
      
      setCustomers(customersData)
      setFilteredCustomers(customersData)
      setStats(statsData)
      toast.success("Data refreshed successfully")
    } catch (error) {
      console.error('Error refreshing data:', error)
      toast.error("Failed to refresh data")
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
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Customer Management
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage customer accounts and profiles
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={refreshData} className="border-gray-200 hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportCustomers} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
              <Download className="h-4 w-4 mr-2" />
              Export Customers
            </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Customers</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Customers</p>
                      <p className="text-3xl font-bold text-emerald-600">{stats.activeCustomers}</p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-purple-600">${stats.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
              </CardContent>
            </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                      <p className="text-3xl font-bold text-amber-600">{stats.vipCustomers}</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Crown className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
              </CardContent>
            </Card>
          </div>
          )}

          {/* Filters */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input 
                      placeholder="Search customers by name, email, or phone..." 
                      className="pl-12 h-14 border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[200px] h-14 border-gray-200">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="repeat">Repeat</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="h-14 border-gray-200 px-6">
                  <Filter className="h-5 w-5 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customers List */}
          <div className="space-y-6">
            {filteredCustomers.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-16 text-center">
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-600 mb-3">No customers found</h3>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
                    {searchQuery || typeFilter !== "all" 
                      ? "Try adjusting your search criteria or filters" 
                      : "No customers have been added yet. They will appear here once confirmed and paid bookings are processed."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredCustomers.map((customer) => {
                const isExpanded = expandedCustomers.has(customer.id!)
                return (
                  <Card key={customer.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Header Section */}
                      <div className="p-6 border-b border-gray-100 cursor-pointer select-none" onClick={() => toggleExpanded(customer.id!)}>
                        <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-600 ring-4 ring-purple-100">
                              <AvatarFallback className="text-white font-bold text-lg">
                                {getCustomerInitials(customer.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {customer.name}
                                </h3>
                                <Badge className={`${getStatusColor(customer.status)} border px-3 py-1 ring-1`}>
                                  <span className="capitalize font-semibold">{customer.status}</span>
                                </Badge>
                                <Badge className={`${getCustomerTypeColor(customer.customer_type)} border px-3 py-1 ring-1`}>
                                  <div className="flex items-center gap-1">
                                    {getCustomerTypeIcon(customer.customer_type)}
                                    <span className="capitalize font-semibold">{customer.customer_type}</span>
                                  </div>
                                </Badge>
                          </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {customer.email}
                                </span>
                                {customer.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-4 w-4" />
                                    {customer.phone}
                                  </span>
                                )}
                                {customer.country && (
                                  <span className="flex items-center gap-1">
                                    <Globe className="h-4 w-4" />
                                    {customer.country}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  {customer.total_bookings} bookings
                                </span>
                            </div>
                            </div>
                            </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-purple-600">${customer.total_spent.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">Total Spent</p>
                            </div>
                            <button
                              type="button"
                              aria-label={isExpanded ? "Collapse details" : "Expand details"}
                              className="ml-4 p-2 rounded-full hover:bg-gray-100 transition"
                              onClick={e => { e.stopPropagation(); toggleExpanded(customer.id!) }}
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-6 w-6 text-gray-500" />
                              ) : (
                                <ChevronRight className="h-6 w-6 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="p-6 bg-gray-50/50">
                          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Customer Information */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Customer Information</h4>
                              </div>
                              
                              <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Email</span>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900">{customer.email}</span>
                                    </div>
                                    
                                    {customer.phone && (
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                          <Phone className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm text-gray-600">Phone</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{customer.phone}</span>
                                      </div>
                                    )}
                                    
                                    {customer.country && (
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                          <Globe className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm text-gray-600">Country</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{customer.country}</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Award className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm text-purple-600">Loyalty Points</span>
                                      </div>
                                      <span className="text-lg font-bold text-purple-700">{customer.loyalty_points}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                            </div>

                            {/* Booking Statistics */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <BookOpen className="h-5 w-5 text-blue-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900">Booking Statistics</h4>
                              </div>
                              
                              <Card className="bg-white border-0 shadow-sm">
                                <CardContent className="p-6">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <BookOpen className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">Total Bookings</span>
                                      </div>
                                      <span className="text-lg font-bold text-gray-900">{customer.total_bookings}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <DollarSign className="h-4 w-4 text-emerald-500" />
                                        <span className="text-sm text-emerald-600">Total Spent</span>
                                      </div>
                                      <span className="text-lg font-bold text-emerald-700">${customer.total_spent.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                      <div className="flex items-center gap-3">
                                        <Target className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-blue-600">Avg. Order Value</span>
                                      </div>
                                      <span className="text-lg font-bold text-blue-700">${customer.average_order_value.toFixed(2)}</span>
                                    </div>
                                    
                                    {customer.first_booking_date && (
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                          <Calendar className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm text-gray-600">First Booking</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                          {new Date(customer.first_booking_date).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {customer.last_booking_date && (
                                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                          <Clock className="h-4 w-4 text-gray-500" />
                                          <span className="text-sm text-gray-600">Last Booking</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                          {new Date(customer.last_booking_date).toLocaleDateString()}
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
                                <div className="p-2 bg-pink-100 rounded-lg">
                                  <Zap className="h-5 w-5 text-pink-600" />
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
                                          onClick={() => setSelectedCustomer(customer)}
                                        >
                                          <Eye className="h-4 w-4 mr-3" />
                                          View Full Details
                                        </Button>
                                      </DialogTrigger>
                                    </Dialog>

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <Mail className="h-4 w-4 mr-3" />
                                      Send Email
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <Phone className="h-4 w-4 mr-3" />
                                      Call Customer
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <MessageSquare className="h-4 w-4 mr-3" />
                                      Send Message
                                    </Button>

                                    <Button variant="outline" className="w-full justify-start h-12">
                                      <BookOpen className="h-4 w-4 mr-3" />
                                      View Bookings
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {/* Pagination */}
          {filteredCustomers.length > 0 && (
            <div className="flex justify-center mt-12">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="px-4 py-2">
                Previous
              </Button>
                    <Button variant="outline" size="sm" className="px-4 py-2 bg-purple-600 text-white border-purple-600">
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

      {/* Customer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customer Details - {selectedCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="text-gray-900 font-medium">{selectedCustomer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email Address</label>
                        <p className="text-gray-900">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone Number</label>
                        <p className="text-gray-900">{selectedCustomer.phone || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Country</label>
                        <p className="text-gray-900">{selectedCustomer.country || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Customer Type</label>
                        <p className="text-gray-900 capitalize">{selectedCustomer.customer_type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <p className="text-gray-900 capitalize">{selectedCustomer.status}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Booking Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Booking Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Total Bookings</label>
                      <p className="text-2xl font-bold text-gray-900">{selectedCustomer.total_bookings}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Total Spent</label>
                      <p className="text-2xl font-bold text-purple-600">${selectedCustomer.total_spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Average Order Value</label>
                      <p className="text-2xl font-bold text-blue-600">${selectedCustomer.average_order_value.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Loyalty Points</label>
                      <p className="text-2xl font-bold text-amber-600">{selectedCustomer.loyalty_points}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
