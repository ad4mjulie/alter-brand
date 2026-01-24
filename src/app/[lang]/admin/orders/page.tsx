import { getOrders } from '@/app/actions/admin'
import AdminOrdersClient from '@/components/admin/AdminOrdersClient'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function AdminOrdersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    const session = await getSession()
    if (!session) redirect(`/${lang}/account`)

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    if (user?.role !== 'admin') redirect(`/${lang}`)

    const orders = await getOrders()

    if ('error' in orders) {
        return <div className="text-brand-crimson">{orders.error}</div>
    }

    return (
        <AdminOrdersClient orders={orders} lang={lang} />
    )
}
