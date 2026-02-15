"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductOptions from './ProductOptions'
import AddToCartButton from './AddToCartButton'

export default function ProductClient({ product, dict }: { product: any, dict: any }) {
    const sizes = product.sizes ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : []
    const colors = product.colors ? product.colors.split(',').map((c: string) => c.trim()).filter(Boolean) : []

    const [selectedSize, setSelectedSize] = useState(sizes[0] || '')
    const [selectedColor, setSelectedColor] = useState(colors[0] || '')

    return (
        <div className="space-y-12">
            <div>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-brand-crimson text-sm uppercase tracking-[0.3em] mb-4"
                >
                    {product.category}
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-serif text-5xl md:text-7xl text-[var(--foreground)] mb-6"
                >
                    {product.name}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[var(--text-muted)] leading-relaxed max-w-lg"
                >
                    {product.description}
                </motion.p>
            </div>

            <ProductOptions
                sizes={sizes}
                colors={colors}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                dict={dict}
            />

            {/* TEMP DEBUG: Remove after fixing */}
            <div className="bg-black/10 p-4 font-mono text-xs mt-4">
                <p>Sizes: {JSON.stringify(sizes)}</p>
                <p>Colors: {JSON.stringify(colors)}</p>
                <p>Selected Size: "{selectedSize}"</p>
                <p>Selected Color: "{selectedColor}"</p>
            </div>

            <div className="pt-8">
                <AddToCartButton
                    product={product}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    dict={dict}
                />
            </div>

            <div className="space-y-4 pt-12 border-t border-[var(--panel-border)]">
                <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer text-xs uppercase tracking-widest text-[var(--foreground)] hover:text-brand-crimson transition-colors list-none">
                        <span>{dict.details}</span>
                        <span className="group-open:rotate-180 transition-transform">↓</span>
                    </summary>
                    <div className="pt-4 text-xs text-[var(--text-muted)] uppercase leading-loose">
                        • Handcrafted in Algeria<br />
                        • Premium high-density materials<br />
                        • Limited shadow edition
                    </div>
                </details>
            </div>
        </div>
    )
}
