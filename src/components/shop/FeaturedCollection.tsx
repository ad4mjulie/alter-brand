"use client"

import ProductCard from './ProductCard'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FeaturedCollection({ dict, lang, products }: { dict: any, lang: string, products: any[] }) {
    return (
        <section className="py-32 px-6 md:px-12 bg-[var(--background)] relative z-10 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 flex items-end justify-between border-b border-[var(--panel-border)] pb-6"
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-2">{dict.title}</h2>
                        <p className="text-brand-crimson text-xs uppercase tracking-[0.2em]">{dict.subtitle}</p>
                    </div>
                    <Link
                        href={`/${lang}/shop`}
                        className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-brand-crimson transition-colors group"
                    >
                        <span>{dict.viewAll}</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                        >
                            <ProductCard product={product} dict={dict} lang={lang} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center md:hidden">
                    <Link
                        href={`/${lang}/shop`}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] py-2 border-b border-brand-crimson/50"
                    >
                        {dict.viewAll}
                    </Link>
                </div>
            </div>
        </section>
    )
}
