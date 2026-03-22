'use client'

import { useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'

interface PaymentUser {
    name:  string | null
    email: string
}

interface Payment {
    id:              string
    amount:          number
    currency:        string
    plan:            string
    stripeSessionId: string
    createdAt:       string
    user:            PaymentUser | null
}

const planColor = (plan: string) => {
    if (plan === 'ULTIMATE') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (plan === 'PRO')      return 'text-[#7C3AED] bg-purple-50 border-purple-200'
    return 'text-gray-500 bg-gray-50 border-gray-200'
}

export default function AdminPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState<string | null>(null)
    const [page,     setPage]     = useState(1)
    const [total,    setTotal]    = useState(0)
    const limit = 10

    const load = useCallback(async (p: number) => {
        setLoading(true)
        setError(null)
        try {
            const res   = await api.get(`/admin/payments?page=${p}&limit=${limit}`)
            const inner = res.data?.data
            setPayments(Array.isArray(inner?.data) ? inner.data : [])
            setTotal(inner?.total ?? 0)
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            setError(e?.response?.data?.message ?? 'Failed to load payments')
            setPayments([])
            setTotal(0)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load(1) }, [load])

    const totalPages  = Math.ceil(total / limit) || 1
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0)

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-500 text-sm mt-1">All payment transactions.</p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                </div>
            )}


            {!loading && payments.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400">Revenue (current page)</p>
                        <p className="text-2xl font-bold text-gray-900 mt-0.5">৳{totalRevenue.toFixed(2)}</p>
                    </div>
                    <p className="text-sm text-gray-500">{total} total transactions</p>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm text-gray-500">{total} total payments</p>
                </div>

                {loading ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">Loading...</div>
                ) : payments.length === 0 ? (
                    <div className="px-5 py-10 text-center text-gray-400 text-sm">No payments yet.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">User</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Plan</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Amount</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Stripe Session</th>
                                        <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4">
                                                <p className="font-medium text-gray-900 text-sm">{p.user?.name ?? '—'}</p>
                                                <p className="text-gray-400 text-xs">{p.user?.email ?? '—'}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColor(p.plan)}`}>
                                                    {p.plan}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-900 font-medium text-sm">
                                                ৳{p.amount ?? 0} {p.currency?.toUpperCase() ?? ''}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="text-gray-400 text-xs font-mono truncate max-w-30 block">
                                                    {p.stripeSessionId ?? '—'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-gray-400 text-xs">
                                                {new Date(p.createdAt).toLocaleDateString()}
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