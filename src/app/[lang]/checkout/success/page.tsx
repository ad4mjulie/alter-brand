import { getOrderById } from '@/app/actions/orders'
import OrderConfirmation from '@/components/checkout/OrderConfirmation'
import { getDictionary, Locale } from '@/lib/dictionaries'
import { redirect } from 'next/navigation'

export default async function SuccessPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>
    searchParams: Promise<{ id?: string }>
}) {
    const { lang } = await params
    const { id: orderId } = await searchParams
    const dict = await getDictionary(lang as Locale)

    if (!orderId) {
        redirect(`/${lang}/shop`)
    }

    const { success, order, error } = await getOrderById(orderId)

    if (!success || !order) {
        // Log error if needed, but for now redirect back to shop if order doesn't exist
        redirect(`/${lang}/shop`)
    }

    return (
        <OrderConfirmation
            order={order}
            dict={dict.confirmation}
            lang={lang}
        />
    )
}
