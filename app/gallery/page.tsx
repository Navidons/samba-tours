import type { Metadata } from "next"
import GalleryClient from "./gallery-client"

export const metadata: Metadata = {
  title: "Photo Gallery - Samba Tours & Travel",
  description:
    "Explore our stunning photo gallery showcasing Uganda's wildlife, landscapes, and cultural experiences from our tours.",
  keywords: "uganda photos, safari gallery, gorilla photos, wildlife photography, travel gallery, uganda tourism",
}

export default function GalleryPage() {
  return <GalleryClient />
} 