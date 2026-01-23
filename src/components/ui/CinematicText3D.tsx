"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import clsx from "clsx"

interface CinematicText3DProps {
    text: string
    className?: string
}

export default function CinematicText3D({ text, className }: CinematicText3DProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const characters = text.split("")

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const charVariants = {
        hidden: {
            opacity: 0,
            rotateX: 90,
            y: 50
        },
        visible: {
            opacity: 1,
            rotateX: 0,
            y: 0,
            transition: {
                type: "spring" as any,
                damping: 15,
                stiffness: 100
            }
        },
        hover: {
            rotateX: 360,
            textShadow: "0 0 20px rgba(138, 3, 3, 0.8)", // Crimson glow
            color: "#8a0303",
            transition: {
                duration: 0.8,
                ease: "easeInOut" as any
            }
        }
    }

    return (
        <motion.div
            className={clsx("flex perspective-text select-none cursor-pointer", className)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            dir="ltr"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {characters.map((char, i) => (
                <motion.span
                    key={i}
                    variants={charVariants}
                    whileHover="hover"
                    animate={{
                        rotateY: isFlipped ? 360 : 0,
                    }}
                    transition={{
                        rotateY: { duration: 0.8, ease: "easeInOut", delay: i * 0.05 }
                    }}
                    className="relative inline-block transform-style-3d"
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden"
                    }}
                >
                    {/* Front Face (Main Text) */}
                    <span className="block text-[var(--foreground)]">
                        {char === " " ? "\u00A0" : char}
                    </span>

                    {/* Top Face (Depth) */}
                    <span
                        className="absolute top-0 left-0 w-full h-full text-brand-crimson origin-bottom -rotate-x-90 translate-z-[0.5em] opacity-80"
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>

                    {/* Bottom Face (Shadow/Depth) */}
                    <span
                        className="absolute top-0 left-0 w-full h-full text-brand-crimson/50 origin-top rotate-x-90 translate-z-[0.5em]"
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                </motion.span>
            ))}
        </motion.div>
    )
}
