import { createClient } from './supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface BookingItem {
  id?: number
  tour_id: number
  tour_title: string
  tour_price: number
  number_of_guests: number
  travel_date: string
  total_price: number
}

export interface BookingGuest {
  id?: number
  guest_name: string
  guest_age?: number
  dietary_restrictions?: string
  medical_conditions?: string
  passport_number?: string
  nationality?: string
}

export interface BookingFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_country?: string
  special_requests?: string
  contact_method: 'email' | 'phone' | 'whatsapp'
  preferred_contact_time?: string
  guests: BookingGuest[]
}

export interface Booking {
  id?: number
  booking_reference: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_country?: string
  special_requests?: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'refunded'
  contact_method: 'email' | 'phone' | 'whatsapp'
  preferred_contact_time?: string
  email_sent: boolean
  email_sent_at?: string
  created_at?: string
  updated_at?: string
  items?: BookingItem[]
  guests?: BookingGuest[]
}

export interface CartItem {
  tour_id: number
  tour_title: string
  tour_price: number
  number_of_guests: number
  travel_date: string
  total_price: number
  tour_image?: string
  tour_location?: string
  tour_duration?: string
}

// Create a new booking
export async function createBooking(
  supabase: SupabaseClient,
  bookingData: BookingFormData,
  cartItems: CartItem[]
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => sum + item.total_price, 0)

    // Generate booking reference
    const { data: refData } = await supabase.rpc('generate_booking_reference')
    const bookingReference = refData || `ST-${Date.now()}`

    // Insert booking
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
      return { success: false, error: bookingError.message }
    }

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
      return { success: false, error: itemsError.message }
    }

    // Insert guest information
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
        return { success: false, error: guestsError.message }
      }
    }

    return { success: true, booking }
  } catch (error) {
    console.error('Error in createBooking:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get booking by reference
export async function getBookingByReference(
  supabase: SupabaseClient,
  reference: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        items:booking_items(*),
        guests:booking_guests(*)
      `)
      .eq('booking_reference', reference)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, booking }
  } catch (error) {
    console.error('Error in getBookingByReference:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get bookings by email
export async function getBookingsByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<{ success: boolean; bookings?: Booking[]; error?: string }> {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        items:booking_items(*)
      `)
      .eq('customer_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, bookings }
  } catch (error) {
    console.error('Error in getBookingsByEmail:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Update booking status
export async function updateBookingStatus(
  supabase: SupabaseClient,
  bookingId: number,
  status: Booking['status'],
  paymentStatus?: Booking['payment_status']
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { status }
    if (paymentStatus) {
      updateData.payment_status = paymentStatus
    }

    const { error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateBookingStatus:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Mark email as sent
export async function markEmailSent(
  supabase: SupabaseClient,
  bookingId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        email_sent: true,
        email_sent_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in markEmailSent:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Add communication record
export async function addCommunication(
  supabase: SupabaseClient,
  bookingId: number,
  communicationType: 'email' | 'phone' | 'whatsapp' | 'in_person',
  notes: string,
  staffMember?: string,
  outcome?: string,
  nextFollowUpDate?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('booking_communications')
      .insert({
        booking_id: bookingId,
        communication_type: communicationType,
        staff_member: staffMember,
        notes,
        outcome,
        next_follow_up_date: nextFollowUpDate
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in addCommunication:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 