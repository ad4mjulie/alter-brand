"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import NextImage from 'next/image'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function CartDrawer({ lang, dict }: { lang: string, dict: any }) {
    const { items, isOpen, setIsOpen, removeFromCart, total } = useCart()

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-[var(--backdrop-bg)] backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        /* Language-aware translation direction for slide animation */
                        initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        /* Translucent panel with narrowed width and backdrop blur. */
                        className="fixed end-0 top-0 h-full w-full md:max-w-[320px] max-w-[280px] bg-[var(--panel-bg)] backdrop-blur-md border-s border-[var(--panel-border)] z-50 flex flex-col shadow-2xl"
                    >
                        <div className="p-6 border-b border-[var(--panel-border)] flex items-center justify-between">
                            <h2 className="font-serif text-xl text-brand-silver">{dict.title}</h2>
                            <button onClick={() => setIsOpen(false)} className="text-brand-silver/60 hover:text-brand-crimson transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] text-center">
                                    <p className="font-serif text-lg">{dict.empty}</p>
                                    <p className="text-xs uppercase tracking-widest mt-2">{dict.emptySub}</p>
                                </div>
                            ) : (
                                items.map(item => (
                                    <div key={item.id} className="flex gap-4 bg-[var(--card-bg)] p-4 border border-[var(--panel-border)]">
                                        <div className="relative w-20 aspect-[3/4] bg-[var(--card-bg)] flex-shrink-0">
                                            {item.image && item.image !== '/placeholder.jpg' ? (
                                                <NextImage
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover opacity-60"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] opacity-20 text-[10px] font-serif">
                                                    ALTER
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-brand-silver/90 font-serif">{item.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {item.size && <span className="text-[10px] bg-[var(--card-bg)] text-[var(--text-muted)] px-2 py-0.5 uppercase tracking-widest">{item.size}</span>}
                                                    {item.color && (
                                                        <div
                                                            className="w-3 h-3 rounded-full border border-black/10"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-brand-crimson text-sm font-sans mt-2">{item.price} DZD</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-brand-silver/60">QTY: {item.quantity}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-[var(--text-muted)] hover:text-brand-crimson transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-6 border-t border-[var(--panel-border)] bg-[var(--card-bg)]">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[var(--text-muted)] uppercase tracking-widest text-sm">{dict.total}</span>
                                    <span className="text-brand-crimson font-serif text-2xl">{total} DZD</span>
                                </div>
                                <Link
                                    href={`/${lang}/checkout`}
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full py-4 bg-black text-white hover:bg-brand-crimson transition-colors uppercase tracking-[0.2em] font-bold text-sm text-center"
                                >
                                    {dict.checkout}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
