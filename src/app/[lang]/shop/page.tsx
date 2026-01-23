import ProductCard from '@/components/shop/ProductCard'
import { getDictionary, Locale } from '@/lib/dictionaries'
import { db } from '@/lib/db'

export default async function ShopPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang as Locale)

    const [products, collections] = await Promise.all([
        db.product.findMany({
            include: { images: true },
            orderBy: { createdAt: 'desc' }
        }),
        db.collection.findMany({
            orderBy: { name: 'asc' }
        })
    ])

    return (
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 px-6 md:px-12 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 border-b border-[var(--panel-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-2">{dict.shop.title}</h1>
                        <p className="text-brand-crimson text-xs uppercase tracking-[0.2em]">{dict.shop.subtitle}</p>
                    </div>

                    {/* Collections Navigation */}
                    <div id="collections" className="flex flex-wrap gap-4">
                        {collections.map((c) => (
                            <a
                                key={c.id}
                                href={`/${lang}/collection/${c.slug}`}
                                className="px-4 py-2 border border-[var(--panel-border)] text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)] hover:border-brand-crimson transition-all"
                            >
                                {c.name}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {products.map((product: any) => (
                        <div key={product.id}>
                            <ProductCard
                                product={{
                                    ...product,
                                    image: product.images[0]?.url || '/placeholder.jpg'
                                }}
                                dict={dict.shop}
                                lang={lang}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
