import ProductCard from '@/components/shop/ProductCard'
import { getDictionary, Locale } from '@/lib/dictionaries'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/ui/BackButton'

export default async function CollectionPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang as Locale)

    const collection = await db.collection.findUnique({
        where: { slug },
        include: {
            products: {
                include: { images: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!collection) notFound()

    return (
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 border-b border-[var(--panel-border)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <BackButton />
                        <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mb-2">{collection.name}</h1>
                        <p className="text-brand-crimson text-xs uppercase tracking-[0.2em]">{collection.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {collection.products.length > 0 ? (
                        collection.products.map((product: any) => (
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
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-[var(--text-muted)] opacity-30 uppercase tracking-[0.3em] font-serif text-xl italic">
                                This portal is currently empty...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
