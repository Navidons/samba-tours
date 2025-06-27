import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - Samba Tours & Travel",
  description: "Privacy policy and data protection information for Samba Tours & Travel",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <div className="section-padding">
        <div className="container-max max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="heading-primary mb-8">Privacy Policy</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-earth-600 mb-8">Last updated: December 2024</p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-earth-700">
                  <p>
                    <strong>Personal Information:</strong> Name, email address, phone number, passport details, and
                    emergency contact information.
                  </p>
                  <p>
                    <strong>Payment Information:</strong> Credit card details and billing addresses (processed securely
                    through our payment partners).
                  </p>
                  <p>
                    <strong>Travel Preferences:</strong> Dietary requirements, accessibility needs, and travel
                    interests.
                  </p>
                  <p>
                    <strong>Usage Data:</strong> Website interactions, IP addresses, and device information for
                    improving our services.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4 text-earth-700">
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Processing and managing your tour bookings</li>
                    <li>Communicating important travel information and updates</li>
                    <li>Providing customer support and assistance</li>
                    <li>Improving our services and website functionality</li>
                    <li>Sending promotional materials (with your consent)</li>
                    <li>Complying with legal and regulatory requirements</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">3. Information Sharing</h2>
                <div className="space-y-4 text-earth-700">
                  <p>
                    <strong>Service Providers:</strong> We share information with trusted partners including hotels,
                    transport providers, and activity operators to deliver your tour services.
                  </p>
                  <p>
                    <strong>Legal Requirements:</strong> We may disclose information when required by law or to protect
                    our rights and safety.
                  </p>
                  <p>
                    <strong>Business Transfers:</strong> In the event of a merger or acquisition, your information may
                    be transferred to the new entity.
                  </p>
                  <p>
                    <strong>Consent:</strong> We will not share your personal information for marketing purposes without
                    your explicit consent.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">4. Data Security</h2>
                <div className="space-y-4 text-earth-700">
                  <p>We implement industry-standard security measures to protect your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>SSL encryption for all data transmission</li>
                    <li>Secure servers with regular security updates</li>
                    <li>Limited access to personal information on a need-to-know basis</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Secure payment processing through certified partners</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">5. Your Rights</h2>
                <div className="space-y-4 text-earth-700">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal information we hold</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Object to processing of your information</li>
                    <li>Request data portability</li>
                    <li>Withdraw consent for marketing communications</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">6. Cookies and Tracking</h2>
                <div className="space-y-4 text-earth-700">
                  <p>We use cookies and similar technologies to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Enable social media features</li>
                  </ul>
                  <p>You can control cookie settings through your browser preferences.</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">7. Data Retention</h2>
                <p className="text-earth-700">
                  We retain your personal information for as long as necessary to provide our services and comply with
                  legal obligations. Booking information is typically retained for 7 years for accounting and legal
                  purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">8. International Transfers</h2>
                <p className="text-earth-700">
                  Your information may be transferred to and processed in countries other than Uganda. We ensure
                  appropriate safeguards are in place to protect your information in accordance with this privacy
                  policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">9. Contact Us</h2>
                <div className="text-earth-700">
                  <p>For any privacy-related questions or requests, please contact us:</p>
                  <p>
                    <strong>Email:</strong> privacy@sambatours.com
                  </p>
                  <p>
                    <strong>Phone:</strong> +256 700 123 456
                  </p>
                  <p>
                    <strong>Address:</strong> Samba Tours & Travel, Kampala, Uganda
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
