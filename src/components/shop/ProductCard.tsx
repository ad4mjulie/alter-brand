"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

interface ProductProps {
    id: string
    slug: string
    name: string
    price: number
    image: string
    category: string
}

export default function ProductCard({ product, dict, lang }: { product: ProductProps, dict: any, lang: string }) {
    const { addToCart } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Default to first variant if adding from card
        addToCart(product, 'M', '#050505')
    }

    return (
        <div className="group relative block cursor-pointer">
            <Link href={`/${lang}/product/${product.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--card-bg)]">
                    {/* Hover Ritual: Glow Effect */}
                    <div className="absolute inset-0 bg-brand-crimson/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay" />

                    {/* Product Image */}
                    <div className="w-full h-full bg-neutral-900 group-hover:scale-105 transition-transform duration-700 ease-out">
                        {product.image && product.image !== '/placeholder.jpg' ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                <span className="text-4xl font-serif opacity-20">{product.name[0]}</span>
                            </div>
                        )}
                    </div>

                    {/* Sigil Reveal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                        <div className="w-16 h-16 border border-[var(--panel-border)] rounded-full flex items-center justify-center rotate-45">
                            <div className="w-10 h-10 border border-[var(--panel-border)] opacity-30" />
                        </div>
                    </motion.div>

                    {/* Add to Cart Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-30">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] font-sans uppercase tracking-widest text-xs hover:bg-brand-crimson hover:text-white transition-colors"
                        >
                            {dict.addToCart}
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-[var(--foreground)] font-serif tracking-wide group-hover:text-brand-crimson transition-colors">{product.name}</h3>
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mt-1">{product.category}</p>
                    </div>
                    <span className="text-[var(--foreground)] font-sans text-sm">{product.price} DZD</span>
                </div>
            </Link>
        </div>
    )
}
