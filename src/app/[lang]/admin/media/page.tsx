import { db } from '@/lib/db'
import AdminMediaClient from '@/components/admin/AdminMediaClient'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function AdminMediaPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    const session = await getSession()
    if (!session) redirect(`/${lang}/account`)

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') redirect(`/${lang}`)

    const images = await db.productImage.findMany({
        include: { product: { select: { name: true } } },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <AdminMediaClient images={images} lang={lang} />
    )
}
