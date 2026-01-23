"use client"

import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { WILAYA_CITIES } from '@/data/communes'
import { createOrder } from '@/app/actions/orders'

const WILAYAS = [
    { code: "01", name: "Adrar" },
    { code: "02", name: "Chlef" },
    { code: "03", name: "Laghouat" },
    { code: "04", name: "Oum El Bouaghi" },
    { code: "05", name: "Batna" },
    { code: "06", name: "Béjaïa" },
    { code: "07", name: "Biskra" },
    { code: "08", name: "Béchar" },
    { code: "09", name: "Blida" },
    { code: "10", name: "Bouira" },
    { code: "11", name: "Tamanrasset" },
    { code: "12", name: "Tébessa" },
    { code: "13", name: "Tlemcen" },
    { code: "14", name: "Tiaret" },
    { code: "15", name: "Tizi Ouzou" },
    { code: "16", name: "Alger" },
    { code: "17", name: "Djelfa" },
    { code: "18", name: "Jijel" },
    { code: "19", name: "Sétif" },
    { code: "20", name: "Saïda" },
    { code: "21", name: "Skikda" },
    { code: "22", name: "Sidi Bel Abbès" },
    { code: "23", name: "Annaba" },
    { code: "24", name: "Guelma" },
    { code: "25", name: "Constantine" },
    { code: "26", name: "Médéa" },
    { code: "27", name: "Mostaganem" },
    { code: "28", name: "M'Sila" },
    { code: "29", name: "Mascara" },
    { code: "30", name: "Ouargla" },
    { code: "31", name: "Oran" },
    { code: "32", name: "El Bayadh" },
    { code: "33", name: "Illizi" },
    { code: "34", name: "Bordj Bou Arréridj" },
    { code: "35", name: "Boumerdès" },
    { code: "36", name: "El Tarf" },
    { code: "37", name: "Tindouf" },
    { code: "38", name: "Tissemsilt" },
    { code: "39", name: "El Oued" },
    { code: "40", name: "Khenchela" },
    { code: "41", name: "Souk Ahras" },
    { code: "42", name: "Tipaza" },
    { code: "43", name: "Mila" },
    { code: "44", name: "Aïn Defla" },
    { code: "45", name: "Naâma" },
    { code: "46", name: "Aïn Témouchent" },
    { code: "47", name: "Ghardaïa" },
    { code: "48", name: "Relizane" },
    { code: "49", name: "Timimoun" },
    { code: "50", name: "Bordj Badji Mokhtar" },
    { code: "51", name: "Ouled Djellal" },
    { code: "52", name: "Béni Abbès" },
    { code: "53", name: "In Salah" },
    { code: "54", name: "In Guezzam" },
    { code: "55", name: "Touggourt" },
    { code: "56", name: "Djanet" },
    { code: "57", name: "El M'Ghair" },
    { code: "58", name: "El Meniaa" }
]

export default function CheckoutClient({ lang, dict, cartDict }: { lang: string, dict: any, cartDict: any }) {
    const { items, total, clearCart } = useCart()
    const router = useRouter()
    const [isProcessing, setIsProcessing] = useState(false)
    const [selectedWilaya, setSelectedWilaya] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [fullName, setFullName] = useState("")
    const [address, setAddress] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")

    const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedWilaya(e.target.value)
        setSelectedCity("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)

        try {
            const res = await createOrder({
                fullName,
                wilaya: WILAYAS.find(w => w.code === selectedWilaya)?.name || "",
                city: selectedCity,
                address,
                phoneNumber,
                total,
                items: items.map(item => ({
                    productId: (item as any).productId || item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                }))
            })

            if (res.success) {
                clearCart()
                router.push(`/${lang}/checkout/success?id=${res.orderId}`)
            } else {
                alert(res.error || (lang === 'ar' ? 'حدث خطأ ما.' : 'Something went wrong.'))
            }
        } catch (error) {
            alert(lang === 'ar' ? 'فشل إتمام الطقوس. يرجى المحاولة مرة أخرى.' : 'Failed to complete the ritual. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="font-serif text-4xl text-[var(--foreground)] mb-4">{cartDict.empty}</h1>
                    <p className="text-brand-crimson text-sm uppercase tracking-widest mb-8">{cartDict.emptySub}</p>
                    <Link href={`/${lang}/shop`} className="text-[var(--foreground)] hover:text-brand-crimson transition-colors uppercase tracking-widest text-xs">
                        {dict.home?.browse || 'Browse Collection'}
                    </Link>
                </motion.div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[var(--background)] py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-4xl md:text-6xl text-[var(--foreground)] mb-12 text-center"
                >
                    {dict.title}
                </motion.h1>

                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="border border-[var(--panel-border)] bg-[var(--panel-bg)] p-8 md:p-12 shadow-2xl backdrop-blur-md"
                    >
                        <h2 className="font-serif text-2xl text-[var(--foreground)] mb-8 text-center border-b border-[var(--panel-border)] pb-4">{dict.orderDetails}</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.fullName}</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder={dict.fullName}
                                    className="w-full bg-transparent border-b border-[var(--panel-border)] py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="wilaya" className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.wilaya}</label>
                                <select
                                    id="wilaya"
                                    name="wilaya"
                                    required
                                    value={selectedWilaya}
                                    onChange={handleWilayaChange}
                                    className="w-full bg-transparent border-b border-[var(--panel-border)] py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors appearance-none cursor-pointer"
                                >
                                    <option value="">{dict.wilaya}</option>
                                    {WILAYAS.map(w => (
                                        <option key={w.code} value={w.code}>{w.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="city" className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.city}</label>
                                <select
                                    id="city"
                                    name="city"
                                    required
                                    disabled={!selectedWilaya}
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full bg-transparent border-b border-[var(--panel-border)] py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">{dict.city}</option>
                                    {selectedWilaya && WILAYA_CITIES[selectedWilaya]?.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.address}</label>
                                <input
                                    type="text"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder={dict.address}
                                    className="w-full bg-transparent border-b border-[var(--panel-border)] py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{dict.phoneNumber}</label>
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="0X XX XX XX XX"
                                    className="w-full bg-transparent border-b border-[var(--panel-border)] py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors"
                                />
                                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-tight">{dict.confirmationCall}</p>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full bg-[var(--foreground)] text-[var(--background)] py-5 uppercase tracking-[0.2em] font-bold text-sm hover:bg-brand-crimson hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-8 shadow-lg shadow-black/20"
                            >
                                {isProcessing ? (lang === 'ar' ? 'جاري المعالجة...' : 'Processing Ritual...') : `${dict.submit} • ${total} DZD`}
                            </button>

                            <p className="text-center text-[var(--text-muted)] text-[10px] uppercase tracking-widest mt-6">
                                {dict.paymentNote}
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}
