"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    size?: string
    color?: string
}

interface CartContextType {
    items: CartItem[]
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    addToCart: (product: any, size?: string, color?: string) => void
    removeFromCart: (clientId: string) => void
    total: number
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem('cart')
        if (saved) setItems(JSON.parse(saved))
    }, [])

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(items))
        }
    }, [items, isMounted])

    const addToCart = (product: any, size?: string, color?: string) => {
        setItems(prev => {
            // Unique identifier for the specific variant in the cart
            const clientId = `${product.id}-${size || 'na'}-${color || 'na'}`

            const existing = prev.find(item => item.id === clientId)
            if (existing) {
                return prev.map(item =>
                    item.id === clientId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, {
                ...product,
                id: clientId, // Overwriting ID for cart tracking
                productId: product.id, // Keeping original ID
                quantity: 1,
                size,
                color
            }]
        })
        setIsOpen(true)
    }

    const removeFromCart = (clientId: string) => {
        setItems(prev => prev.filter(item => item.id !== clientId))
    }

    const clearCart = () => {
        setItems([])
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div suppressHydrationWarning>
            <CartContext.Provider value={{ items, isOpen, setIsOpen, addToCart, removeFromCart, total, clearCart }}>
                {children}
            </CartContext.Provider>
        </div>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
}
