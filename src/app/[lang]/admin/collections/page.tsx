import { getCollections } from '@/app/actions/admin-collections'
import AdminCollectionsClient from '@/components/admin/AdminCollectionsClient'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function AdminCollectionsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    const session = await getSession()
    if (!session) redirect(`/${lang}/account`)

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    if (user?.role !== 'ADMIN') redirect(`/${lang}`)

    const collections = await getCollections()

    if ('error' in collections) {
        return <div className="text-brand-crimson">{collections.error}</div>
    }

    return (
        <AdminCollectionsClient collections={collections as any[]} lang={lang} />
    )
}
