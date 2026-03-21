'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import Link from 'next/link'
import { Link2, BarChart2, MousePointerClick, Crown } from 'lucide-react'

interface Url {
    id:           string
    shortUrl:     string
    customUrl:    string | null
    originalUrl:  string
    totalClicks:  number
    shortUrlFull: string
}

const planColor = (plan: string) => {
    if (plan === 'ULTIMATE') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (plan === 'PRO')      return 'text-brand-primary bg-purple-50 border-purple-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
}

export default function DashboardPage() {
    const { dbUser } = useAuth()
    const [urls,    setUrls]    = useState<Url[]>([])
    const [total,   setTotal]   = useState(0)
    const [loading, setLoading] = useState(true)

    
    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/urls?page=1&limit=5')

                

                const inner = res.data?.data
                setUrls(Array.isArray(inner?.data) ? inner.data : [])
                setTotal(inner?.total ?? 0)
            } catch {
                setUrls([])
                setTotal(0)
            } finally {
                setLoading(false)
            }
        }
        load()


    }, [])



    const sub    = dbUser?.subscription
    const plan   = sub?.plan ?? 'FREE'
    const used   = sub?.urlsCreated ?? 0
    const limit  = sub?.urlLimit ?? 10
    const pct    = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
    const totalClicks = urls.reduce((s, u) => s + (u.totalClicks ?? 0), 0)

    const stats = [
        { icon: Link2,             label: 'Total URLs',    value: loading ? '—' : String(total) },
        { icon: MousePointerClick, label: 'Total Clicks',  value: loading ? '—' : String(totalClicks) },
        { icon: Crown,             label: 'Current Plan',  value: plan },
    ]

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">



            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back{dbUser?.name ? `, ${dbUser.name.split(' ')[0]}` : ''}!
                </h1>
                <p className="text-gray-500 text-sm mt-1">Here&apos;s an overview of your account.</p>
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map((s) => {
                    const Icon = s.icon
                    return (
                        <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">{s.label}</p>
                                <p className="text-lg font-bold text-gray-900">{s.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">



                <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Recent URLs</p>
                        <Link href="/urls" className="text-xs text-brand-primary hover:underline">View all</Link>
                    </div>
                    {loading ? (
                        <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading...</div>
                    ) : urls.length === 0 ? (
                        <div className="px-5 py-8 text-center">
                            <p className="text-gray-400 text-sm">No URLs yet.</p>
                            <Link href="/" className="text-sm text-brand-primary hover:underline mt-1 inline-block">
                                Create your first link
                            </Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {urls.map((url) => (
                                <li key={url.id} className="px-5 py-3 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {url.shortUrlFull}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">{url.originalUrl}</p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <BarChart2 className="w-3 h-3" />
                                            {url.totalClicks ?? 0}
                                        </span>
                                        <Link href={`/urls/${url.id}`} className="text-xs text-brand-primary hover:underline">
                                            View
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Subscription</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColor(plan)}`}>
                            {plan}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>URLs used</span>
                            <span>{used} / {plan === 'ULTIMATE' ? '∞' : limit}</span>
                        </div>
                        {plan !== 'ULTIMATE' && (
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-brand-primary h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                        )}
                    </div>
                    {plan === 'FREE' && (
                        <Link href="/billing" className="text-center text-sm font-semibold border border-brand-primary text-brand-primary hover:bg-purple-50 py-2 rounded-lg transition-colors">
                            Upgrade Plan
                        </Link>
                    )}
                </div>

            </div>
        </div>
    )
}