import AdminSettingsClient from '@/components/admin/AdminSettingsClient'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function AdminSettingsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    const session = await getSession()
    if (!session) redirect(`/${lang}/account`)

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') redirect(`/${lang}`)

    return <AdminSettingsClient />
}
