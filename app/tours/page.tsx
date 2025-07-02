import { Suspense } from "react"
import { Metadata } from "next"
import ToursClient from "./tours-client"
import { generateSEOMetadata, PAGE_SEO } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: PAGE_SEO.tours.title,
  description: PAGE_SEO.tours.description,
  keywords: PAGE_SEO.tours.keywords,
  path: "/tours",
})

export default function ToursPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursClient />
                </Suspense>
  )
}
