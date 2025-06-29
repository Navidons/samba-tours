import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Tour Management - Samba Tours Admin",
  description: "Manage all tour packages and itineraries.",
}

export default function ToursLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      {children}
    </>
  )
} 
