'use client'

import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

interface AnalyticsItem {
    id:        string
    urlsId:    string
    ipAddress: string | null
    userAgent: string | null
    referer:   string | null
    country:   string | null
    city:      string | null
    device:    string | null
    browser:   string | null
    os:        string | null
    clickedAt: string
    url?: {
        shortUrl:    string
        customUrl:   string | null
        originalUrl: string
        totalClicks: number
    } | null
}

export default function AnalyticsPage() {
    const [items,   setItems]   = useState<AnalyticsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page,    setPage]    = useState(1)
    const [total,   setTotal]   = useState(0)
    const limit = 20

    const load = useCallback(async (p: number) => {
        setLoading(true)
        try {
            const res   = await api.get(`/analytics?page=${p}&limit=${limit}`)
            const inner = res.data?.data
            setItems(Array.isArray(inner?.data) ? inner.data : [])
            setTotal(inner?.total ?? 0)
        } catch {
            toast.error('Failed to load analytics')
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
                <p className="text-gray-500 text-sm mt-1">All click events across your URLs.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{total} total clicks</p>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">
                        No analytics yet. Share your links to start tracking!
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">Short URL</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">Country</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">City</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">Device</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">Browser</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">OS</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">Referer</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">IP</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium whitespace-nowrap">Time</th>
                                    </tr>
                                </thead>
                                
                                <tbody className="divide-y divide-gray-50">
                                    {items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-700 font-medium text-xs whitespace-nowrap">
                                                {item.url?.customUrl ?? item.url?.shortUrl ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.country   ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.city      ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.device    ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.browser   ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{item.os        ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs max-w-30 truncate">
                                                {item.referer ?? '—'}
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