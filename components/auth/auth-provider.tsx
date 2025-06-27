'use client'

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: any | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<any> => {
    setLoading(true) // Indicate login attempt starts

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setLoading(false) // Set loading false if immediate error
      throw error // Let the calling component handle the error
    }

    // Wait for the onAuthStateChange listener to update the user state
    // This is the critical part to ensure state is propagated before redirect
    return new Promise((resolve) => {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            // The main useEffect listener will set `user` and `loading=false`
            // We just need to resolve this Promise once we know the state is updated
            authListener.subscription.unsubscribe(); // Stop listening after successful login
            resolve(session.user); // Resolve with the user object
          }
        }
      );
    });
  }

  const logout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    if (error) throw error
    router.push('/signin') // Redirect to signin after logout
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 