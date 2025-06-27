import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    // Here you would typically save to database or integrate with email service
    // For now, we'll just log it
    console.log("Newsletter signup:", email)

    // In production, integrate with services like Mailchimp, ConvertKit, etc.
    // Example: await mailchimp.lists.addListMember(listId, { email_address: email })

    return NextResponse.json({ message: "Successfully subscribed" })
  } catch (error) {
    console.error("Newsletter signup error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
