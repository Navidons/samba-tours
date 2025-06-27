import { Facebook, Instagram, Twitter, Youtube, Linkedin, TwitterIcon as TikTok } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const socialPlatforms = [
  {
    name: "Facebook",
    icon: Facebook,
    handle: "@SambaToursUganda",
    followers: "15.2K",
    description: "Daily updates, customer photos, and travel tips",
    href: "https://facebook.com/sambatours",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "Instagram",
    icon: Instagram,
    handle: "@sambatours_uganda",
    followers: "28.5K",
    description: "Stunning photos and stories from our tours",
    href: "https://instagram.com/sambatours",
    color: "bg-pink-600 hover:bg-pink-700",
  },
  {
    name: "Twitter",
    icon: Twitter,
    handle: "@SambaToursUG",
    followers: "8.3K",
    description: "Real-time updates and travel news",
    href: "https://twitter.com/sambatours",
    color: "bg-sky-500 hover:bg-sky-600",
  },
  {
    name: "YouTube",
    icon: Youtube,
    handle: "Samba Tours Uganda",
    followers: "12.1K",
    description: "Virtual tours and travel documentaries",
    href: "https://youtube.com/sambatours",
    color: "bg-red-600 hover:bg-red-700",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    handle: "Samba Tours & Travel",
    followers: "3.2K",
    description: "Professional updates and industry insights",
    href: "https://linkedin.com/company/sambatours",
    color: "bg-blue-700 hover:bg-blue-800",
  },
  {
    name: "TikTok",
    icon: TikTok,
    handle: "@sambatours_ug",
    followers: "45.7K",
    description: "Fun travel moments and behind-the-scenes",
    href: "https://tiktok.com/@sambatours",
    color: "bg-black hover:bg-gray-800",
  },
]

export default function SocialConnect() {
  return null;
}
