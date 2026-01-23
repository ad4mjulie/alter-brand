import { getUsersWithOrders } from '@/app/actions/admin'
import AdminUsersClient from '@/components/admin/AdminUsersClient'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function AdminUsersPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    const session = await getSession()
    if (!session) redirect(`/${lang}/account`)

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') redirect(`/${lang}`)

    const users = await getUsersWithOrders()

    if ('error' in users) {
        return <div className="text-brand-crimson">{users.error}</div>
    }

    return (
        <AdminUsersClient users={users} lang={lang} />
    )
}
