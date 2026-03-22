'use client'

import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface UrlUser {
    name:  string | null
    email: string
}

interface Url {
    id:           string
    shortUrl:     string
    customUrl:    string | null
    originalUrl:  string
    totalClicks:  number
    urlStatus:    string
    createdAt:    string
    shortUrlFull: string
    user:         UrlUser | null
}

export default function AdminUrlsPage() {
    const [urls,     setUrls]     = useState<Url[]>([])
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState<string | null>(null)
    const [page,     setPage]     = useState(1)
    const [total,    setTotal]    = useState(0)
    const [updating, setUpdating] = useState<string | null>(null)
    const limit = 10

    const load = useCallback(async (p: number) => {
        setLoading(true)
        setError(null)
        try {
            const res   = await api.get(`/admin/urls?page=${p}&limit=${limit}`)
            const inner = res.data?.data
            setUrls(Array.isArray(inner?.data) ? inner.data : [])
            setTotal(inner?.total ?? 0)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setError(e?.response?.data?.message ?? 'Failed to load URLs')
            setUrls([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load(1) }, [load])

    const toggleStatus = async (url: Url) => {
        const newStatus = url.urlStatus === 'AVAILABLE' ? 'RESTRICTED' : 'AVAILABLE'
        setUpdating(url.id)
        try {
            await api.patch(`/admin/urls/${url.id}`, { urlStatus: newStatus })
            setUrls((prev) =>
                prev.map((u) => u.id === url.id ? { ...u, urlStatus: newStatus } : u)
            )
            toast.success(`URL ${newStatus === 'AVAILABLE' ? 'activated' : 'restricted'}`)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            toast.error(e?.response?.data?.message ?? 'Failed to update status')
        } finally {
            setUpdating(null)
        }
    }

    const totalPages = Math.ceil(total / limit) || 1

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">URLs</h1>
                <p className="text-gray-500 text-sm mt-1">Manage all shortened URLs.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{total} total URLs</p>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">Loading...</div>
                ) : urls.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">No URLs found.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Alias / Key</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Original URL</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Owner</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Clicks</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Status</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Created</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {urls.map((url) => (
                                        <tr key={url.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                {url.customUrl ? (
                                                    <div>
                                                        <p className="font-medium text-brand-primary text-xs">{url.customUrl}</p>
                                                        <p className="text-gray-400 text-xs mt-0.5">{url.shortUrl}</p>
                                                    </div>
                                                ) : (
                                                    <p className="font-medium text-gray-700 text-xs">{url.shortUrl}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 max-w-55">
                                                <p
                                                    className="text-gray-600 text-xs break-all"
                                                    title={url.originalUrl}
                                                >
                                                    {url.originalUrl}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-gray-700 text-xs">{url.user?.name ?? '—'}</p>
                                                <p className="text-gray-400 text-xs">{url.user?.email ?? '—'}</p>
                                            </td>
                                            <td className="px-5 py-4 text-gray-700 text-xs">
                                                {url.totalClicks ?? 0}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                                    url.urlStatus === 'AVAILABLE'
                                                        ? 'text-green-600 bg-green-50 border-green-200'
                                                        : 'text-red-500 bg-red-50 border-red-200'
                                                }`}>
                                                    {url.urlStatus}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-400 text-xs">
                                                {new Date(url.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => toggleStatus(url)}
                                                    disabled={updating === url.id}
                                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                                                        url.urlStatus === 'AVAILABLE'
                                                            ? 'border-red-200 text-red-500 hover:bg-red-50'
                                                            : 'border-green-200 text-green-600 hover:bg-green-50'
                                                    }`}
                                                >
                                                    {updating === url.id
                                                        ? '...'
                                                        : url.urlStatus === 'AVAILABLE' ? 'Restrict' : 'Activate'
                                                    }
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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