'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Users, Link2, MousePointerClick, DollarSign } from 'lucide-react'

interface Stats {
    totalUsers:   number
    totalUrls:    number
    totalClicks:  number
    totalRevenue: number
    planCounts:   { plan: string; count: number }[]
}

const planColor = (plan: string) => {
    if (plan === 'ULTIMATE') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (plan === 'PRO')      return 'text-[#7C3AED] bg-purple-50 border-purple-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
}

export default function AdminDashboardPage() {
    const [stats,   setStats]   = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error,   setError]   = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                const res  = await api.get('/admin/stats')
                const data = res.data?.data ?? null
                if (!data) throw new Error('No data')
                setStats(data)
            } catch (err: unknown) {
                const e = err as { response?: { data?: { message?: string } } }
                setError(e?.response?.data?.message ?? 'Failed to load stats')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const statCards = [
        { label: 'Total Users',  value: stats?.totalUsers   ?? 0, icon: Users             },
        { label: 'Total URLs',   value: stats?.totalUrls    ?? 0, icon: Link2             },
        { label: 'Total Clicks', value: stats?.totalClicks  ?? 0, icon: MousePointerClick },
        { label: 'Revenue (৳)',  value: stats?.totalRevenue ?? 0, icon: DollarSign        },
    ]

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Overview of BytesURL.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => {
                    const Icon = s.icon
                    return (
                        <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                                <Icon className="w-5 h-5 text-brand-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">{s.label}</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {loading ? '—' : s.value.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Plan Distribution</p>
                </div>
                {loading ? (
                    <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : !stats?.planCounts?.length ? (
                    <div className="px-5 py-8 text-center text-gray-400 text-sm">No data</div>
                ) : (
                    <div className="px-5 py-4 flex flex-wrap gap-3">
                        {stats.planCounts.map((p) => (
                            <div key={p.plan} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${planColor(p.plan)}`}>
                                <span>{p.plan}</span>
                                <span className="font-bold">{p.count}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}