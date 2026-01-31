"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export default function OrderConfirmation({ order, dict, lang }: { order: any, dict: any, lang: string }) {
    return (
        <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-6 py-20">
            <div className="max-w-2xl w-full">
                {/* Minimal Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <p className="text-brand-crimson text-[10px] uppercase tracking-[0.4em] mb-4">Confirmed</p>
                    <h1 className="font-serif text-5xl md:text-7xl text-[var(--foreground)] lowercase tracking-tighter mb-6 leading-none">
                        {dict.thankYou.split(' ')[0]} <span className="text-[var(--text-muted)]">{order.fullName.split(' ')[0]}</span>.
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm max-w-md leading-relaxed">
                        {dict.successMessage}. we're preparing your artifacts for their physical manifestation.
                    </p>
                </motion.div>

                {/* Simplified Order Details */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="space-y-12 mb-20"
                >
                    <div className="border-t border-[var(--panel-border)] pt-8">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Manifestation details</h2>
                            <span className="text-[10px] font-mono text-[var(--text-muted)] opacity-50">#{order.id.split('-')[0].toUpperCase()}</span>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex justify-between items-center group">
                                    <div className="flex items-baseline gap-4">
                                        <span className="font-serif text-lg text-[var(--foreground)]">{item.name}</span>
                                        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{item.size}</span>
                                    </div>
                                    <span className="text-sm font-light text-[var(--foreground)]/60">{item.price * item.quantity} DZD</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-baseline border-t border-[var(--panel-border)] pt-8">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Total investment</span>
                        <span className="font-serif text-3xl text-brand-crimson">{order.total} DZD</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-[var(--panel-border)]">
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Destination</h3>
                            <div className="text-sm text-[var(--foreground)]/80 space-y-1">
                                <p>{order.address}</p>
                                <p>{order.city}, {order.wilaya}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4">Method</h3>
                            <p className="text-sm text-[var(--foreground)]/80">{dict.cod}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-8 items-center"
                >
                    <Link
                        href={`/${lang}/shop`}
                        className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--foreground)] hover:text-brand-crimson transition-colors"
                    >
                        <ShoppingBag size={14} />
                        {dict.continueShopping}
                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>

                    <div className="h-px w-12 bg-[var(--panel-border)] hidden sm:block" />

                    <Link
                        href={`/${lang}/account`}
                        className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                        {dict.viewOrders}
                    </Link>
                </motion.div>

                {/* Minimal Footer Signature */}
                <div className="mt-32 pt-8 border-t border-[var(--panel-border)]/20 flex justify-between items-center opacity-30">
                    <span className="font-serif text-xs tracking-[0.5em] uppercase">ALTER</span>
                    <span className="text-[8px] uppercase tracking-widest">2026</span>
                </div>
            </div>
        </main>
    )
}
