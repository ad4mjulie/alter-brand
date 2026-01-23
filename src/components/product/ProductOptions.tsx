"use client"

import { motion } from 'framer-motion'

export default function ProductOptions({
    sizes,
    colors,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    dict
}: {
    sizes: string[]
    colors: string[]
    selectedSize: string
    setSelectedSize: (size: string) => void
    selectedColor: string
    setSelectedColor: (color: string) => void
    dict: any
}) {
    return (
        <div className="space-y-8">
            {/* Colors */}
            <div>
                <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">{dict.color}</h3>
                <div className="flex gap-4">
                    {colors.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 ${selectedColor === color ? 'border-brand-crimson scale-110 lg:scale-125' : 'border-[var(--panel-border)]'
                                }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Sizes */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.size}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-6 py-3 border text-sm uppercase tracking-widest transition-all ${selectedSize === size
                                ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]'
                                : 'border-[var(--panel-border)] text-[var(--text-muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
