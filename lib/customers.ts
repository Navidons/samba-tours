import { SupabaseClient } from '@supabase/supabase-js'

export interface Customer {
  id?: number
  name: string
  email: string
  phone?: string
  country?: string
  total_bookings: number
  total_spent: number
  first_booking_date?: string
  last_booking_date?: string
  status: 'active' | 'inactive' | 'blocked'
  join_date?: string
  updated_at?: string
  notes?: string
  preferred_contact_method?: string
  preferred_contact_time?: string
  customer_type: 'regular' | 'vip' | 'repeat' | 'new'
  loyalty_points: number
  average_order_value: number
}

export interface CustomerBookingHistory {
  id?: number
  customer_id: number
  booking_id: number
  booking_reference: string
  tour_title?: string
  amount: number
  booking_date: string
  travel_date?: string
  status: string
  payment_status: string
}

// Fetch all customers
export async function getAllCustomers(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('last_booking_date', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
  }
}

// Fetch customer by email
export async function getCustomerByEmail(supabase: SupabaseClient, email: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error fetching customer:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching customer:', error)
    return null
  }
}

// Fetch customer with booking history
export async function getCustomerWithHistory(supabase: SupabaseClient, customerId: number) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        booking_history:customer_booking_history(*)
      `)
      .eq('id', customerId)
      .single()

    if (error) {
      console.error('Error fetching customer with history:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching customer with history:', error)
    return null
  }
}

// Create new customer
export async function createCustomer(supabase: SupabaseClient, customerData: Partial<Customer>) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error creating customer:', error)
    return { success: false, error: 'Failed to create customer' }
  }
}

// Update customer
export async function updateCustomer(supabase: SupabaseClient, customerId: number, updates: Partial<Customer>) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', customerId)
      .select()
      .single()

    if (error) {
      console.error('Error updating customer:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error updating customer:', error)
    return { success: false, error: 'Failed to update customer' }
  }
}

// Add customer booking history
export async function addCustomerBookingHistory(
  supabase: SupabaseClient, 
  historyData: Partial<CustomerBookingHistory>
) {
  try {
    const { data, error } = await supabase
      .from('customer_booking_history')
      .insert([historyData])
      .select()
      .single()

    if (error) {
      console.error('Error adding booking history:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error adding booking history:', error)
    return { success: false, error: 'Failed to add booking history' }
  }
}

// Get customer statistics
export async function getCustomerStats(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('total_bookings, total_spent, customer_type, status')

    if (error) {
      console.error('Error fetching customer stats:', error)
      return null
    }

    const stats = {
      totalCustomers: data?.length || 0,
      activeCustomers: data?.filter(c => c.status === 'active').length || 0,
      totalRevenue: data?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0,
      averageOrderValue: data?.length ? 
        data.reduce((sum, c) => sum + (c.total_spent || 0), 0) / data.length : 0,
      vipCustomers: data?.filter(c => c.customer_type === 'vip').length || 0,
      repeatCustomers: data?.filter(c => c.customer_type === 'repeat').length || 0,
      newCustomers: data?.filter(c => c.customer_type === 'new').length || 0
    }

    return stats
  } catch (error) {
    console.error('Error fetching customer stats:', error)
    return null
  }
}

// Search customers
export async function searchCustomers(supabase: SupabaseClient, query: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('last_booking_date', { ascending: false })

    if (error) {
      console.error('Error searching customers:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error searching customers:', error)
    return []
  }
}

// Filter customers by type
export async function filterCustomersByType(supabase: SupabaseClient, customerType: string) {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('customer_type', customerType)
      .order('last_booking_date', { ascending: false })

    if (error) {
      console.error('Error filtering customers:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error filtering customers:', error)
    return []
  }
}

// Export customers to CSV
export function exportCustomersToCSV(customers: Customer[]) {
  const csvContent = [
    ['Name', 'Email', 'Phone', 'Country', 'Total Bookings', 'Total Spent', 'Customer Type', 'Status', 'Join Date'],
    ...customers.map(customer => [
      customer.name,
      customer.email,
      customer.phone || '',
      customer.country || '',
      customer.total_bookings.toString(),
      `$${customer.total_spent.toFixed(2)}`,
      customer.customer_type,
      customer.status,
      customer.join_date ? new Date(customer.join_date).toLocaleDateString() : ''
    ])
  ].map(row => row.join(',')).join('\n')

  return csvContent
} 
