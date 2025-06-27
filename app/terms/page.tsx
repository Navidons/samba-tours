import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - Samba Tours & Travel",
  description: "Terms and conditions for booking tours with Samba Tours & Travel",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cream-50">
      <div className="section-padding">
        <div className="container-max max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="heading-primary mb-8">Terms of Service</h1>

            <div className="prose prose-lg max-w-none">
              <p className="text-earth-600 mb-8">Last updated: December 2024</p>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-earth-700 mb-4">
                  By accessing and using the services provided by Samba Tours & Travel ("we," "our," or "us"), you
                  accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">2. Booking and Payment Terms</h2>
                <div className="space-y-4 text-earth-700">
                  <p>
                    <strong>Booking Confirmation:</strong> All bookings are subject to availability and confirmation by
                    Samba Tours & Travel.
                  </p>
                  <p>
                    <strong>Payment Schedule:</strong> A deposit of 30% is required to secure your booking, with the
                    balance due 30 days before departure.
                  </p>
                  <p>
                    <strong>Payment Methods:</strong> We accept major credit cards, bank transfers, and mobile money
                    payments.
                  </p>
                  <p>
                    <strong>Currency:</strong> All prices are quoted in USD unless otherwise specified.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">3. Cancellation Policy</h2>
                <div className="space-y-4 text-earth-700">
                  <p>
                    <strong>Client Cancellation:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>More than 60 days before departure: 10% cancellation fee</li>
                    <li>30-60 days before departure: 25% cancellation fee</li>
                    <li>15-29 days before departure: 50% cancellation fee</li>
                    <li>Less than 15 days before departure: 100% cancellation fee</li>
                  </ul>
                  <p>
                    <strong>Force Majeure:</strong> In cases of natural disasters, political unrest, or other
                    circumstances beyond our control, alternative arrangements will be made or full refunds provided.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">4. Travel Requirements</h2>
                <div className="space-y-4 text-earth-700">
                  <p>
                    <strong>Documentation:</strong> Clients are responsible for ensuring they have valid passports,
                    visas, and any required health certificates.
                  </p>
                  <p>
                    <strong>Health Requirements:</strong> Yellow fever vaccination is mandatory for entry into Uganda.
                    Other vaccinations may be recommended.
                  </p>
                  <p>
                    <strong>Travel Insurance:</strong> We strongly recommend comprehensive travel insurance covering
                    medical expenses, trip cancellation, and emergency evacuation.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">5. Liability and Responsibility</h2>
                <div className="space-y-4 text-earth-700">
                  <p>
                    <strong>Our Responsibility:</strong> We are responsible for providing services as described in your
                    itinerary, subject to availability and circumstances beyond our control.
                  </p>
                  <p>
                    <strong>Limitation of Liability:</strong> Our liability is limited to the cost of the tour. We are
                    not liable for delays, changes, or cancellations due to weather, political situations, or other
                    factors beyond our control.
                  </p>
                  <p>
                    <strong>Client Responsibility:</strong> Clients are responsible for their personal safety, following
                    guide instructions, and respecting local customs and regulations.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">6. Privacy Policy</h2>
                <p className="text-earth-700">
                  We are committed to protecting your privacy. Personal information collected during booking is used
                  solely for providing our services and will not be shared with third parties without your consent,
                  except as required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">7. Dispute Resolution</h2>
                <p className="text-earth-700">
                  Any disputes arising from these terms or our services will be resolved through arbitration in
                  accordance with the laws of Uganda. We encourage clients to contact us directly to resolve any
                  concerns.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-earth-900 mb-4">8. Contact Information</h2>
                <div className="text-earth-700">
                  <p>
                    <strong>Samba Tours & Travel</strong>
                  </p>
                  <p>Email: legal@sambatours.com</p>
                  <p>Phone: +256 700 123 456</p>
                  <p>Address: Kampala, Uganda</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
