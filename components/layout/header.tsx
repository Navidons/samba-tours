"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Phone, Mail, Search, ShoppingBag, MapPin, Calendar, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { getAllTours } from "@/lib/tours"
import type { Tour } from "@/lib/tours"
import { useCart } from "@/components/cart/cart-context"

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Tours",
    href: "/tours",
    submenu: [
      { name: "All Tours", href: "/tours", description: "Browse all available tours" },
      {
        name: "Gorilla Trekking",
        href: "/tours?category=gorilla-trekking",
        description: "Mountain gorilla experiences",
      },
      { name: "Wildlife Safari", href: "/tours?category=wildlife-safari", description: "Safari adventures" },
      { name: "Cultural Tours", href: "/tours?category=cultural", description: "Cultural experiences" },
      { name: "Adventure Tours", href: "/tours?category=adventure", description: "Thrilling adventures" },
      { name: "Bird Watching", href: "/tours?category=birding", description: "Birding expeditions" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    submenu: [
      { name: "All Services", href: "/services", description: "Browse all our services" },
      { name: "Travel Planning", href: "/services?category=planning", description: "Custom travel planning" },
      { name: "Transportation", href: "/services?category=transport", description: "Transport solutions" },
      { name: "Accommodation", href: "/services?category=accommodation", description: "Lodging options" },
      { name: "Guide Services", href: "/services?category=guides", description: "Expert local guides" },
      { name: "Equipment Rental", href: "/services?category=equipment", description: "Travel gear rental" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Gallery", href: "/gallery" },
  {
    name: "Blog",
    href: "/blog",
    submenu: [
      { name: "All Articles", href: "/blog", description: "Latest travel articles" },
      { name: "Travel Planning", href: "/blog/category/travel-planning", description: "Planning your trip" },
      { name: "Wildlife", href: "/blog/category/wildlife", description: "Wildlife stories" },
      { name: "Culture", href: "/blog/category/culture", description: "Cultural insights" },
      { name: "Photography", href: "/blog/category/photography", description: "Photography tips" },
      { name: "Conservation", href: "/blog/category/conservation", description: "Conservation efforts" },
    ],
  },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { getTotalTravelers } = useCart()
  const cartItemCount = getTotalTravelers()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [allTours, setAllTours] = useState<Tour[]>([])
  const [searchResults, setSearchResults] = useState<Tour[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Load all tours for search
  useEffect(() => {
    const loadTours = async () => {
      try {
        const supabase = createClient()
        const tours = await getAllTours(supabase)
        setAllTours(tours)
      } catch (error) {
        console.error('Error loading tours for search:', error)
      }
    }
    loadTours()
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      // Escape to close search
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false)
        setSearchQuery("")
        setShowSearchResults(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchOpen])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Real-time search filtering
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allTours.filter(
        (tour) =>
          tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tour.short_description && tour.short_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (tour.highlights && tour.highlights.some((highlight: string) => 
            highlight.toLowerCase().includes(searchQuery.toLowerCase())
          ))
      )
      setSearchResults(filtered.slice(0, 5)) // Show max 5 results
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }, [searchQuery, allTours])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
      setShowSearchResults(false)
    }
  }

  const handleSearchResultClick = (tour: Tour) => {
    router.push(`/tours/${tour.id}`)
    setSearchOpen(false)
    setSearchQuery("")
    setShowSearchResults(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white shadow-sm",
      )}
    >
      {/* Top bar - more compact */}
      <div className="bg-forest-800 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3" />
              <span>+256 700 123 456</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-3 w-3" />
              <span>info@sambatours.com</span>
            </div>
          </div>
          <div className="hidden md:flex items-center text-xs">
            <span>Follow your dreams, we'll handle the journey</span>
          </div>
        </div>
      </div>

      {/* Main header - reduced height */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo - more compact */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-forest-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <div>
                <h1 className="font-playfair text-lg font-bold text-earth-900">Samba Tours</h1>
                <p className="text-xs text-earth-600">& Travel</p>
              </div>
            </Link>
          </div>

          {/* Desktop navigation - more compact */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.submenu ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          "font-medium transition-colors hover:text-forest-600 bg-transparent text-sm py-2",
                          isActive(item.href) ? "text-forest-600" : "text-earth-700",
                        )}
                      >
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.submenu.map((subItem) => (
                            <li key={subItem.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={subItem.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{subItem.name}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "font-medium transition-colors hover:text-forest-600 px-3 py-2 text-sm",
                          isActive(item.href) ? "text-forest-600" : "text-earth-700",
                        )}
                      >
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions - more compact */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Search */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <div className="relative">
                <form onSubmit={handleSearch} className="flex items-center">
                  <Input
                    type="text"
                      placeholder="Search tours, destinations... (Ctrl+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-56 pr-10 h-8 text-sm"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                      onClick={() => {
                        setSearchOpen(false)
                        setSearchQuery("")
                        setShowSearchResults(false)
                      }}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                  </Button>
                </form>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                      {searchResults.map((tour) => (
                        <div
                          key={tour.id}
                          onClick={() => handleSearchResultClick(tour)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded overflow-hidden">
                              <img
                                src={tour.featured_image || "/placeholder.svg?height=48&width=48"}
                                alt={tour.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">{tour.title}</h4>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{tour.location}</span>
                                <span className="mx-2">•</span>
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{tour.duration}</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500 mt-1">
                                <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                                <span>{tour.rating} ({tour.review_count})</span>
                                <span className="mx-2">•</span>
                                <span className="font-medium text-forest-600">${tour.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {searchResults.length > 0 && (
                        <div className="p-3 bg-gray-50 border-t border-gray-200">
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleSearch}
                          >
                            View all results for "{searchQuery}"
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchOpen(true)} 
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                  title="Search (Ctrl+K)"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Cart/Bookings */}
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="h-8 w-8 p-0 relative hover:bg-transparent"
            >
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-5 w-5 text-earth-700 hover:text-forest-600" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[10px] rounded-full"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* CTA Buttons - more compact */}
            <Button variant="outline" size="sm" asChild className="h-8 text-sm">
              <Link href="/contact">Get Quote</Link>
            </Button>
            <Button asChild className="bg-forest-600 hover:bg-forest-700 text-white h-8 text-sm">
              <Link href="/tours">Book Now</Link>
            </Button>
          </div>

          {/* Mobile menu button - more compact */}
          <div className="lg:hidden flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setSearchOpen(!searchOpen)} className="h-8 w-8 p-0">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="h-8 w-8 p-0">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search - more compact */}
        {searchOpen && (
          <div className="lg:hidden pb-2">
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search tours, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 text-sm"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu - more compact */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg max-h-screen overflow-y-auto">
          <div className="px-4 py-4 space-y-3">
            {/* Main Navigation */}
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <div>
                    <Link
                      href={item.href}
                      className={cn(
                        "block font-medium py-1.5 transition-colors text-sm",
                        isActive(item.href) ? "text-forest-600 font-semibold" : "text-earth-700 hover:text-forest-600",
                      )}
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-4 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block text-xs text-earth-600 hover:text-forest-600 py-0.5"
                          onClick={closeMobileMenu}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block font-medium py-1.5 transition-colors text-sm",
                      isActive(item.href) ? "text-forest-600 font-semibold" : "text-earth-700 hover:text-forest-600",
                    )}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Cart Section */}
            <div className="pt-3 border-t border-gray-200">
              <Link
                href="/cart"
                className="flex items-center py-1 text-earth-700 hover:text-forest-600 text-sm"
                onClick={closeMobileMenu}
              >
                <ShoppingCart className="h-3 w-3 mr-2" />
                Cart ({cartItemCount})
              </Link>
            </div>

            {/* CTA Buttons - more compact */}
            <div className="pt-3 space-y-2 border-t border-gray-200">
              <Button variant="outline" className="w-full h-8 text-sm" asChild>
                <Link href="/contact" onClick={closeMobileMenu}>
                  Get Quote
                </Link>
              </Button>
              <Button className="w-full bg-forest-600 hover:bg-forest-700 text-white h-8 text-sm" asChild>
                <Link href="/tours" onClick={closeMobileMenu}>
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
