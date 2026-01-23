"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function ProductGallery({ images }: { images: { url: string }[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-[3/4] bg-[var(--panel-bg)]/20 overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        <Image
                            src={images[currentIndex]?.url || '/placeholder.jpg'}
                            alt="Product Image"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Overlay */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="bg-[var(--background)]/50 text-[var(--foreground)] p-2 rounded-full hover:bg-brand-crimson hover:text-white transition-colors backdrop-blur-sm"
                    >
                        &larr;
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="bg-[var(--background)]/50 text-[var(--foreground)] p-2 rounded-full hover:bg-brand-crimson hover:text-white transition-colors backdrop-blur-sm"
                    >
                        &rarr;
                    </button>
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative w-24 aspect-[3/4] flex-shrink-0 border-2 transition-colors ${currentIndex === idx ? 'border-brand-crimson' : 'border-transparent'
                            }`}
                    >
                        <Image
                            src={img.url}
                            alt={`Thumbnail ${idx}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
}
