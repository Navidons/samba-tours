"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { SystemMonitorError, createSystemLog } from "@/lib/system-error-handler"

export default function SystemRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Revalidate the current page
      router.refresh()
      toast.success("System monitor refreshed successfully")
    } catch (error) {
      // Create a standardized system log
      const systemLog = createSystemLog(
        error instanceof Error 
          ? error 
          : new SystemMonitorError(
              'Unexpected refresh error', 
              'REFRESH_FAILED', 
              'System Refresh'
            )
      )

      // Display user-friendly toast
      toast.error(systemLog.message)

      // Log detailed error for debugging
      console.error('System refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh} 
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </Button>
  )
} 