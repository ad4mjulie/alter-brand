"use client"

import { useCart } from '@/context/CartContext'

export default function AddToCartButton({
    product,
    selectedSize,
    selectedColor,
    dict
}: {
    product: any
    selectedSize: string
    selectedColor: string
    dict: any
}) {
    const { addToCart } = useCart()

    const handleAdd = () => {
        if (!selectedSize || !selectedColor) {
            alert(selectedSize ? 'Please select a color' : 'Please select a size')
            return
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0]?.url || '/placeholder.jpg'
        }, selectedSize, selectedColor)
    }

    return (
        <button
            onClick={handleAdd}
            className="w-full py-5 bg-[var(--foreground)] text-[var(--background)] uppercase tracking-[0.2em] font-bold text-sm hover:bg-brand-crimson hover:text-white transition-all transform active:scale-95 shadow-lg"
        >
            {dict.addToCart} • {product.price} DZD
        </button>
    )
}
