"use client"

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BackButton({ label }: { label?: string }) {
    const router = useRouter()

    return (
        <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-brand-crimson transition-colors group mb-6"
        >
            <div className="w-8 h-8 rounded-full border border-[var(--panel-border)] flex items-center justify-center group-hover:border-brand-crimson transition-colors">
                <ArrowLeft size={16} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform text-[var(--foreground)] group-hover:text-brand-crimson" />
            </div>
            {label && (
                <span className="text-[10px] uppercase tracking-widest font-medium">
                    {label}
                </span>
            )}
        </motion.button>
    )
}
