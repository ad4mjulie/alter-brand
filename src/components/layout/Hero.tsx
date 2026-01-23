"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import CinematicText3D from '@/components/ui/CinematicText3D'
import Link from 'next/link'

export default function Hero({ dict, lang }: { dict: any, lang: string }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section ref={ref} className="h-screen w-full relative overflow-hidden flex items-center justify-center">
            {/* Background with Grain */}
            <div className="absolute inset-0 bg-[var(--background)] z-0">
                <svg className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay pointer-events-none">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.6" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-radial from-brand-crimson/10 to-transparent opacity-40" />
            </div>

            {/* Cinematic Text Reveal */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 text-center"
            >
                <CinematicText3D
                    text={dict.title}
                    /* 
                     * Unified Font Size (15vw): Deriving mobile size via .alter-title scaling.
                     * This ensures the logo is visually identical to desktop but scaled for mobile constraints.
                     */
                    className="font-serif text-[15vw] leading-none tracking-tighter justify-center alter-title w-full"
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    /* Responsive vertical stacking and spacing for subtitles */
                    className="mt-6 md:mt-8 flex flex-col items-center justify-center gap-2 md:gap-4 text-brand-crimson uppercase font-light"
                >
                    <div className="flex items-center gap-4 text-[10px] md:text-base tracking-[0.3em] md:tracking-[0.5em]">
                        <span className="hidden md:block w-12 h-[1px] bg-brand-crimson/50" />
                        <span>{dict.subtitle}</span>
                        <span className="hidden md:block w-12 h-[1px] bg-brand-crimson/50" />
                    </div>
                    {/* Added: Specific requirement for "Made for the streets" content */}
                    <div className="text-[10px] md:text-sm tracking-[0.4em] md:tracking-[0.6em] opacity-80">
                        {dict.subtitle2}
                    </div>
                </motion.div>

                {/* Added Call to Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mt-12 flex items-center justify-center"
                >
                    <Link
                        href={`/${lang}/shop`}
                        className="text-[var(--text-muted)] hover:text-[var(--foreground)] uppercase tracking-[0.3em] text-[10px] pb-1 border-b border-[var(--panel-border)] hover:border-brand-crimson transition-all"
                    >
                        {dict.browse}
                    </Link>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-charcoal"
            >
                <span className="text-[10px] tracking-widest uppercase">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-brand-charcoal to-transparent" />
            </motion.div>
        </section>
    )
}
