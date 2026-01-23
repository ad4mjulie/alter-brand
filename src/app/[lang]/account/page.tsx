import { getDictionary, Locale } from '@/lib/dictionaries'
import AccountClient from '@/components/account/AccountClient'

export default async function AccountPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = await params
    const dict = await getDictionary(lang as Locale)

    return (
        <AccountClient lang={lang} dict={dict.account} />
    )
}
