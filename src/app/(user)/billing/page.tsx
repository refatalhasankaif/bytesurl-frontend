'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface Payment {
    id: string
    amount: number
    currency: string
    plan: string
    createdAt: string
}

const plans = [
    {
        name: 'FREE',
        price: '0',
        features: ['10 URLs lifetime', 'Basic analytics', 'Custom aliases'],
    },
    {
        name: 'PRO',
        price: '66',
        features: ['500 URLs / month', 'Full click analytics', 'Device & location data'],
        highlight: true,
    },
    {
        name: 'ULTIMATE',
        price: '199',
        features: ['Unlimited URLs', 'Full click analytics', 'Priority support'],
    },
]

const planRank: Record<string, number> = {
    FREE: 0,
    PRO: 1,
    ULTIMATE: 2,
}

const planColor = (plan: string) => {
    if (plan === 'ULTIMATE') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    if (plan === 'PRO') return 'text-brand-primary bg-purple-50 border-purple-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
}

export default function BillingPage() {
    const { dbUser, refreshDbUser } = useAuth()
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [upgrading, setUpgrading] = useState<string | null>(null)

    const sub = dbUser?.subscription
    const plan = sub?.plan ?? 'FREE'
    const used = sub?.urlsCreated ?? 0
    const limit = sub?.urlLimit ?? 10

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/payments')
                const raw = res.data?.data
                const list: Payment[] = Array.isArray(raw) ? raw
                    : Array.isArray(raw?.data) ? raw.data
                        : []
                setPayments(list)
            } catch {
                setPayments([])
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const canUpgrade = (targetPlan: string): boolean => {
        return planRank[targetPlan] > planRank[plan]
    }

    const handleUpgrade = async (planName: string) => {
        if (!canUpgrade(planName)) return
        setUpgrading(planName)
        try {
            const res = await api.post('/payments/create-checkout', { plan: planName })

            const data = res.data?.data
            const url =
                data?.checkoutUrl ??
                data?.url ??
                data?.checkout_url ??
                data?.sessionUrl ??
                null

            if (url) {
                window.location.href = url
            } else {
                console.error('Checkout response:', res.data)
                toast.error('Could not get checkout URL. Check console.')
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            toast.error(e?.response?.data?.message ?? 'Failed to initiate payment')
        } finally {
            setUpgrading(null)
        }
    }

    const getButtonLabel = (p: { name: string }) => {
        if (p.name === plan) return 'Current Plan'
        if (!canUpgrade(p.name)) return 'Not Available'
        if (upgrading === p.name) return 'Redirecting...'
        if (p.name === 'FREE') return 'Free Plan'
        return `Upgrade to ${p.name}`
    }

    const getButtonStyle = (p: { name: string, highlight?: boolean }) => {
        const base = 'mt-auto text-sm font-semibold py-2 rounded-lg border transition-colors'
        if (p.name === plan) {
            return `${base} border-gray-200 text-gray-400 cursor-default`
        }
        if (!canUpgrade(p.name)) {
            return `${base} border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50`
        }
        if (p.highlight) {
            return `${base} bg-brand-primary border-brand-primary text-white hover:bg-[#6D28D9] cursor-pointer`
        }
        return `${base} border-brand-primary text-brand-primary hover:bg-purple-50 cursor-pointer`
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your subscription and payment history.</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-900">Current Plan</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColor(plan)}`}>
                        {plan}
                    </span>
                </div>
                {plan === 'ULTIMATE' ? (
                    <p className="text-xs text-gray-400">You have unlimited URLs. No restrictions!</p>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>URLs used</span>
                            <span>{used} / {limit}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-brand-primary h-1.5 rounded-full transition-all"
                                style={{ width: `${Math.min((used / limit) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {plans.map((p) => {
                    const isCurrent = p.name === plan
                    const isUpgradable = canUpgrade(p.name)
                    const isDisabled = isCurrent || !isUpgradable || !!upgrading

                    return (
                        <div
                            key={p.name}
                            className={`bg-white rounded-xl p-5 flex flex-col gap-4 border ${isCurrent
                                ? 'border-brand-primary shadow-sm shadow-purple-100'
                                : !isUpgradable
                                    ? 'border-gray-100 opacity-60'
                                    : p.highlight
                                        ? 'border-brand-primary shadow-sm shadow-purple-100'
                                        : 'border-gray-200'
                                }`}
                        >



                            {isCurrent && (
                                <span className="self-start text-xs font-semibold text-brand-primary bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                                    Active
                                </span>
                            )}

                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{p.name}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {p.price === '0' ? 'Free' : `৳${p.price}`}
                                </p>
                                {p.price !== '0' && (
                                    <p className="text-xs text-gray-400">one-time payment</p>
                                )}
                            </div>

                            <ul className="flex flex-col gap-2">
                                {p.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                                        <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => isUpgradable && !upgrading ? handleUpgrade(p.name) : undefined}
                                disabled={isDisabled}
                                className={getButtonStyle(p)}
                            >
                                {getButtonLabel(p)}
                            </button>
                        </div>
                    )
                })}
            </div>




            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Payment History</p>
                </div>
                {loading ? (
                    <div className="px-5 py-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : payments.length === 0 ? (
                    <div className="px-5 py-8 text-center text-gray-400 text-sm">
                        No payments yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Plan</th>
                                    <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Amount</th>
                                    <th className="text-left px-5 py-3 text-xs text-gray-400 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${planColor(p.plan)}`}>
                                                {p.plan}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-900 font-medium">
                                            ৳{p.amount} {p.currency?.toUpperCase()}
                                        </td>
                                        <td className="px-5 py-3 text-gray-400 text-xs">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    )
}