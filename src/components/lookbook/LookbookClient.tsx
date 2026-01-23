"use client"

import { motion } from 'framer-motion'

const LOOKS = [
    { id: 1, title: "The Void Walker", image: "/placeholder.jpg" },
    { id: 2, title: "Crimson Ritual", image: "/placeholder.jpg" },
    { id: 3, title: "Nocturnal Silence", image: "/placeholder.jpg" },
]

export default function LookbookClient({ dict }: { dict: any }) {
    return (
        <main className="min-h-screen bg-[var(--background)]">
            <div className="h-screen w-full flex items-center justify-center relative">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-[12vw] font-serif text-[var(--foreground)] opacity-5 absolute z-0 select-none"
                >
                    {dict.navigation.lookbook}
                </motion.h1>

                <div className="relative z-10 w-full h-full overflow-x-auto flex items-center gap-12 px-12 snap-x snap-mandatory scrollbar-none">
                    {LOOKS.map((look, index) => (
                        <motion.div
                            key={look.id}
                            className="flex-shrink-0 w-[80vw] md:w-[40vw] h-[70vh] bg-[var(--panel-bg)] border border-[var(--panel-border)] relative snap-center group"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.3 }}
                        >
                            {/* Image Placeholder */}
                            <div className="w-full h-full flex items-center justify-center bg-[var(--background)] group-hover:bg-[var(--panel-bg)] transition-colors duration-700">
                                <span className="text-[var(--text-muted)] font-serif text-4xl">{look.id}</span>
                            </div>

                            <div className="absolute bottom-6 left-6">
                                <h2 className="text-[var(--foreground)] font-serif text-2xl">{look.title}</h2>
                                <p className="text-brand-crimson text-xs uppercase tracking-widest">{dict.common.season}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </main>
    )
}
