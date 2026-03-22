'use client'

import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'

interface AnalyticsUrl {
    shortUrl:    string
    customUrl:   string | null
    originalUrl: string
}

interface Analytics {
    id:        string
    ipAddress: string | null
    userAgent: string | null
    referer:   string | null
    country:   string | null
    city:      string | null
    device:    string | null
    browser:   string | null
    os:        string | null
    clickedAt: string
    url:       AnalyticsUrl | null
}

function ShortUrl({ url }: { url: string | null }) {
    if (!url) return <span className="text-gray-400">—</span>
    let display = url
    try {
        const parsed = new URL(url)
        display = parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '')
        if (display.length > 30) display = display.slice(0, 30) + '…'
    } catch {
        display = url.length > 30 ? url.slice(0, 30) + '…' : url
    }
    return (
        <span title={url} className="cursor-help">
            {display}
        </span>
    )
}

export default function AdminAnalyticsPage() {
    const [items,   setItems]   = useState<Analytics[]>([])
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)
    const [page,    setPage]    = useState(1)
    const [total,   setTotal]   = useState(0)
    const limit = 20

    const load = useCallback(async (p: number) => {
        setLoading(true)
        setError(null)
        try {
            const res   = await api.get(`/admin/analytics?page=${p}&limit=${limit}`)
            const inner = res.data?.data
            setItems(Array.isArray(inner?.data) ? inner.data : [])
            setTotal(inner?.total ?? 0)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setError(e?.response?.data?.message ?? 'Failed to load analytics')
            setItems([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load(1) }, [load])

    const totalPages = Math.ceil(total / limit) || 1

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 text-sm mt-1">All click events across all URLs.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{total} total clicks</p>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">No analytics data yet.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">URL</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Country</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">City</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Device</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Browser</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">OS</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Referer</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">IP</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-700 font-medium text-xs">
                                                {item.url?.customUrl ?? item.url?.shortUrl ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.country ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.city    ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.device  ?? 'Desktop'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.browser ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.os      ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">
                                                <ShortUrl url={item.referer} />
                                            </td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">{item.ipAddress ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                                                {new Date(item.clickedAt).toLocaleString()}
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