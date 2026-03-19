import { Check } from 'lucide-react'

const plans = [
    {
        name: 'FREE',
        price: '0',
        description: 'Perfect for getting started',
        features: [
            '10 URLs lifetime',
            'Analytics',
            'Custom aliases',
            'Fast redirects',
        ],
        cta: 'Get Started',
    },
    {
        name: 'PRO',
        price: '29',
        description: '500 URLs per month',
        features: [
            '500 URLs / month',
            'Full click analytics',
            'Custom aliases',
            'Device & location data',
        ],
        cta: 'Upgrade to PRO',
    },
    {
        name: 'ULTIMATE',
        price: '199',
        description: 'Unlimited URLs forever',
        features: [
            'Unlimited URLs',
            'Full click analytics',
            'Custom aliases',
            'Device & location data',
            'Priority support',
        ],
        cta: 'Get Ultimate',
    },
]

export default function Pricing() {
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
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={'rounded-xl p-6 flex flex-col gap-5 border border-brand-primary bg-white shadow-md shadow-purple-100'}>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                    {plan.name}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ৳{plan.price}
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

                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}