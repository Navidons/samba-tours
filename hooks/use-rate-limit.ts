import { useState, useCallback, useMemo } from 'react'

interface RateLimitOptions {
  maxAttempts: number
  windowMs: number
}

export function useRateLimit(options: RateLimitOptions = { maxAttempts: 5, windowMs: 60000 }) {
  const [attempts, setAttempts] = useState<number[]>([])

  // Calculate rate limiting status without causing re-renders
  const rateLimitStatus = useMemo(() => {
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Filter attempts within the window
    const recentAttempts = attempts.filter(timestamp => timestamp > windowStart)
    const isLimited = recentAttempts.length >= options.maxAttempts
    const remainingAttempts = Math.max(0, options.maxAttempts - recentAttempts.length)
    
    return {
      isLimited,
      remainingAttempts,
      recentAttempts
    }
  }, [attempts, options.maxAttempts, options.windowMs])

  const recordAttempt = useCallback(() => {
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    setAttempts(prev => {
      // Remove old attempts outside the window and add new attempt
      const filteredAttempts = prev.filter(timestamp => timestamp > windowStart)
      return [...filteredAttempts, now]
    })
  }, [options.windowMs])

  const resetAttempts = useCallback(() => {
    setAttempts([])
  }, [])

  return {
    isRateLimited: rateLimitStatus.isLimited,
    recordAttempt,
    resetAttempts,
    remainingAttempts: rateLimitStatus.remainingAttempts
  }
} 