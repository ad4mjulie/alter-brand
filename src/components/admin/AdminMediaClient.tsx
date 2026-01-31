"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, Copy, Check, Search, Filter, Image as ImageIcon, X } from 'lucide-react'
import NextImage from 'next/image'
import { getMedia, uploadMedia, deleteMedia } from '@/app/actions/admin-media'

export default function AdminMediaClient({ images, lang }: { images: any[], lang: string }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

    const filteredImages = images.filter(img =>
        img.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.product?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        setCopiedUrl(url)
        setTimeout(() => setCopiedUrl(null), 2000)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Permanently destroy this artifact?")) {
            const res = await deleteMedia(id)
            if (res.error) alert(res.error)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Media Vault</h1>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Manage the visual echoes of the ritual</p>
                    <div className="relative">
                        <input
                            type="file"
                            id="media-upload"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const files = e.target.files
                                if (!files || files.length === 0) return

                                const statusDiv = document.getElementById('media-status')
                                if (statusDiv) statusDiv.textContent = 'Uploading...'

                                for (let i = 0; i < files.length; i++) {
                                    const formData = new FormData()
                                    formData.append('file', files[i])

                                    const { uploadImage } = await import('@/app/actions/upload')
                                    const res = await uploadImage(formData)

                                    if (res.error) {
                                        alert(`Failed to upload ${files[i].name}: ${res.error}`)
                                    } else {
                                        // Save standalone image to DB
                                        await createMedia(res.url as string)
                                    }
                                }

                                if (statusDiv) statusDiv.textContent = 'Done!'
                                setTimeout(() => { if (statusDiv) statusDiv.textContent = '' }, 2000)
                            }}
                        />
                        <label
                            htmlFor="media-upload"
                            className="inline-flex items-center gap-2 cursor-pointer bg-[var(--panel-bg)]/40 text-[var(--foreground)] px-4 py-2 border border-[var(--panel-border)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                        >
                            <Plus size={16} />
                            <span className="uppercase text-[10px] tracking-widest font-bold">Add Artifact</span>
                        </label>
                        <span id="media-status" className="ml-4 text-xs text-[var(--text-muted)] animate-pulse"></span>
                    </div>
                </div>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                    type="text"
                    placeholder="Search artifacts or URLs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--panel-bg)] border border-[var(--panel-border)] pl-12 pr-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors text-xs uppercase tracking-widest"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredImages.map((img) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative aspect-[3/4] bg-[var(--panel-bg)] border border-[var(--panel-border)] overflow-hidden"
                    >
                        <NextImage
                            src={img.url}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => copyToClipboard(img.url)}
                                    className="p-2 bg-[var(--foreground)] text-[var(--background)] rounded hover:bg-brand-crimson hover:text-white transition-colors"
                                    title="Copy URL"
                                >
                                    {copiedUrl === img.url ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(img.id)}
                                    className="p-2 bg-[var(--panel-bg)] text-[var(--foreground)] border border-[var(--panel-border)] rounded hover:bg-brand-crimson hover:text-white transition-colors"
                                    title="Delete Artifact"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <p className="text-[8px] uppercase tracking-widest text-[var(--foreground)] opacity-60 text-center px-2 line-clamp-2">
                                {img.product?.name || 'Unlinked Artifact'}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
