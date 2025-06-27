import { Suspense } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import AboutHero from "@/components/about/about-hero"
import CompanyStory from "@/components/about/company-story"
import TeamSection from "@/components/about/team-section"
import ValuesSection from "@/components/about/values-section"
import AchievementsSection from "@/components/about/achievements-section"
import WhyChooseUs from "@/components/about/why-choose-us"
import CallToAction from "@/components/about/call-to-action"
import LoadingSpinner from "@/components/ui/loading-spinner"

export const metadata = {
  title: "About Samba Tours & Travel - Your Uganda Adventure Specialists",
  description:
    "Learn about Samba Tours & Travel, Uganda's premier tour operator. Discover our story, meet our expert team, and understand why we're the best choice for your East African adventure.",
  keywords: "Uganda tour operator, safari company, travel agency Kampala, gorilla trekking experts, East Africa tours",
  openGraph: {
    title: "About Samba Tours & Travel - Your Uganda Adventure Specialists",
    description: "Learn about Uganda's premier tour operator and our commitment to exceptional travel experiences.",
    images: ["/images/about-hero.jpg"],
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <AboutHero />

        <Suspense fallback={<LoadingSpinner />}>
          <CompanyStory />
        </Suspense>

        <ValuesSection />

        <Suspense fallback={<LoadingSpinner />}>
          <TeamSection />
        </Suspense>

        <AchievementsSection />

        <WhyChooseUs />

        <CallToAction />
      </main>
      <Footer />
    </>
  )
}
