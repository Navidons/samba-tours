import type { Metadata } from "next"
import AboutHero from "@/components/about/about-hero"
import CompanyStory from "@/components/about/company-story"
import WhyChooseUs from "@/components/about/why-choose-us"
import ValuesSection from "@/components/about/values-section"
import TeamSection from "@/components/about/team-section"
import AchievementsSection from "@/components/about/achievements-section"
import CallToAction from "@/components/about/call-to-action"

export const metadata: Metadata = {
  title: "About Us - Samba Tours & Travel",
  description: "Learn about Samba Tours & Travel, Uganda's premier tour operator. Discover our story, values, and commitment to sustainable tourism and unforgettable experiences.",
  keywords: "about samba tours, uganda tour operator, sustainable tourism, travel company uganda, safari experts",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyStory />
      <WhyChooseUs />
      <ValuesSection />
      <TeamSection />
      <AchievementsSection />
      <CallToAction />
    </>
  )
}
