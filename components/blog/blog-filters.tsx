"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, TrendingUp, Grid, List } from "lucide-react"

const categories = [
  { id: "all", label: "All Posts", count: 156 },
  { id: "gorilla-trekking", label: "Gorilla Trekking", count: 28 },
  { id: "wildlife-safari", label: "Wildlife Safari", count: 45 },
  { id: "travel-planning", label: "Travel Planning", count: 32 },
  { id: "culture", label: "Culture & Heritage", count: 24 },
  { id: "photography", label: "Photography", count: 18 },
  { id: "adventure", label: "Adventure Sports", count: 15 },
  { id: "conservation", label: "Conservation", count: 12 },
]

const sortOptions = [
  { id: "latest", label: "Latest Posts" },
  { id: "popular", label: "Most Popular" },
  { id: "trending", label: "Trending" },
  { id: "oldest", label: "Oldest First" },
]

export default function BlogFilters() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="mb-8">
      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-earth-400" />
          <Input
            placeholder="Search articles, guides, and stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-earth-200 rounded-lg bg-white text-earth-700 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>

          <div className="flex items-center bg-white rounded-lg border p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className={`${showFilters ? "block" : "hidden lg:block"}`}>
        <div className="flex items-center mb-4">
          <h3 className="font-semibold text-earth-900 mr-4">Categories:</h3>
          <div className="flex items-center space-x-2 text-sm text-earth-600">
            <TrendingUp className="h-4 w-4" />
            <span>Popular topics</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={`${
                activeCategory === category.id
                  ? "bg-forest-600 hover:bg-forest-700 text-white"
                  : "hover:bg-forest-50 border-earth-200"
              }`}
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
