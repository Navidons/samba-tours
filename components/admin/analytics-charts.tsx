'use client'

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

export interface BookingTrend {
  date: string
  bookings: number
  revenue: number
}

interface BookingTrendChartProps {
  data: Array<{
    date?: string
    bookings?: number
    revenue?: number
  }>
}

// Utility function to safely convert and validate numeric values
function safeNumber(value: number | string | undefined, defaultValue: number = 0): number {
  if (value === undefined || value === null || (typeof value === 'string' && (value.trim() === '' || value.toLowerCase() === 'undefined' || value.toLowerCase() === 'null'))) {
    return defaultValue;
  }
  
  const num = typeof value === 'string' 
    ? parseFloat(value.replace(/[^0-9.-]+/g, '')) 
    : Number(value)
  
  // Ensure no NaN comes out, especially if replace fails or input is problematic
  return isNaN(num) ? defaultValue : num
}

export function BookingTrendChart({ data }: BookingTrendChartProps) {
  // Validate and prepare data for chart
  const chartData = (data || [])
    .filter(item => item && item.date)
    .map(item => ({
      date: item.date 
        ? new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }) 
        : 'Unknown',
      bookings: safeNumber(item.bookings),
      revenue: safeNumber(item.revenue)
    }))
    .filter(item => 
      item.date !== 'Unknown' && 
      !isNaN(item.bookings) && 
      !isNaN(item.revenue) // Explicitly filter out NaN here
    )

  // If no valid data, return a placeholder
  if (chartData.length === 0) {
    console.warn('BookingTrendChart: No valid data to display.')
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No booking data available
      </div>
    )
  }

  console.log('BookingTrendChart: Prepared chart data:', chartData)
  // Assertion: Ensure all numerical values are actual numbers
  chartData.forEach((d, i) => {
    console.assert(typeof d.bookings === 'number' && !isNaN(d.bookings), `BookingTrendChart: bookings at index ${i} is not a valid number: ${d.bookings}`);
    console.assert(typeof d.revenue === 'number' && !isNaN(d.revenue), `BookingTrendChart: revenue at index ${i} is not a valid number: ${d.revenue}`);
  });

  // Determine max values for Y-axis domains to handle all-zero data
  const maxBookings = Math.max(...chartData.map(d => d.bookings));
  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  // Combine conditional props for Y-axes
  const bookingsYAxisCombinedProps = maxBookings === 0 ? 
    { domain: [0, 1], ticks: [0, 1], allowDecimals: false, tick: false, tickFormatter: (value: number) => '0', allowDataOverflow: true } : 
    { domain: [0, Math.ceil(maxBookings * 1.1)], tickFormatter: (value: number) => value.toFixed(0) }; // Explicit domain for non-zero

  const revenueYAxisCombinedProps = maxRevenue === 0 ? 
    { domain: [0, 1], ticks: [0, 1], allowDecimals: false, tick: false, tickFormatter: (value: number) => '0', allowDataOverflow: true } : 
    { domain: [0, Math.ceil(maxRevenue * 1.1)], tickFormatter: (value: number) => `$${value.toFixed(0)}` }; // Explicit domain for non-zero

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" />
        <YAxis 
          yAxisId="bookings" 
          label={{ 
            value: 'Bookings', 
            angle: -90, 
            position: 'insideLeft' 
          }} 
          scale="linear"
          {...bookingsYAxisCombinedProps}
        />
        <YAxis 
          yAxisId="revenue" 
          orientation="right" 
          label={{ 
            value: 'Revenue', 
            angle: 90, 
            position: 'insideRight',
            offset: -25
          }}
          scale="linear"
          {...revenueYAxisCombinedProps}
        />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'revenue') {
              return [`$${Number(value).toFixed(0)}`, 'Revenue']
            }
            return [value, 'Bookings']
          }}
        />
        <Legend />
        <Bar 
          yAxisId="bookings" 
          dataKey="bookings" 
          fill="#8884d8" 
          name="Bookings" 
        />
        <Bar 
          yAxisId="revenue" 
          dataKey="revenue" 
          fill="#82ca9d" 
          name="Revenue" 
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 