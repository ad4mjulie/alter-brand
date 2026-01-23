import { getDictionary, Locale } from '@/lib/dictionaries'
import LookbookClient from '@/components/lookbook/LookbookClient'

export default async function LookbookPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang as Locale)

    return <LookbookClient dict={dict} />
}
