import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Failed to subscribe to newsletter" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Successfully subscribed", id: data.id });
  } catch (error) {
    console.error("Newsletter signup error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
