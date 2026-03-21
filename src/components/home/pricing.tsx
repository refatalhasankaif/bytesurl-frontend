'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'

const plans = [
    {
        name:        'FREE',
        price:       '0',
        description: 'Perfect for getting started',
        features: [
            '10 URLs lifetime',
            'Basic analytics',
            'Custom aliases',
            'Fast redirects',
        ],
    },
    {
        name:        'PRO',
        price:       '66',
        description: '500 URLs per month',
        highlight:   true,
        features: [
            '500 URLs / month',
            'Full click analytics',
            'Custom aliases',
            'Device & location data',
        ],
    },
    {
        name:        'ULTIMATE',
        price:       '199',
        description: 'Unlimited URLs forever',
        features: [
            'Unlimited URLs',
            'Full click analytics',
            'Custom aliases',
            'Device & location data',
            'Priority support',
        ],
    },
]

const planRank: Record<string, number> = {
    FREE:     0,
    PRO:      1,
    ULTIMATE: 2,
}

export default function Pricing() {
    const { user, dbUser }  = useAuth()
    const router            = useRouter()
    const [upgrading, setUpgrading] = useState<string | null>(null)

    const currentPlan = dbUser?.subscription?.plan ?? 'FREE'

    const canUpgrade = (targetPlan: string) =>
        planRank[targetPlan] > planRank[currentPlan]

    const handleUpgrade = async (planName: string) => {
        if (!user) {
            router.push('/register')
            return
        }
        if (!canUpgrade(planName)) return
        setUpgrading(planName)
        try {
            const res  = await api.post('/payments/create-checkout', { plan: planName })
            const data = res.data?.data
            const url  = data?.checkoutUrl ?? data?.url ?? null
            if (url) {
                window.location.href = url
            } else {
                toast.error('Could not get checkout URL')
            }
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } }
            toast.error(e?.response?.data?.message ?? 'Failed to initiate payment')
        } finally {
            setUpgrading(null)
        }
    }

    const getCtaLabel = (planName: string) => {
        if (!user) {
            return planName === 'FREE' ? 'Get Started Free' : `Get ${planName}`
        }
        if (planName === currentPlan) return 'Current Plan'
        if (!canUpgrade(planName))    return 'Not Available'
        if (upgrading === planName)   return 'Redirecting...'
        if (planName === 'FREE')      return 'Free Plan'
        return `Upgrade to ${planName}`
    }

    const getCtaStyle = (planName: string) => {
        const base = 'mt-auto text-sm font-semibold py-2.5 rounded-lg border transition-colors text-center'


        if (!user) {
            if (planName === 'FREE') {
                return `${base} border-brand-primary text-brand-primary hover:bg-purple-50`
            }
            return `${base} bg-brand-primary border-brand-primary text-white hover:bg-[#6D28D9]`
        }


        if (planName === currentPlan) {
            return `${base} border-gray-200 text-gray-400 cursor-default`
        }
        if (!canUpgrade(planName)) {
            return `${base} border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50`
        }
        if (planName === 'PRO') {
            return `${base} bg-brand-primary border-brand-primary text-white hover:bg-[#6D28D9]`
        }
        return `${base} border-brand-primary text-brand-primary hover:bg-purple-50`
    }

    const isDisabled = (planName: string) => {
        if (!user) return false
        return planName === currentPlan || !canUpgrade(planName) || !!upgrading
    }

    return (
        <section id="pricing" className="w-full py-20 px-4 bg-white">
            <div className="mx-auto max-w-5xl">

                <div className="text-center mb-12">
                    <p className="text-brand-primary text-xs font-semibold tracking-widest uppercase mb-3">
                        Pricing
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Simple, one-time pricing
                    </h2>
                    <p className="text-gray-500 text-sm mt-3">
                        No subscriptions. Pay once, use forever.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isCurrent    = user && plan.name === currentPlan
                        const isUpgradable = !user || canUpgrade(plan.name)

                        return (
                            <div
                                key={plan.name}
                                className={`rounded-xl p-6 flex flex-col gap-5 border ${
                                    isCurrent
                                        ? 'border-brand-primary shadow-md shadow-purple-100'
                                        : !isUpgradable
                                        ? 'border-gray-100 opacity-60'
                                        : plan.highlight
                                        ? 'border-brand-primary shadow-md shadow-purple-100'
                                        : 'border-gray-200'
                                } bg-white`}
                            >

                                {isCurrent && (
                                    <span className="self-start text-xs font-semibold text-brand-primary bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                                        Active
                                    </span>
                                )}

                                <div className="flex flex-col gap-1">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                        {plan.name}
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {plan.price === '0' ? 'Free' : `৳${plan.price}`}
                                        </span>
                                        {plan.price !== '0' && (
                                            <span className="text-xs text-gray-400">one-time</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{plan.description}</p>
                                </div>


                                <ul className="flex flex-col gap-2.5">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                            <Check className="w-4 h-4 text-brand-primary shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {!user ? (

                                    <Link
                                        href={plan.name === 'FREE' ? '/register' : '/register'}
                                        className={getCtaStyle(plan.name)}
                                    >
                                        {getCtaLabel(plan.name)}
                                    </Link>
                                ) : (

                                    <button
                                        onClick={() => !isDisabled(plan.name) ? handleUpgrade(plan.name) : undefined}
                                        disabled={isDisabled(plan.name)}
                                        className={getCtaStyle(plan.name)}
                                    >
                                        {getCtaLabel(plan.name)}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}