"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ShoppingBag, ArrowRight, Zap } from 'lucide-react'

export default function OrderConfirmation({ order, dict, lang }: { order: any, dict: any, lang: string }) {
    const [ritualComplete, setRitualComplete] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setRitualComplete(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
            <AnimatePresence mode="wait">
                {!ritualComplete ? (
                    <motion.div
                        key="ritual"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        className="flex flex-col items-center gap-8"
                    >
                        <div className="relative w-24 h-24">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    boxShadow: ["0 0 20px rgba(138,3,3,0.2)", "0 0 50px rgba(138,3,3,0.5)", "0 0 20px rgba(138,3,3,0.2)"]
                                }}
                                transition={{ rotate: { duration: 10, repeat: Infinity, ease: "linear" }, boxShadow: { duration: 2, repeat: Infinity } }}
                                className="absolute inset-0 border border-brand-crimson/30 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border border-[var(--panel-border)] rounded-full border-dashed"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap className="text-brand-crimson animate-pulse" size={32} />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.8em] text-brand-crimson animate-pulse">Manifesting Ritual</p>
                            <p className="text-[8px] uppercase tracking-[0.4em] text-[var(--text-muted)]">#{order.id.split('-')[0].toUpperCase()}</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="max-w-2xl w-full"
                    >
                        {/* Header Section */}
                        <div className="mb-20 text-center md:text-left">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="font-serif text-6xl md:text-8xl text-[var(--foreground)] lowercase tracking-tighter mb-8 leading-none"
                            >
                                thank you <span className="text-[var(--text-muted)]">{order.fullName.split(' ')[0]}</span>.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-[var(--text-muted)] text-sm max-w-md mx-auto md:mx-0 leading-relaxed font-light"
                            >
                                {dict.successMessage}. your artifacts are now crossing the threshold into physical space.
                            </motion.p>
                        </div>

                        {/* Order Identity Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 }}
                            className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-8 md:p-12 backdrop-blur-xl relative overflow-hidden group mb-16"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-12">
                                    <div className="space-y-1">
                                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-brand-crimson font-bold">Identity Card</h2>
                                        <p className="text-[9px] uppercase tracking-[0.1em] text-[var(--text-muted)] font-mono">#{order.id.toUpperCase()}</p>
                                    </div>
                                    <Zap size={16} className="text-brand-crimson opacity-30" />
                                </div>

                                <div className="space-y-8 mb-12">
                                    {order.items.map((item: any, i: number) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 + (i * 0.1) }}
                                            key={item.id}
                                            className="flex justify-between items-center"
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-serif text-xl md:text-2xl text-[var(--foreground)] leading-tight">{item.name}</span>
                                                <div className="flex gap-4 items-center mt-1">
                                                    <span className="text-[9px] text-brand-crimson uppercase tracking-[0.2em]">{item.size}</span>
                                                    <span className="w-1 h-1 bg-[var(--panel-border)] rounded-full" />
                                                    <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">{item.quantity} Unit(s)</span>
                                                </div>
                                            </div>
                                            <span className="text-lg font-serif text-[var(--foreground)]/60">{(item.price * item.quantity).toLocaleString()} <span className="text-[10px]">DZD</span></span>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="border-t border-[var(--panel-border)]/50 pt-8 flex justify-between items-baseline">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">Total Manifestation</span>
                                    <span className="font-serif text-4xl text-[var(--foreground)]">{order.total.toLocaleString()} <span className="text-xs">DZD</span></span>
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-crimson/5 blur-3xl rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 blur-3xl rounded-full" />
                        </motion.div>

                        {/* Information Grid */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20"
                        >
                            <div className="space-y-4">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] text-brand-crimson font-bold">Coordinates</h3>
                                <div className="text-sm text-[var(--foreground)]/80 font-light space-y-1">
                                    <p className="text-lg font-serif">{order.fullName}</p>
                                    <p className="opacity-60">{order.address}</p>
                                    <p className="opacity-60 uppercase tracking-widest text-[10px]">{order.city}, {order.wilaya}</p>
                                    <p className="opacity-60 pt-2 font-mono">{order.phoneNumber}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] text-brand-crimson font-bold">Exchange Protocol</h3>
                                <p className="text-lg font-serif text-[var(--foreground)]/80">{dict.cod}</p>
                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest leading-relaxed">
                                    Payment will be collected upon ritual completion at your coordinates.
                                </p>
                            </div>
                        </motion.div>

                        {/* Navigation Actions */}
                        <div className="flex flex-col sm:flex-row gap-12 items-center justify-between border-t border-[var(--panel-border)] pt-12">
                            <Link
                                href={`/${lang}/shop`}
                                className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.5em] font-bold text-[var(--foreground)] hover:text-brand-crimson transition-all"
                            >
                                <ShoppingBag size={14} className="group-hover:scale-120 transition-transform" />
                                {dict.continueShopping}
                                <ArrowRight size={14} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>

                            <Link
                                href={`/${lang}/account`}
                                className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)] hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1"
                            >
                                {dict.viewOrders}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


        </main>
    )
}
