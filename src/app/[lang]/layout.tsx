import type { Metadata } from 'next'
import { Cinzel, Inter, Amiri } from 'next/font/google'
import '../globals.css'
import Navigation from '@/components/layout/Navigation'
import { CartProvider } from '@/context/CartContext'
import CartDrawer from '@/components/shop/CartDrawer'
import { getDictionary, Locale } from '@/lib/dictionaries'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ALTER | Forged in the Shadows',
  description: 'Luxury streetwear for the streets, forged in the shadows.',
}


import { ThemeProvider } from '@/context/ThemeContext'
import { getUser } from '@/app/actions/auth'

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dictionary = await getDictionary(lang as Locale)
  const user = await getUser()
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={lang} dir={dir} className={`${cinzel.variable} ${inter.variable} ${amiri.variable}`}>
      <body className={`antialiased font-sans selection:bg-brand-crimson selection:text-white ${lang === 'ar' ? 'font-arabic' : ''}`}>
        <ThemeProvider>
          <CartProvider>
            <Navigation lang={lang} dict={dictionary.navigation} user={user} />
            <CartDrawer lang={lang} dict={dictionary.cart} />
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
