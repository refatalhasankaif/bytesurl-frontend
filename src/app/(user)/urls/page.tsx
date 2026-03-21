'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import Link from 'next/link'
import { Copy, Trash2, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface Url {
    id:           string
    shortUrl:     string
    customUrl:    string | null
    originalUrl:  string
    totalClicks:  number
    urlStatus:    string
    createdAt:    string
    shortUrlFull: string
}

export default function UrlsPage() {
    const [urls,    setUrls]    = useState<Url[]>([])
    const [loading, setLoading] = useState(true)
    const [page,    setPage]    = useState(1)
    const [total,   setTotal]   = useState(0)
    const limit = 10

    const load = async (p = 1) => {
        setLoading(true)
        try {
            const res   = await api.get(`/urls?page=${p}&limit=${limit}`)

            const inner = res.data?.data
            setUrls(Array.isArray(inner?.data) ? inner.data : [])
            setTotal(inner?.total ?? 0)
        } catch {
            toast.error('Failed to load URLs')
            setUrls([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load(1) }, [])

    const copy = (url: Url) => {
        navigator.clipboard.writeText(url.shortUrlFull)
        toast.success('Copied!')
    }

    const remove = async (id: string) => {
        if (!confirm('Delete this URL?')) return
        try {
            await api.delete(`/urls/${id}`)
            setUrls((prev) => prev.filter((u) => u.id !== id))
            setTotal((prev) => prev - 1)
            toast.success('URL deleted')
        } catch {
            toast.error('Failed to delete')
        }
    }

    const totalPages = Math.ceil(total / limit) || 1

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My URLs</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all your shortened links.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{total} total URLs</p>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">Loading...</div>
                ) : urls.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                        <p className="text-gray-400 text-sm">No URLs yet.</p>
                        <Link href="/" className="text-sm text-brand-primary hover:underline mt-1 inline-block">
                            Create your first short URL
                        </Link>
                    </div>
                ) : (
                    <>

                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Short URL</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Original URL</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Clicks</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {urls.map((url) => (
                                        <tr key={url.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-900 text-xs">
                                                    {url.shortUrlFull}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 max-w-xs">
                                                <p className="text-gray-500 truncate">{url.originalUrl}</p>
                                            </td>
                                            <td className="px-5 py-4 text-gray-900">{url.totalClicks ?? 0}</td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                                    url.urlStatus === 'AVAILABLE'
                                                        ? 'text-green-600 bg-green-50 border-green-200'
                                                        : 'text-red-500 bg-red-50 border-red-200'
                                                }`}>
                                                    {url.urlStatus}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button onClick={() => copy(url)} className="text-gray-400 hover:text-brand-primary transition-colors">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <Link href={`/urls/${url.id}`} className="text-gray-400 hover:text-brand-primary transition-colors">
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                    <button onClick={() => remove(url.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <ul className="sm:hidden divide-y divide-gray-50">
                            {urls.map((url) => (
                                <li key={url.id} className="px-5 py-4 flex items-center justify-between gap-3">
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {url.customUrl ?? url.shortUrl}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">{url.originalUrl}</p>
                                        <p className="text-xs text-gray-400">{url.totalClicks ?? 0} clicks</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => copy(url)} className="text-gray-400 hover:text-brand-primary">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        <Link href={`/urls/${url.id}`} className="text-gray-400 hover:text-brand-primary">
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => remove(url.id)} className="text-gray-400 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>


                        {totalPages > 1 && (
                            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { const p = page - 1; setPage(p); load(p) }}
                                        disabled={page === 1}
                                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:border-brand-primary hover:text-brand-primary transition-colors"
                                    >
                                        Prev
                                    </button>
                                    <button
                                        onClick={() => { const p = page + 1; setPage(p); load(p) }}
                                        disabled={page === totalPages}
                                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg disabled:opacity-40 hover:border-brand-primary hover:text-brand-primary transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}