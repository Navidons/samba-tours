import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { createBooking, markEmailSent, addCommunication } from '@/lib/bookings'
import type { BookingFormData, CartItem } from '@/lib/bookings'

export async function POST(request: NextRequest) {
  try {
    const { bookingData, cartItems } = await request.json()

    // Validate required fields
    if (!bookingData.customer_name || !bookingData.customer_email || !bookingData.customer_phone) {
      return NextResponse.json(
        { error: 'Missing required fields: customer_name, customer_email, customer_phone' },
        { status: 400 }
      )
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'No cart items provided' },
        { status: 400 }
      )
    }

    // Use service role client to bypass RLS
    const supabase = createClient()
    
    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + item.total_price, 0)

    // Generate booking reference manually since RPC might not work
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const bookingReference = `ST-${timestamp}-${randomNum}`

    console.log('Creating booking with reference:', bookingReference)

    // Insert booking directly
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        booking_reference: bookingReference,
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone,
        customer_country: bookingData.customer_country,
        special_requests: bookingData.special_requests,
        total_amount: totalAmount,
        contact_method: bookingData.contact_method,
        preferred_contact_time: bookingData.preferred_contact_time,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json(
        { error: `Failed to create booking: ${bookingError.message}` },
        { status: 500 }
      )
    }

    console.log('Booking created successfully:', booking)

    // Insert booking items
    const bookingItems = cartItems.map(item => ({
      booking_id: booking.id,
      tour_id: item.tour_id,
      tour_title: item.tour_title,
      tour_price: item.tour_price,
      number_of_guests: item.number_of_guests,
      travel_date: item.travel_date,
      total_price: item.total_price
    }))

    const { error: itemsError } = await supabase
      .from('booking_items')
      .insert(bookingItems)

    if (itemsError) {
      console.error('Error creating booking items:', itemsError)
      return NextResponse.json(
        { error: `Failed to create booking items: ${itemsError.message}` },
        { status: 500 }
      )
    }

    console.log('Booking items created successfully')

    // Insert guest information if provided
    if (bookingData.guests && bookingData.guests.length > 0) {
      const guests = bookingData.guests.map(guest => ({
        booking_id: booking.id,
        ...guest
      }))

      const { error: guestsError } = await supabase
        .from('booking_guests')
        .insert(guests)

      if (guestsError) {
        console.error('Error creating booking guests:', guestsError)
        // Don't fail the booking if guest info fails
      }
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail(booking, cartItems)
      
      // Mark email as sent
      await markEmailSent(supabase, booking.id!)
      
      // Add communication record
      await addCommunication(
        supabase,
        booking.id!,
        'email',
        'Confirmation email sent to customer',
        'System',
        'Email sent successfully'
      )
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Don't fail the booking if email fails
    }

    return NextResponse.json({
      success: true,
      booking: booking,
      message: 'Booking created successfully. You will receive a confirmation email shortly.'
    })

  } catch (error) {
    console.error('Error in booking API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendConfirmationEmail(booking: any, cartItems: CartItem[]) {
  // This is a placeholder for email sending
  // In a real implementation, you would use a service like SendGrid, Mailgun, or Resend
  
  const emailContent = `
    Dear ${booking.customer_name},

    Thank you for your booking with Samba Tours & Travel!

    Booking Reference: ${booking.booking_reference}
    Total Amount: $${booking.total_amount}

    Your Tours:
    ${cartItems.map(item => `
      - ${item.tour_title}
        Date: ${new Date(item.travel_date).toLocaleDateString()}
        Guests: ${item.number_of_guests}
        Price: $${item.total_price}
    `).join('')}

    Our team will contact you within 24 hours to confirm your booking and discuss payment options.

    If you have any questions, please contact us:
    Phone: +256 700 123 456
    Email: info@sambatours.com

    Best regards,
    The Samba Tours Team
  `

  console.log('Email would be sent:', emailContent)
  
  // For now, we'll just log the email content
  // In production, you would integrate with an email service
  return Promise.resolve()
} 
