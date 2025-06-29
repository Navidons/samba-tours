import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: "Samba Tours & Travel - Discover Uganda & East Africa",
  description:
    "Experience the beauty of Uganda and East Africa with our tailored and group travel packages. Book your adventure today!",
  keywords: "Uganda tours, East Africa travel, safari, gorilla trekking, wildlife, tourism",
  openGraph: {
    title: "Samba Tours & Travel - Discover Uganda & East Africa",
    description: "Experience the beauty of Uganda and East Africa with our tailored and group travel packages.",
    images: ["/images/hero-uganda.jpg"],
  },
  generator: "v0.dev",
} 