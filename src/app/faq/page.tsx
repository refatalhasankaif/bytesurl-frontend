'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiChevronDown } from 'react-icons/fi'

const faqs = [
    {
        q: "What is BytesURL?",
        a: "BytesURL is a smart URL shortener that allows you to create short links and track analytics like clicks, devices, and locations."
    },
    {
        q: "Is BytesURL free to use?",
        a: "Yes, BytesURL offers a free plan with limited URLs. You can upgrade anytime for more features and higher limits."
    },
    {
        q: "Do I need an account to shorten URLs?",
        a: "Yes, you need to be logged in to create and manage your shortened URLs."
    },
    {
        q: "Can I customize my short link?",
        a: "Yes, you can create custom aliases for your links as long as they are available."
    },
    {
        q: "What analytics do I get?",
        a: "You get detailed analytics including total clicks, device type, browser, location, and referrer data."
    },
    {
        q: "How long do links stay active?",
        a: "Links remain active permanently unless you delete them or violate our terms."
    },
    {
        q: "Is there a limit on link creation?",
        a: "Yes, free users have limits. Paid plans increase or remove those limits."
    },
    {
        q: "Can I edit or delete my links?",
        a: "Yes, you can manage all your links from your dashboard."
    },
    {
        q: "Is my data secure?",
        a: "Yes, we follow industry best practices to keep your data secure and private."
    },
    {
        q: "Does BytesURL support API access?",
        a: "API access may be available in future or premium plans."
    },
    {
        q: "Can I use BytesURL for business?",
        a: "Absolutely. It's perfect for marketing, branding, and tracking campaigns."
    },
    {
        q: "Why is my custom alias not working?",
        a: "It may already be taken or not meet the character requirements."
    }
]

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="min-h-screen w-full bg-white px-4 py-16">


            <div className="max-w-5xl mx-auto mb-10 flex items-center justify-between">
                <Link
                    href="/"
                    className="text-sm border border-brand-primary text-brand-primary px-4 py-2 rounded-md hover:bg-purple-50 transition"
                >
                    ← Back to Home
                </Link>
            </div>

            <div className="max-w-3xl mx-auto">


                <div className="text-center mb-12">
                    <p className="text-brand-primary text-xs font-semibold uppercase mb-3">
                        FAQ
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-500 text-sm mt-3">
                        Everything you need to know about BytesURL.
                    </p>
                </div>


                <div className="flex flex-col gap-4">
                    {faqs.map((item, index) => {
                        const isOpen = openIndex === index

                        return (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-xl overflow-hidden transition-all"
                            >
 
                                <button
                                    onClick={() => toggle(index)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition"
                                >
                                    <span className="text-sm font-medium text-gray-900">
                                        {item.q}
                                    </span>
                                    <FiChevronDown
                                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>


                                <div
                                    className={`px-5 overflow-hidden transition-all duration-300 ${
                                        isOpen
                                            ? "max-h-40 opacity-100 pb-4"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}