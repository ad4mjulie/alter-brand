import { getAdminProducts } from '@/app/actions/admin-products'
import { getCollections } from '@/app/actions/admin-collections'
import AdminProductsClient from '@/components/admin/AdminProductsClient'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export default async function AdminProductsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params

    // Security check redundant if layout handles it, but good for safety
    const session = await getSession()
    if (!session) redirect(`/${lang}/account`)

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    if (user?.role !== 'admin') redirect(`/${lang}`)

    const [products, collections] = await Promise.all([
        getAdminProducts(),
        getCollections()
    ])

    const productError = 'error' in products ? products.error : null

    if (productError) {
        return <div className="text-brand-crimson">{productError}</div>
    }

    const safeCollections = Array.isArray(collections) ? collections : []

    return (
        <AdminProductsClient
            products={products as any[]}
            collections={safeCollections}
            lang={lang}
        />
    )
}
