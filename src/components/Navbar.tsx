'use client'

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function Navbar() {
    const { user, dbUser, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        await logout()
        toast.success("Logged out!")
        router.push("/")
    }

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "URLs", href: "/urls" },
        { label: "Analytics", href: "/analytics" },
        ...(dbUser?.role === "ADMIN"
            ? [{ label: "Admin Panel", href: "/admin" }]
            : []
        ),
    ]

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname.startsWith(href)
    }

    return (
        <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">

                <Link href="/" className="flex items-center gap-2 shrink-0">
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

                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${isActive(link.href)
                                ? "text-brand-primary bg-purple-50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="focus:outline-none"
                            >
                                {dbUser?.avatarUrl ? (
                                    <Image
                                        src={dbUser.avatarUrl}
                                        alt={dbUser.name}
                                        width={34}
                                        height={34}
                                        className="rounded-full border-2 border-brand-primary object-cover"
                                    />
                                ) : (
                                    <div className="w-8.5 h-8.5 rounded-full border-2 border-brand-primary bg-white flex items-center justify-center">
                                        <span className="text-brand-primary text-sm font-semibold leading-none">
                                            {dbUser?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-purple-200 rounded-xl shadow-md overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-gray-900 text-sm font-semibold truncate">
                                            {dbUser?.name}
                                        </p>
                                        <p className="text-gray-400 text-xs truncate mt-0.5">
                                            {dbUser?.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-brand-primary transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/billing"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-brand-primary transition-colors"
                                    >
                                        Billing
                                    </Link>
                                    <div className="border-t border-gray-100">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm border border-brand-primary text-brand-primary hover:bg-purple-50 px-4 py-1.5 rounded-md transition-colors font-medium"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                <button
                    className="md:hidden text-gray-500 hover:text-gray-900 transition-colors p-1"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

            </div>


            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${isActive(link.href)
                                    ? "text-brand-primary bg-purple-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="mt-2 pt-2 border-t border-gray-100">
                        {user ? (
                            <div className="flex flex-col gap-1">
                                <Link
                                    href="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-50 transition-colors"
                                >
                                    {dbUser?.avatarUrl ? (
                                        <Image
                                            src={dbUser.avatarUrl}
                                            alt={dbUser.name}
                                            width={30}
                                            height={30}
                                            className="rounded-full border border-brand-primary object-cover"
                                        />
                                    ) : (
                                        <div className="w-7.5 h-7.5 rounded-full border border-brand-primary bg-white flex items-center justify-center">
                                            <span className="text-brand-primary text-xs font-semibold">
                                                {dbUser?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-gray-900 text-sm font-medium leading-tight">
                                            {dbUser?.name}
                                        </p>
                                        <p className="text-gray-400 text-xs">
                                            View Profile
                                        </p>
                                    </div>
                                </Link>
                                <Link
                                    href="/billing"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-sm text-gray-600 hover:text-brand-primary px-3 py-2 rounded-md hover:bg-purple-50 transition-colors"
                                >
                                    Billing
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-left text-sm text-red-500 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 pt-1">
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="text-sm border border-brand-primary text-brand-primary hover:bg-purple-50 px-4 py-2 rounded-md transition-colors font-medium text-center"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}