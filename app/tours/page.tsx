import { Suspense } from "react"
import { Metadata } from "next"
import ToursClient from "./tours-client"

export const metadata: Metadata = {
  title: "Uganda Tours & Safari Packages - Samba Tours",
  description:
    "Explore our comprehensive collection of Uganda tours including gorilla trekking, wildlife safaris, cultural experiences, and adventure tours.",
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToursClient />
                </Suspense>
  )
}
