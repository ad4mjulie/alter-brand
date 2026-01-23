import { db } from '@/lib/db'
import { getDictionary, Locale } from '@/lib/dictionaries'
import { notFound } from 'next/navigation'
import ProductGallery from '@/components/product/ProductGallery'
import ProductClient from '@/components/product/ProductClient'
import BackButton from '@/components/ui/BackButton'

export default async function ProductPage({ params }: { params: Promise<{ lang: string, slug: string }> }) {
    const { lang, slug } = await params
    const dict = await getDictionary(lang as Locale)

    const product = await db.product.findUnique({
        where: { slug },
        include: { images: true }
    })

    if (!product) notFound()

    return (
        <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <BackButton />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left: Gallery */}
                    <ProductGallery images={product.images} />

                    {/* Right: Info */}
                    <ProductClient product={product} dict={dict.product} />
                </div>

                {/* Related Products Placeholder */}
                <div className="max-w-7xl mx-auto mt-32 border-t border-[var(--panel-border)] pt-20">
                    <h2 className="font-serif text-3xl text-[var(--foreground)] mb-12 uppercase tracking-widest">{dict.product.related}</h2>
                    <p className="text-[var(--text-muted)] text-sm uppercase tracking-tighter">More shadows approaching...</p>
                </div>
            </div>
        </main>
    )
}
