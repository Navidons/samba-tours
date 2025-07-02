"use client"

import { useState, Dispatch, SetStateAction } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid, List } from "lucide-react"
import { Input } from "@/components/ui/input"

interface GalleryFiltersProps {
  categories: { id: number; name: string; count: number }[];
  locations: { id: number; name: string; count: number }[];
  activeCategory: string | number;
  setActiveCategory: Dispatch<SetStateAction<string | number>>;
  activeLocation: string | number;
  setActiveLocation: Dispatch<SetStateAction<string | number>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  viewMode: "grid" | "masonry";
  setViewMode: Dispatch<SetStateAction<"grid" | "masonry">>;
}

export default function GalleryFilters({
  categories,
  locations,
  activeCategory,
  setActiveCategory,
  activeLocation,
  setActiveLocation,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
}: GalleryFiltersProps) {
  console.log("GalleryFilters: Received categories prop:", categories);
  console.log("GalleryFilters: Received locations prop:", locations);

  const [showFilters, setShowFilters] = useState(false)

  // Ensure 'All' has a string ID and other categories/locations have numbers
  const categoryWithCounts = [
    { id: "all", name: "All", count: categories.reduce((sum, cat) => sum + (cat.count || 0), 0) },
    ...categories.map(cat => ({ ...cat, count: cat.count || 0 })) 
  ];

  const locationWithCounts = [
    { id: "all", name: "All Locations", count: locations.reduce((sum, loc) => sum + (loc.count || 0), 0) },
    ...locations.map(loc => ({ ...loc, count: loc.count || 0 }))
  ];

  return (
    <div className="mb-8">
      {/* Search and View Toggle */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
          <Input
            placeholder="Search photos by location, activity, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <div className="flex items-center bg-white rounded-lg border p-1">
            <Button
              variant={viewMode === "masonry" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("masonry")}
              className="h-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
        {/* Category Filters */}
        <div>
          <h3 className="font-semibold text-earth-900 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categoryWithCounts.map((category) => (
              <Button
                key={category.id}
                variant={String(activeCategory) === String(category.id) ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id === "all" ? "all" : category.id.toString())}
                className={`${
                  String(activeCategory) === String(category.id) ? "bg-forest-100 hover:bg-forest-200 text-forest-800 border-forest-300" : "hover:bg-forest-50"
                }`}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Location Filters */}
        <div>
          <h3 className="font-semibold text-earth-900 mb-3">Locations</h3>
          <div className="flex flex-wrap gap-2">
            {locationWithCounts.map((location) => (
              <Button
                key={location.id}
                variant={String(activeLocation) === String(location.id) ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveLocation(location.id === "all" ? "all" : location.id.toString())}
                className={`${
                  String(activeLocation) === String(location.id) ? "bg-forest-100 hover:bg-forest-200 text-forest-800 border-forest-300" : "hover:bg-forest-50"
                }`}
              >
                {location.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
