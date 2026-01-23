import Hero from '@/components/layout/Hero'
import FeaturedCollection from '@/components/shop/FeaturedCollection'
import { getDictionary, Locale } from '@/lib/dictionaries'
import { db } from '@/lib/db'

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = await getDictionary(lang as Locale)

  const featuredProducts = await db.product.findMany({
    take: 3,
    include: { images: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <main className="min-h-screen bg-[var(--background)] selection:bg-brand-crimson selection:text-white">
      <Hero dict={dict.home} lang={lang} />
      <FeaturedCollection
        dict={dict.shop}
        lang={lang}
        products={featuredProducts.map(p => ({
          ...p,
          image: p.images[0]?.url || '/placeholder.jpg'
        }))}
      />

      {/* Refined CTA & Credits Section */}
      <div className="w-full flex flex-col items-center justify-center py-8 border-t border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-sm text-[var(--foreground)] text-center gap-2">
        <p className="font-serif text-base tracking-[0.25em] uppercase font-bold text-[var(--foreground)]">
          More Darkness Awaits
        </p>
        <p className="text-[10px] tracking-[0.10em] font-medium uppercase text-[var(--text-muted)]">
          © 2026 — made by a human, adam
        </p>
      </div>
    </main>
  )
}
