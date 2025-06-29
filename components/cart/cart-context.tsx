"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'

export interface CartItem {
  id: number | string
  title: string
  price: number
  travelers: number  // Number of travelers for this booking
  maxTravelers?: number  // Maximum allowed travelers for this tour
  image?: string
  metadata?: {
    travelDate?: string
    location?: string
    duration?: string
  }
}

interface RemoveCartItem {
  id: number | string
  travelDate?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: CartItem) => boolean
  removeFromCart: (item: RemoveCartItem | RemoveCartItem[]) => void
  updateTravelers: (itemId: number | string, travelers: number) => void
  clearCart: () => void
  getTotalItems: () => number  // Number of unique bookings
  getTotalTravelers: () => number  // Total number of travelers
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
    console.log('Cart updated:', cart)
  }, [cart])

  const addToCart = (newItem: CartItem): boolean => {
    let added = false;
    setCart(prevCart => {
      // Check if an identical item (same ID and travel date) already exists
      const exists = prevCart.some(
        item => 
          item.id === newItem.id && 
          item.metadata?.travelDate === newItem.metadata?.travelDate
      )
      if (exists) {
        // Do not add or update
        added = false;
        return prevCart;
      }
      // If no identical item exists, add new item
      added = true;
      return [...prevCart, newItem]
    })
    return added;
  }

  const removeFromCart = (item: RemoveCartItem | RemoveCartItem[]) => {
    setCart(prevCart => {
      if (Array.isArray(item)) {
        return prevCart.filter(cartItem =>
          !item.some(rm => cartItem.id === rm.id && cartItem.metadata?.travelDate === rm.travelDate)
        )
      }
      return prevCart.filter(cartItem =>
        !(cartItem.id === item.id && cartItem.metadata?.travelDate === item.travelDate)
      )
    })
  }

  const updateTravelers = (itemId: number | string, travelers: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              travelers: Math.max(0, travelers),
              // Ensure travelers doesn't exceed maxTravelers if specified
              ...(item.maxTravelers ? { travelers: Math.min(travelers, item.maxTravelers) } : {})
            } 
          : item
      ).filter(item => item.travelers > 0)
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalItems = () => {
    // Number of unique bookings
    return cart.length
  }

  const getTotalTravelers = () => {
    // Total number of travelers across all bookings
    return cart.reduce((total, item) => total + item.travelers, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.travelers), 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateTravelers,
      clearCart,
      getTotalItems,
      getTotalTravelers,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 