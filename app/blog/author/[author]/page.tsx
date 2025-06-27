import { Suspense } from "react"
import { notFound } from "next/navigation"
import BlogAuthorHeader from "@/components/blog/blog-author-header"
import BlogGrid from "@/components/blog/blog-grid"
import BlogSidebar from "@/components/blog/blog-sidebar"
import LoadingSpinner from "@/components/ui/loading-spinner"

const authors = {
  "james-okello": {
    name: "James Okello",
    role: "Senior Safari Guide",
    image: "/placeholder.svg?height=200&width=200",
    bio: "James has over 10 years of experience leading gorilla trekking expeditions and wildlife safaris across Uganda. He is passionate about wildlife conservation and sharing his deep knowledge of Uganda's ecosystems with travelers from around the world.",
    expertise: ["Wildlife Safari", "Gorilla Trekking", "Photography", "Birdwatching"],
    experience: "10+ years",
    postCount: 23,
    social: {
      twitter: "@jamesokello",
      instagram: "@jamesokello_guide",
    },
  },
  "sarah-namukasa": {
    name: "Sarah Namukasa",
    role: "Operations Manager",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Sarah ensures every detail of your journey is perfectly planned. With over 8 years in Uganda's tourism industry, her attention to detail and customer service excellence is unmatched. She specializes in creating customized itineraries that exceed expectations.",
    expertise: ["Travel Planning", "Customer Service", "Logistics", "Cultural Tours"],
    experience: "8+ years",
    postCount: 18,
    social: {
      linkedin: "sarah-namukasa",
      instagram: "@sarahnamukasa",
    },
  },
  "mary-atuhaire": {
    name: "Mary Atuhaire",
    role: "Cultural Experience Coordinator",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Mary bridges the gap between visitors and local communities, creating meaningful cultural exchanges and authentic experiences. She is passionate about sustainable tourism and ensuring that local communities benefit from tourism.",
    expertise: ["Cultural Tours", "Community Engagement", "Traditional Crafts", "Sustainability"],
    experience: "7+ years",
    postCount: 15,
    social: {
      facebook: "mary.atuhaire",
      instagram: "@maryatuhaire",
    },
  },
  "robert-tumusiime": {
    name: "Robert Tumusiime",
    role: "Adventure Sports Specialist",
    image: "/placeholder.svg?height=200&width=200",
    bio: "For adrenaline seekers, Robert is your go-to expert. He specializes in adventure activities across Uganda's diverse landscapes and combines his love for extreme sports with professional photography.",
    expertise: ["Mountain Climbing", "White Water Rafting", "Hiking", "Adventure Photography"],
    experience: "6+ years",
    postCount: 12,
    social: {
      instagram: "@robertadventure",
      youtube: "RobertTumusiime",
    },
  },
  "grace-nakato": {
    name: "Grace Nakato",
    role: "Gorilla Trekking Specialist",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Grace has led over 200 gorilla trekking expeditions and is passionate about gorilla conservation and education. Her deep understanding of gorilla behavior and forest ecosystems makes her an exceptional guide.",
    expertise: ["Gorilla Trekking", "Primate Tours", "Conservation", "Forest Ecology"],
    experience: "9+ years",
    postCount: 16,
    social: {
      twitter: "@gracenakato",
      instagram: "@gracenakato_guide",
    },
  },
  "david-mukasa": {
    name: "David Mukasa",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=200&width=200",
    bio: "David founded Samba Tours with a vision to showcase Uganda's natural beauty to the world. With over 12 years in Uganda's tourism industry, he has led the company to become one of the country's most trusted tour operators.",
    expertise: ["Business Leadership", "Tourism Development", "Safari Operations", "Conservation"],
    experience: "12+ years",
    postCount: 8,
    social: {
      linkedin: "david-mukasa",
      twitter: "@davidmukasa",
    },
  },
}

export async function generateMetadata({ params }: { params: { author: string } }) {
  const author = authors[params.author as keyof typeof authors]

  if (!author) {
    return {
      title: "Author Not Found",
    }
  }

  return {
    title: `${author.name} - Articles | Samba Tours Blog`,
    description: `Read articles by ${author.name}, ${author.role} at Samba Tours. ${author.bio}`,
    openGraph: {
      title: `${author.name} - Articles | Samba Tours Blog`,
      description: `Read articles by ${author.name}, ${author.role} at Samba Tours.`,
      images: [author.image],
    },
  }
}

export default async function BlogAuthorPage({ params }: { params: { author: string } }) {
  const author = authors[params.author as keyof typeof authors]

  if (!author) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-cream-50">
      <BlogAuthorHeader author={author} />

      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              <Suspense fallback={<LoadingSpinner />}>
                <BlogGrid authorFilter={params.author} />
              </Suspense>
            </div>

            <div className="lg:col-span-1">
              <Suspense fallback={<LoadingSpinner />}>
                <BlogSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
