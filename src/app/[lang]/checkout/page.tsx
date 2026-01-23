import { getDictionary, Locale } from '@/lib/dictionaries'
import CheckoutClient from '@/components/checkout/CheckoutClient'

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang as Locale)

    return (
        <CheckoutClient
            lang={lang}
            dict={dict.checkout}
            cartDict={dict.cart}
        />
    )
}
