import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params
    const session = await getSession()
    if (!session) redirect(`/${lang}/account`)

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { role: true }
    })

    if (user?.role?.toLowerCase() !== 'admin') {
        // For development, if there are no admins, we might want to allow access or promote the first user.
        // But for now, let's be strict.
        redirect(`/${lang}`)
    }

    return (
        <div className="min-h-screen bg-[var(--background)] flex transition-colors duration-500">
            <AdminSidebar lang={lang} />
            <main className="flex-1 lg:ml-64 p-8 pt-20 lg:pt-8 min-h-screen">
                {children}
            </main>
        </div>
    )
}
