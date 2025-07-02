"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Plus, Briefcase, Loader2, Edit, Trash2, Search, Folder, List, BarChart3, ChevronUp, ChevronDown, ImagePlus, X, Image as ImageIcon, LayoutGrid, CheckCircle, FolderTree, Upload, Star, SortAsc, ArrowUpDown } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Service, ServiceImage, ServiceCategory, createService, updateService, deleteService, getServices, getServiceCategories, updateImagePrimary, createServiceCategory, ServiceWithDetails } from "@/lib/services"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminServicesPage() {
  // Update state types
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [services, setServices] = useState<ServiceWithDetails[]>([])
  const [editingService, setEditingService] = useState<ServiceWithDetails | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ServiceWithDetails | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("services")
  const [showAddModal, setShowAddModal] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [currentImages, setCurrentImages] = useState<File[]>([])
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([])
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'category'>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true)
      try {
        const [servicesData, categoriesData] = await Promise.all([
          getServices(),
          getServiceCategories()
        ])
        setServices(servicesData)
        setCategories(categoriesData)
        if (categoriesData.length > 0) {
          setCategory(categoriesData[0].id)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load data. Please refresh the page.')
      } finally {
        setIsInitialLoading(false)
      }
    }
    loadData()
  }, [])

  // Add new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = newCategory.trim()
    if (!name) {
      toast.error("Category name is required")
      return
    }
    if (categories.some(c => c.name === name)) {
      toast.error("Category already exists")
      return
    }

    try {
      const newCat = await createServiceCategory({ name, description: null })
      setCategories(prev => [...prev, newCat])
      setNewCategory("")
      toast.success("Category added!")
    } catch (error) {
      console.error('Failed to create category:', error)
      const message = error instanceof Error ? error.message : 'Failed to create category'
      toast.error(message)
    }
  }

  // Image handling functions
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    setUploadingImages(true)
    try {
      const newFiles = Array.from(files)
      setCurrentImages(prev => [...prev, ...newFiles])
      toast.success(`${files.length} image${files.length === 1 ? '' : 's'} selected`)
    } catch (error) {
      toast.error("Failed to process images")
    } finally {
      setUploadingImages(false)
      e.target.value = ''
    }
  }, [])

  const handleRemoveImage = useCallback((index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleRemoveExistingImage = useCallback((imageId: string) => {
    setImagesToDelete(prev => [...prev, imageId])
  }, [])

  // Service management functions
  const handleUpdateService = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error("Service title is required")
      return
    }
    if (!category) {
      toast.error("Category is required")
      return
    }

    setIsLoading(true)
    try {
      if (editingService) {
        // Update existing service
        const updatedService = await updateService(
          editingService.id,
          { title, description, category_id: category, status: editingService.status },
          currentImages,
          imagesToDelete
        )
        setServices(prev => prev.map(s => 
          s.id === editingService.id ? updatedService : s
        ))
        toast.success("Service updated successfully!")
      } else {
        // Add new service
        const newService = await createService(
          { title, description, category_id: category, status: 'active' },
          currentImages
        )
        setServices(prev => [...prev, newService])
        toast.success("Service added successfully!")
      }
      
      setTitle("")
      setDescription("")
      setCategory(categories[0]?.id || "")
      setCurrentImages([])
      setImagesToDelete([])
      setEditingService(null)
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to save service:', error)
      toast.error("Failed to save service. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [title, description, category, editingService, categories, currentImages, imagesToDelete])

  const handleDeleteService = useCallback((service: ServiceWithDetails) => {
    setDeleteTarget(service)
    setIsDeleting(true)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return

    try {
      setIsLoading(true)
      await deleteService(deleteTarget.id)
      setServices(prev => prev.filter(s => s.id !== deleteTarget.id))
      toast.success("Service deleted successfully!")
    } catch (error) {
      console.error('Failed to delete service:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to delete service: ${errorMessage}`)
    } finally {
      setIsLoading(false)
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget])

  const handleToggleStatus = useCallback(async (service: ServiceWithDetails) => {
    try {
      const updatedService = await updateService(
        service.id,
        { status: service.status === 'active' ? 'inactive' : 'active' }
      )
      setServices(prev => prev.map(s => 
        s.id === service.id ? updatedService : s
      ))
      toast.success(`Service ${service.status === 'active' ? 'deactivated' : 'activated'}`)
    } catch (error) {
      console.error('Failed to update service status:', error)
      toast.error("Failed to update service status. Please try again.")
    }
  }, [])

  // Bulk actions
  const handleBulkDelete = useCallback(async () => {
    if (selectedServices.size === 0) return

    try {
      await Promise.all(
        Array.from(selectedServices).map(id => deleteService(id))
      )
      setServices(prev => prev.filter(s => !selectedServices.has(s.id)))
      setSelectedServices(new Set())
      toast.success(`${selectedServices.size} services deleted`)
    } catch (error) {
      console.error('Failed to delete services:', error)
      toast.error("Failed to delete services. Please try again.")
    }
  }, [selectedServices])

  const handleBulkChangeCategory = useCallback(async (newCategory: string) => {
    if (selectedServices.size === 0) return

    try {
      const updatePromises = Array.from(selectedServices).map(id =>
        updateService(id, { category_id: newCategory })
      )
      const updatedServices = await Promise.all(updatePromises)
      
      setServices(prev => prev.map(s => {
        const updated = updatedServices.find(u => u.id === s.id)
        return updated || s
      }))
      setSelectedServices(new Set())
      toast.success(`${selectedServices.size} services moved to ${newCategory}`)
    } catch (error) {
      console.error('Failed to update services:', error)
      toast.error("Failed to update services. Please try again.")
    }
  }, [selectedServices])

  // Filtered services by search
  const filteredServices = useMemo(() => {
    let filtered = services
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        service.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    return filtered
  }, [services, searchTerm])

  // Enhanced sorting function
  const sortedServices = useMemo(() => {
    return [...filteredServices].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1
      switch (sortField) {
        case 'title':
          return direction * a.title.localeCompare(b.title)
        case 'category':
          return direction * (a.category?.name || '').localeCompare(b.category?.name || '')
        case 'createdAt':
          return direction * (new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        default:
          return 0
      }
    })
  }, [filteredServices, sortField, sortDirection])

  // Bulk actions
  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedServices(checked ? new Set(sortedServices.map(s => s.id)) : new Set())
  }, [sortedServices])

  const handleSelectService = useCallback((serviceId: string, checked: boolean) => {
    setSelectedServices(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(serviceId)
      } else {
        next.delete(serviceId)
      }
      return next
    })
  }, [])

  // Stats
  const stats = useMemo(() => [
    {
      name: 'Total Services',
      value: services.length,
      icon: LayoutGrid
    },
    {
      name: 'Active Services',
      value: services.filter(s => s.status === 'active').length,
      icon: CheckCircle
    },
    {
      name: 'Categories',
      value: categories.length,
      icon: FolderTree
    },
    {
      name: 'Total Images',
      value: services.reduce((acc, s) => acc + s.images.length, 0),
      icon: ImageIcon
    }
  ], [services, categories])

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, ServiceWithDetails[]> = {}
    sortedServices.forEach(service => {
      const categoryName = service.category?.name || 'Uncategorized'
      if (!grouped[categoryName]) grouped[categoryName] = []
      grouped[categoryName].push(service)
    })
    return grouped
  }, [sortedServices])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl/Cmd + N to add new service
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setShowAddModal(true)
      }
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[placeholder="Search services..."]')?.focus()
      }
      // Escape to clear selection
      if (e.key === 'Escape' && selectedServices.size > 0) {
        setSelectedServices(new Set())
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedServices])

  // Update the service card rendering
  const ServiceCard = ({ service }: { service: ServiceWithDetails }) => {
    const primaryImage = service.images?.find((img: ServiceImage) => img.is_primary)
    
    return (
      <Card className="group relative flex h-[320px] flex-col overflow-hidden transition-all hover:shadow-lg">
        <div className="relative h-40">
          {primaryImage ? (
            <Image
              src={primaryImage.url || '/placeholder.jpg'}
              alt={primaryImage.alt_text || service.title}
              fill
              className="object-cover transition-all group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <Badge variant="outline" className="bg-white/80">
              {service.category?.name || 'Uncategorized'}
            </Badge>
            {service.images && service.images.length > 1 && (
              <Badge className="bg-white/80">
                {service.images.length} images
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold">{service.title}</h3>
            <Badge variant={service.status === 'active' ? 'default' : 'secondary'} className="shrink-0">
              {service.status}
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {service.description || 'No description'}
          </p>
        </div>
        <div className="border-t p-2">
          <div className="flex items-center justify-between gap-2">
            <Checkbox
              checked={selectedServices.has(service.id)}
              onCheckedChange={(checked) => handleSelectService(service.id, !!checked)}
              aria-label="Select service"
            />
            <div className="flex items-center gap-1">
              <Button
                variant={service.status === 'active' ? 'default' : 'secondary'}
                size="sm"
                onClick={() => handleToggleStatus(service)}
                className="h-8 px-3 text-xs font-medium"
              >
                {service.status === 'active' ? (
                  <>
                    <ChevronDown className="mr-1 h-3 w-3" />
                    Active
                  </>
                ) : (
                  <>
                    <ChevronUp className="mr-1 h-3 w-3" />
                    Inactive
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingService(service)
                  setTitle(service.title)
                  setDescription(service.description || '')
                  setCategory(service.category_id || categories[0]?.id || '')
                  setShowAddModal(true)
                }}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteService(service)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Loading skeleton for service card
  const ServiceCardSkeleton = () => (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <div className="flex h-full items-center justify-center bg-muted">
            <div className="h-full w-full bg-muted" role="img" aria-label="Loading placeholder" />
          </div>
        </AspectRatio>
      </CardHeader>
      <CardContent className="space-y-1.5 p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="ml-auto h-5 w-24" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex w-full items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardFooter>
    </Card>
  )

  // Loading skeleton for stats
  const StatCardSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div
        className="flex flex-col rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:flex-row md:items-center md:justify-between"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="text-blue-100">
            Manage your services, categories, and media
          </p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 md:mt-0">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-white/10 hover:bg-white/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 hover:bg-white/20"
            onClick={() => setActiveTab(activeTab === "services" ? "categories" : "services")}
          >
            {activeTab === "services" ? (
              <>
                <FolderTree className="mr-2 h-4 w-4" />
                Manage Categories
              </>
            ) : (
              <>
                <LayoutGrid className="mr-2 h-4 w-4" />
                View Services
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isInitialLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {activeTab === "services" ? (
        <>
          {/* Search and filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortField('title')}>
                    Title
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField('category')}>
                    Category
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField('createdAt')}>
                    Date
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}>
                    {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {selectedServices.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedServices.size} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(true)}
                >
                  Bulk Actions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedServices(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </div>

          {/* Services grid */}
          <div className="space-y-8">
            {isInitialLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ServiceCardSkeleton key={i} />
                ))}
              </div>
            ) : Object.entries(servicesByCategory).map(([categoryName, services]) => (
              <div key={categoryName} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{categoryName}</h2>
                  <Badge variant="outline">
                    {services.length} service{services.length === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="submit">Add</Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isInitialLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))
            ) : categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {servicesByCategory[category.name]?.length || 0} services
                  </p>
                  {category.description && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateService}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Service title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Service description"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Images</Label>
                <div className="flex flex-wrap gap-2">
                  {editingService?.images.map((image) => (
                    <div key={image.id} className="relative">
                      <AspectRatio ratio={1} className="h-20 w-20">
                        <Image
                          src={image.url || ''}
                          alt={image.alt_text || ''}
                          fill
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                      {!imagesToDelete.includes(image.id) && (
                        <>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 h-6 w-6"
                            onClick={() => handleRemoveExistingImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {!image.is_primary && (
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute -left-2 -top-2 h-6 w-6"
                              onClick={() => updateImagePrimary(image.id, editingService.id)}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                  {currentImages.map((file, idx) => (
                    <div key={idx} className="relative">
                      <AspectRatio ratio={1} className="h-20 w-20">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </AspectRatio>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed">
                    <Label
                      htmlFor="images"
                      className="flex cursor-pointer flex-col items-center justify-center gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-xs">Upload</span>
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false)
                  setTitle("")
                  setDescription("")
                  setCategory(categories[0]?.id || "")
                  setCurrentImages([])
                  setImagesToDelete([])
                  setEditingService(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingService ? 'Update' : 'Create'} Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service and all its images.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleting(false)
              setDeleteTarget(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActions} onOpenChange={setShowBulkActions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Apply actions to {selectedServices.size} selected services
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Move to Category</Label>
              <Select onValueChange={handleBulkChangeCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="w-full"
            >
              Delete Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 