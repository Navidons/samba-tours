import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateBreadcrumbSchema } from "@/lib/seo"
import { StructuredData } from "@/components/seo/structured-data"

interface BreadcrumbItem {
  name: string
  url: string
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  showStructuredData?: boolean
}

export default function Breadcrumbs({ 
  items, 
  className,
  showHome = true,
  showStructuredData = true
}: BreadcrumbsProps) {
  // Prepare breadcrumb items with home if needed
  const breadcrumbItems = showHome 
    ? [{ name: "Home", url: "/" }, ...items]
    : items

  // Generate structured data
  const breadcrumbSchema = showStructuredData 
    ? generateBreadcrumbSchema(breadcrumbItems)
    : null

  return (
    <>
      {breadcrumbSchema && <StructuredData data={breadcrumbSchema} />}
      
      <nav 
        aria-label="Breadcrumb"
        className={cn("flex items-center space-x-1 text-sm", className)}
      >
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1
            const isFirst = index === 0

            return (
              <li key={index} className="flex items-center">
                {/* Separator */}
                {!isFirst && (
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                )}
                
                {/* Breadcrumb Item */}
                {isLast ? (
                  <span 
                    className="text-gray-600 font-medium"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                  >
                    {isFirst && showHome && (
                      <Home className="h-4 w-4 mr-1" />
                    )}
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbsFromPath(pathname: string, customItems?: Record<string, string>) {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Check for custom names first
    let name = customItems?.[segment] || segment
    
    // Format common segments
    if (!customItems?.[segment]) {
      name = segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    }
    
    items.push({
      name,
      url: currentPath,
      current: isLast
    })
  })

  return items
}

// Pre-defined breadcrumb mappings for common pages
export const BREADCRUMB_MAPPINGS: Record<string, string> = {
  'tours': 'Tours & Safaris',
  'blog': 'Travel Blog',
  'about': 'About Us',
  'contact': 'Contact Us',
  'services': 'Our Services',
  'gallery': 'Photo Gallery',
  'bookings': 'My Bookings',
  'admin': 'Admin Dashboard',
  'analytics': 'Analytics',
  'customers': 'Customer Management',
  'settings': 'Settings',
  'users': 'User Management',
  'reports': 'Reports',
  'gorilla-trekking': 'Gorilla Trekking',
  'wildlife-safari': 'Wildlife Safari',
  'cultural': 'Cultural Tours',
  'adventure': 'Adventure Tours',
  'birding': 'Bird Watching'
}

// Hook for easy breadcrumb generation
export function useBreadcrumbs(pathname: string, customItems?: BreadcrumbItem[]) {
  if (customItems) {
    return customItems
  }
  
  return generateBreadcrumbsFromPath(pathname, BREADCRUMB_MAPPINGS)
} 