'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import { Copy, Trash2, ArrowLeft, MousePointerClick, Globe, Monitor, Smartphone, Pencil, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

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
}

interface UrlDetail {
    id:           string
    shortUrl:     string
    customUrl:    string | null
    originalUrl:  string
    totalClicks:  number
    urlStatus:    string
    createdAt:    string
    shortUrlFull: string
}

export default function UrlDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()

    const [url,         setUrl]         = useState<UrlDetail | null>(null)
    const [analytics,   setAnalytics]   = useState<AnalyticsItem[]>([])
    const [anTotal,     setAnTotal]     = useState(0)
    const [loading,     setLoading]     = useState(true)
    const [editing,     setEditing]     = useState(false)
    const [customInput, setCustomInput] = useState('')
    const [customError, setCustomError] = useState('')
    const [saving,      setSaving]      = useState(false)

    useEffect(() => {
        if (!id) return
        const load = async () => {
            try {

                
                const urlRes  = await api.get(`/urls/${id}`)
                const urlData = urlRes.data?.data
                if (!urlData?.id) throw new Error('Not found')
                setUrl(urlData)
                setCustomInput(urlData.customUrl ?? '')



                try {
                    const anRes   = await api.get(`/analytics/${id}?page=1&limit=100`)
                    const anRaw   = anRes.data?.data

                    let list: AnalyticsItem[] = []
                    let total = 0

                    if (Array.isArray(anRaw)) {

                        list  = anRaw
                        total = anRaw.length
                    } else if (anRaw && typeof anRaw === 'object') {
                        if (Array.isArray(anRaw.data)) {

                            list  = anRaw.data
                            total = anRaw.total ?? anRaw.data.length
                        } else if (Array.isArray(anRaw.analytics)) {
                            list  = anRaw.analytics
                            total = anRaw.total ?? anRaw.analytics.length
                        }
                    }

                    setAnalytics(list)
                    setAnTotal(total)
                } catch (anErr) {
                    console.error('Analytics fetch failed:', anErr)
                    setAnalytics([])
                    setAnTotal(0)
                }
            } catch {
                toast.error('Failed to load URL')
                router.push('/urls')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id, router])

    const copy = () => {
        if (!url) return
        navigator.clipboard.writeText(url.shortUrlFull)
        toast.success('Copied!')
    }

    const remove = async () => {
        if (!url || !confirm('Delete this URL?')) return
        try {
            await api.delete(`/urls/${url.id}`)
            toast.success('URL deleted')
            router.push('/urls')
        } catch {
            toast.error('Failed to delete')
        }
    }

    const handleCustomChange = (val: string) => {
        const clean = val.replace(/[^a-zA-Z0-9-_]/g, '')
        setCustomInput(clean)
        if (clean.length === 0)     setCustomError('')
        else if (clean.length < 3)  setCustomError('Minimum 3 characters')
        else if (clean.length > 20) setCustomError('Maximum 20 characters')
        else                        setCustomError('')
    }

    const saveCustomUrl = async () => {
        if (customError) return
        setSaving(true)
        try {
            const res     = await api.patch(`/urls/${url?.id}`, {
                customUrl: customInput || null,
            })
            const updated = res.data?.data
            if (updated?.id) setUrl(updated)
            setEditing(false)
            toast.success('Custom URL updated!')
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            toast.error(e?.response?.data?.message ?? 'Failed to update')
        } finally {
            setSaving(false)
        }
    }

    const cancelEdit = () => {
        setCustomInput(url?.customUrl ?? '')
        setCustomError('')
        setEditing(false)
    }



    const countBy = (key: keyof AnalyticsItem) => {
        const map: Record<string, number> = {}
        analytics.forEach((a) => {
            const raw = a[key]
            const val = raw === null || raw === undefined || raw === ''
                ? key === 'device' ? 'Desktop' : 'Unknown'
                : String(raw)
            map[val] = (map[val] ?? 0) + 1
        })
        return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5)
    }

    if (loading) {
        return <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-400 text-sm">Loading...</div>
    }
    if (!url) return null

    const countries = countBy('country')
    const devices   = countBy('device')
    const browsers  = countBy('browser')


    return (

        <div className="max-w-4xl mx-auto px-4 py-10">

            <Link href="/urls" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to URLs
            </Link>



            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        <p className="text-base font-bold text-gray-900 truncate">{url.shortUrlFull}</p>
                        <p className="text-sm text-gray-500 truncate">{url.originalUrl}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                                url.urlStatus === 'AVAILABLE'
                                    ? 'text-green-600 bg-green-50 border-green-200'
                                    : 'text-red-500 bg-red-50 border-red-200'
                            }`}>
                                {url.urlStatus}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <MousePointerClick className="w-3 h-3" />
                                {url.totalClicks ?? 0} clicks
                            </span>
                        </div>



                        <div className="mt-3 flex flex-col gap-1">
                            <p className="text-xs text-gray-400 font-medium">Custom alias</p>
                            {editing ? (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-brand-primary transition-colors">
                                        <span className="text-gray-400 text-xs shrink-0">bytesurl.onrender.com/</span>
                                        <input
                                            type="text"
                                            value={customInput}
                                            onChange={(e) => handleCustomChange(e.target.value)}
                                            placeholder="custom-alias"
                                            maxLength={20}
                                            autoFocus
                                            className="flex-1 bg-transparent text-gray-900 text-xs focus:outline-none min-w-0"
                                        />
                                        {customInput.length > 0 && (
                                            <span className="text-xs text-gray-400 shrink-0">{customInput.length}/20</span>
                                        )}
                                    </div>
                                    {customError && (
                                        <p className="text-red-500 text-xs px-1">{customError}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={saveCustomUrl}
                                            disabled={saving || !!customError}
                                            className="flex items-center gap-1 text-xs bg-brand-primary hover:bg-[#6D28D9] disabled:opacity-50 text-white px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Check className="w-3 h-3" />
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="flex items-center gap-1 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                        {url.customUrl
                                            ? <span className="font-medium text-brand-primary">{url.customUrl}</span>
                                            : <span className="text-gray-400 italic text-xs">None set</span>
                                        }
                                    </span>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="text-gray-400 hover:text-brand-primary transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button onClick={copy} className="flex items-center gap-1.5 text-xs border border-brand-primary text-brand-primary hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                        <button onClick={remove} className="flex items-center gap-1.5 text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                    </div>
                </div>
            </div>



            {url.totalClicks === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-10 text-center">
                    <p className="text-gray-400 text-sm">No clicks yet. Share your link to start tracking!</p>
                </div>
            ) : analytics.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl px-5 py-10 text-center">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                        {url.totalClicks} click{url.totalClicks !== 1 ? 's' : ''} recorded
                    </p>
                    <p className="text-gray-400 text-xs">
                        Detailed analytics could not be loaded. Try refreshing.
                    </p>
                </div>
            ) : (
                <>


                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {[
                            { icon: Globe,      label: 'Countries', data: countries },
                            { icon: Smartphone, label: 'Devices',   data: devices },
                            { icon: Monitor,    label: 'Browsers',  data: browsers },
                        ].map((card) => {
                            const Icon = card.icon
                            return (
                                <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Icon className="w-4 h-4 text-brand-primary" />
                                        <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                                    </div>
                                    <ul className="flex flex-col gap-2">
                                        {card.data.map(([name, count]) => (
                                            <li key={name} className="flex justify-between text-sm">
                                                <span className="text-gray-600 truncate">{name}</span>
                                                <span className="text-gray-900 font-medium ml-2 shrink-0">{count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>


                    <div className="bg-white border border-gray-200 rounded-xl">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-900">Click Events</p>
                            <p className="text-xs text-gray-400">{anTotal} total</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
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
                                    {analytics.map((a) => (
                                        <tr key={a.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-gray-600 text-xs">{a.country   ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{a.city      ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{a.device    ?? 'Desktop'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{a.browser   ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-600 text-xs">{a.os        ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs max-w-25 truncate">{a.referer   ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs">{a.ipAddress ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                                                {new Date(a.clickedAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}