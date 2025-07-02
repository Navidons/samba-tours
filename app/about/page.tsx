import type { Metadata } from "next"
import AboutHero from "@/components/about/about-hero"
import CompanyStory from "@/components/about/company-story"
import WhyChooseUs from "@/components/about/why-choose-us"
import ValuesSection from "@/components/about/values-section"
import TeamSection from "@/components/about/team-section"
import AchievementsSection from "@/components/about/achievements-section"
import CallToAction from "@/components/about/call-to-action"
import { generateSEOMetadata, PAGE_SEO } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: PAGE_SEO.about.title,
  description: PAGE_SEO.about.description,
  keywords: PAGE_SEO.about.keywords,
  path: "/about",
})

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
