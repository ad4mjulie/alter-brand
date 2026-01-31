"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, FolderTree, X } from 'lucide-react'
import { createCollection, updateCollection, deleteCollection } from '@/app/actions/admin-collections'

export default function AdminCollectionsClient({ collections, lang }: { collections: any[], lang: string }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCollection, setEditingCollection] = useState<any>(null)

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to dissolve this collection?")) {
            const res = await deleteCollection(id)
            if (res.error) alert(res.error)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Collections</h1>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Organize the shadows into groups</p>
                </div>
                <div />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((coll) => (
                    <div key={coll.id} className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-6 hover:border-brand-crimson/40 transition-colors group backdrop-blur-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-[var(--background)] border border-[var(--panel-border)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-brand-crimson transition-colors">
                                <FolderTree size={20} strokeWidth={1} />
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingCollection(coll)
                                        setIsModalOpen(true)
                                    }}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(coll.id)}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-brand-crimson transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-serif text-xl text-[var(--foreground)] mb-1">{coll.name}</h3>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-4">{coll.slug}</p>
                        <p className="text-xs text-[var(--text-muted)] opacity-80 line-clamp-2 min-h-[2.5rem] mb-4">{coll.description || 'No description provided.'}</p>
                        <div className="pt-4 border-t border-[var(--panel-border)] flex justify-between items-center text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                            <span>Artifacts</span>
                            <span className="text-[var(--foreground)]">{coll._count.products}</span>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[var(--background)] border border-[var(--panel-border)] p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-8 border-b border-[var(--panel-border)] pb-4">
                                <h2 className="font-serif text-2xl text-[var(--foreground)]">{editingCollection ? 'Edit Collection' : 'New Collection'}</h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"><X size={24} /></button>
                            </div>
                            <form action={async (formData) => {
                                const data = {
                                    name: formData.get('name') as string,
                                    slug: formData.get('slug') as string,
                                    description: formData.get('description') as string
                                }
                                const res = editingCollection ? await updateCollection(editingCollection.id, data) : await createCollection(data)
                                if (res.success) setIsModalOpen(false)
                                else alert(res.error)
                            }} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Name</label>
                                    <input required name="name" defaultValue={editingCollection?.name} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Slug</label>
                                    <input required name="slug" defaultValue={editingCollection?.slug} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Description</label>
                                    <textarea name="description" defaultValue={editingCollection?.description} rows={3} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors resize-none" />
                                </div>
                                <button type="submit" className="w-full bg-[var(--foreground)] text-[var(--background)] py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-brand-crimson hover:text-white transition-all shadow-lg">
                                    {editingCollection ? 'Update Collection' : 'Create Collection'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Floating Action Button */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="fixed bottom-12 right-12 z-[90]"
            >
                <button
                    type="button"
                    onClick={() => {
                        setEditingCollection(null)
                        setIsModalOpen(true)
                    }}
                    className="group relative flex items-center justify-center gap-3 bg-brand-crimson text-white px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] overflow-hidden"
                >
                    <Plus size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span className="relative z-10">New Collection</span>

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <div className="absolute inset-0 border border-white/30 scale-[1.03] group-hover:scale-100 transition-transform duration-500" />
                </button>
            </motion.div>
        </div>
    )
}
