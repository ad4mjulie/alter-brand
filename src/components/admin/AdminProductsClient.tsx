"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Package,
    AlertTriangle,
    Image as ImageIcon,
    X
} from 'lucide-react'
import { deleteProduct, createProduct, updateProduct } from '@/app/actions/admin-products'

export default function AdminProductsClient({ products, collections = [], lang }: { products: any[], collections?: any[], lang: string }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [formImages, setFormImages] = useState<string[]>([])
    const [formColors, setFormColors] = useState<string[]>([])

    const openModal = (product: any | null) => {
        setEditingProduct(product)
        setFormImages(product?.images?.map((img: any) => img.url) || [])
        setFormColors(product?.colors ? product.colors.split(',').filter(Boolean) : [])
        setIsModalOpen(true)
    }


    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this artifact?")) {
            const res = await deleteProduct(id)
            if (res.error) alert(res.error)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl text-[var(--foreground)] mb-2">Artifact Management</h1>
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">Control the physical manifestations</p>
                </div>
                <button
                    onClick={() => openModal(null)}
                    className="flex items-center justify-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-brand-crimson hover:text-white transition-colors"
                >
                    <Plus size={16} />
                    Forge New Artifact
                </button>
            </div>

            {/* Search and Filters */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                <input
                    type="text"
                    placeholder="Search artifacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--panel-bg)] border border-[var(--panel-border)] pl-12 pr-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors text-xs uppercase tracking-widest"
                />
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[var(--panel-border)] text-[var(--text-muted)] text-[10px] uppercase tracking-[0.2em]">
                            <th className="py-4 px-4 font-normal">Artifact</th>
                            <th className="py-4 px-4 font-normal">Category</th>
                            <th className="py-4 px-4 font-normal text-right">Price</th>
                            <th className="py-4 px-4 font-normal text-right">Stock</th>
                            <th className="py-4 px-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--panel-border)]/50">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="group hover:bg-[var(--panel-bg)] transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-16 bg-[var(--panel-bg)] flex items-center justify-center overflow-hidden border border-[var(--panel-border)]">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon size={20} className="text-[var(--text-muted)] opacity-50" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[var(--foreground)] font-serif">{product.name}</p>
                                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-xs text-[var(--text-muted)] uppercase tracking-widest">{product.category}</td>
                                <td className="py-4 px-4 text-xs text-[var(--foreground)] text-right font-sans">{product.price} DZD</td>
                                <td className="py-4 px-4 text-right">
                                    <div className={`inline-flex items-center gap-2 text-xs font-sans ${product.stock < 10 ? 'text-brand-crimson' : 'text-[var(--text-muted)]'}`}>
                                        {product.stock < 10 && <AlertTriangle size={14} />}
                                        {product.stock}
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                                        <button
                                            onClick={() => openModal(product)}
                                            className="p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--panel-bg)] rounded transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-[var(--text-muted)] hover:text-brand-crimson hover:bg-brand-crimson/10 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal placeholder - for brevity I'll implement the actual form in the next step */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[var(--background)] border border-[var(--panel-border)] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8 border-b border-[var(--panel-border)] pb-4">
                                <h2 className="font-serif text-2xl text-[var(--foreground)]">
                                    {editingProduct ? 'Edit Artifact' : 'Forge Artifact'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form action={async (formData) => {
                                const images = formData.get('images')?.toString().split(',').filter(Boolean) || []
                                const collectionId = formData.get('collectionId') as string
                                const data = {
                                    name: formData.get('name') as string,
                                    slug: formData.get('slug') as string,
                                    description: formData.get('description') as string,
                                    price: parseFloat(formData.get('price') as string),
                                    category: formData.get('category') as string,
                                    sizes: formData.get('sizes') as string,
                                    colors: formData.get('colors') as string,
                                    stock: parseInt(formData.get('stock') as string),
                                    collectionId: collectionId || undefined,
                                    images
                                }

                                const res = editingProduct
                                    ? await updateProduct(editingProduct.id, data)
                                    : await createProduct(data)

                                if (res.success) setIsModalOpen(false)
                                else alert(res.error)
                            }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Name</label>
                                        <input required name="name" defaultValue={editingProduct?.name} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Slug</label>
                                        <input required name="slug" defaultValue={editingProduct?.slug} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Description</label>
                                    <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors resize-none" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Price (DZD)</label>
                                        <input required type="number" name="price" defaultValue={editingProduct?.price} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Stock Quantity</label>
                                        <input required type="number" name="stock" defaultValue={editingProduct?.stock} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Category</label>
                                            <input required name="category" defaultValue={editingProduct?.category} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Collection</label>
                                            <select name="collectionId" defaultValue={editingProduct?.collectionId || ""} className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors">
                                                <option value="" className="bg-[var(--background)]">No Collection</option>
                                                {collections.map(c => (
                                                    <option key={c.id} value={c.id} className="bg-[var(--background)]">{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Sizes (comma-separated)</label>
                                        <input name="sizes" defaultValue={editingProduct?.sizes} placeholder="XS,S,M,L,XL" className="w-full bg-transparent border-b border-[var(--panel-border)] py-2 text-[var(--foreground)] focus:outline-none focus:border-brand-crimson transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2 block">Visual Echoes (Colors)</label>
                                        <div className="flex flex-wrap gap-3 items-center">
                                            {formColors.map((color, idx) => (
                                                <div key={idx} className="group relative w-8 h-8 rounded-full border border-[var(--panel-border)] overflow-hidden shadow-lg" style={{ backgroundColor: color }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormColors(prev => prev.filter((_, i) => i !== idx))}
                                                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--foreground)]"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="relative w-8 h-8 rounded-full border border-[var(--panel-border)] border-dashed flex items-center justify-center hover:bg-[var(--panel-bg)] transition-colors group cursor-pointer">
                                                <Plus size={14} className="text-[var(--text-muted)]/40 group-hover:text-[var(--foreground)]" />
                                                <input
                                                    type="color"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const newColor = e.target.value.toUpperCase()
                                                        if (!formColors.includes(newColor)) {
                                                            setFormColors(prev => [...prev, newColor])
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <input type="hidden" name="colors" value={formColors.join(',')} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] block">Media Artifacts</label>

                                    {/* Hidden input for form submission */}
                                    <input type="hidden" name="images" value={formImages.join(',')} />

                                    {/* Image Grid */}
                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        {/* Existing Images */}
                                        {formImages.map((url, idx) => (
                                            <div key={idx} className="relative aspect-[3/4] bg-[var(--panel-bg)] border border-[var(--panel-border)] group">
                                                <img src={url} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormImages(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 p-1 bg-[var(--background)]/80 text-brand-crimson opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-brand-crimson hover:text-white"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Upload Button Block */}
                                        <div className="relative aspect-[3/4] bg-[var(--panel-bg)]/10 border border-[var(--panel-border)] border-dashed flex flex-col items-center justify-center gap-2 hover:bg-[var(--panel-bg)]/20 transition-colors group cursor-pointer">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                multiple
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={async (e) => {
                                                    const files = e.target.files
                                                    if (!files || files.length === 0) return

                                                    const statusDiv = document.getElementById('upload-status')
                                                    if (statusDiv) statusDiv.textContent = 'Uploading...'

                                                    const newUrls: string[] = []
                                                    for (let i = 0; i < files.length; i++) {
                                                        const formData = new FormData()
                                                        formData.append('file', files[i])

                                                        const { uploadImage } = await import('@/app/actions/upload')
                                                        const res = await uploadImage(formData)

                                                        if (res.success) {
                                                            newUrls.push(res.url as string)
                                                        } else {
                                                            alert(`Failed to upload ${files[i].name}: ${res.error}`)
                                                        }
                                                    }

                                                    setFormImages(prev => [...prev, ...newUrls])
                                                    if (statusDiv) statusDiv.textContent = ''
                                                }}
                                            />
                                            <div className="p-3 rounded-full bg-[var(--foreground)]/10 text-[var(--foreground)] group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)] transition-colors">
                                                <ImageIcon size={20} />
                                            </div>
                                            <span className="text-[8px] uppercase tracking-widest text-[var(--text-muted)] font-bold text-center">Upload<br />(Device)</span>
                                            <span id="upload-status" className="absolute bottom-1 text-[8px] text-brand-crimson animate-pulse"></span>
                                        </div>
                                    </div>

                                    {/* No manual input as requested, just the grid and upload button above */}
                                </div>

                                <button type="submit" className="w-full bg-[var(--foreground)] text-[var(--background)] py-4 uppercase tracking-[0.2em] font-bold text-xs hover:bg-brand-crimson hover:text-white transition-all mt-6 shadow-lg">
                                    {editingProduct ? 'Finalize Modification' : 'Commence Forging'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
