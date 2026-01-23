import { getDictionary, Locale } from '@/lib/dictionaries'

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang as Locale)

    return (
        <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden transition-colors duration-500">
            {/* Background Noise */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg className="w-full h-full mix-blend-overlay">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" stitchTiles="stitch" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            <div className="max-w-4xl text-center relative z-10 font-serif text-[var(--foreground)] text-xl md:text-2xl leading-relaxed">
                <p className="mb-8">
                    {dict.about.paragraph1}
                </p>
                <p>
                    {dict.about.paragraph2}
                </p>
            </div>
        </main>
    )
}
