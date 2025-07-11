import type { Metadata } from "next"
import ContactHero from "@/components/contact/contact-hero"
import ContactForm from "@/components/contact/contact-form"
import ContactInfo from "@/components/contact/contact-info"
import ContactMap from "@/components/contact/contact-map"
import ContactMethods from "@/components/contact/contact-methods"
import OfficeHours from "@/components/contact/office-hours"
import EmergencyContact from "@/components/contact/emergency-contact"
import VideoCallBooking from "@/components/contact/video-call-booking"
import CallbackRequest from "@/components/contact/callback-request"
import SocialConnect from "@/components/contact/social-connect"
import ContactFAQ from "@/components/contact/contact-faq"
import { generateSEOMetadata, PAGE_SEO } from "@/lib/seo"

export const metadata: Metadata = generateSEOMetadata({
  title: PAGE_SEO.contact.title,
  description: PAGE_SEO.contact.description,
  keywords: PAGE_SEO.contact.keywords,
  path: "/contact",
})

export default function ContactPage() {
  return (
    <>
        <ContactHero />

      <div className="section-padding">
          <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <ContactForm />
              <VideoCallBooking />
              <CallbackRequest />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
                <ContactInfo />
              <ContactMethods />
              <OfficeHours />
              <EmergencyContact />
              <SocialConnect />
            </div>
                </div>
              </div>
            </div>

      <ContactMap />
      <ContactFAQ />
    </>
  )
}
