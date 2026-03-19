'use client'

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const { user, dbUser } = useAuth()

    const navigationLinks = [
        { label: "Home",     href: "#home" },
        { label: "Features", href: "#features" },
        { label: "Pricing",  href: "#pricing" },
        { label: "Reviews",  href: "#reviews" },
        { label: "About",    href: "#about" },
        { label: "Contact",  href: "#contact" },
    ]

    const accountLinks = user
        ? [
            { label: "Dashboard",  href: "/dashboard" },
            { label: "My URLs",    href: "/urls" },
            { label: "Analytics",  href: "/analytics" },
            { label: "Billing",    href: "/billing" },
            ...(dbUser?.role === "ADMIN"
                ? [{ label: "Admin Panel", href: "/admin" }]
                : []
            ),
        ]
        : [
            { label: "Login",    href: "/login" },
            { label: "Register", href: "/register" },
        ]

    return (
        <footer className="w-full border-t border-gray-200 bg-[#eeeeee]">
            <div className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">

                    <div className="flex flex-col gap-4">
                        <Link href="/" className="flex items-center gap-2 w-fit">
                            <Image
                                src="/logo.png"
                                alt="BytesURL"
                                width={30}
                                height={30}
                                className="rounded-lg"
                            />
                            <span className="text-base font-bold text-gray-900">
                                BytesURL
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-500">
                            Shorten, share, and track your links with powerful analytics.
                            Simple tools for smarter link management.
                        </p>
                        <Link
                            href="https://github.com/refatalhasankaif"
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-brand-primary hover:underline w-fit"
                        >
                            GitHub
                        </Link>
                    </div>


                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
                            Navigation
                        </p>
                        <ul className="flex flex-col gap-2">
                            {navigationLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
                            Account
                        </p>
                        <ul className="flex flex-col gap-2">
                            {accountLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className={"text-sm transition-colors text-gray-600 hover:text-gray-900"}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>

                <div className="mt-12 mb-6 h-px w-full bg-gray-200" />

                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="text-xs text-gray-400">
                        {`© ${currentYear} BytesURL. All rights reserved.`}
                    </p>
                    <div className="flex gap-5">
                        <Link
                            href="/privacy"
                            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    )
}