"use client"

import { motion } from 'framer-motion'

export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 bg-[var(--background)] border-t border-[var(--panel-border)] flex flex-col items-center gap-4 text-center">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex flex-col gap-2"
            >
                <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-[0.3em] font-medium">
                    © 2026 — made by a human, adam
                </p>
            </motion.div>
        </footer>
    )
}
