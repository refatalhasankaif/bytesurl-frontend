'use client'

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { FiChevronDown } from "react-icons/fi"

export default function Navbar() {
    const { user, dbUser, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [moreOpen, setMoreOpen] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const moreLinks = [
        { label: "Service Status", href: "/status" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Chat with AI", href: "/ai" },
        { label: "FAQ", href: "/faq" },
    ]

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
                    <Image src="/logo.png" alt="BytesURL" width={30} height={30} className="rounded-lg" />
                    <span className="text-base font-bold text-gray-900">BytesURL</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                                isActive(link.href)
                                    ? "text-brand-primary bg-purple-50"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}


                    <div className="relative">
                        <button
                            onClick={() => setMoreOpen(!moreOpen)}
                            className="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                            More
                            <FiChevronDown
                                className={`w-4 h-4 transition-transform duration-300 ${
                                    moreOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`absolute left-0 mt-2 w-52 bg-white border border-purple-200 rounded-xl shadow-md overflow-hidden z-50 transition-all duration-300 origin-top ${
                                moreOpen
                                    ? "opacity-100 scale-100 translate-y-0"
                                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }`}
                        >
                            {moreLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMoreOpen(false)}
                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-brand-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                                        <span className="text-brand-primary text-sm font-semibold">
                                            {dbUser?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white border border-purple-200 rounded-xl shadow-md overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-gray-900 text-sm font-semibold truncate">{dbUser?.name}</p>
                                        <p className="text-gray-400 text-xs truncate">{dbUser?.email}</p>
                                    </div>

                                    <Link href="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-brand-primary">
                                        Profile
                                    </Link>
                                    <Link href="/billing" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-purple-50 hover:text-brand-primary">
                                        Billing
                                    </Link>

                                    <div className="border-t border-gray-100">
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login" className="text-sm px-3 py-1.5 rounded-md hover:bg-gray-50">Login</Link>
                            <Link href="/register" className="text-sm border border-brand-primary text-brand-primary px-4 py-1.5 rounded-md hover:bg-purple-50">
                                Register
                            </Link>
                        </div>
                    )}
                </div>


                <button
                    className="md:hidden p-1"
                    onClick={() => {
                        setMenuOpen(!menuOpen)
                        setMoreOpen(false)
                    }}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>


            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                    menuOpen ? "max-h-175 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">


                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm px-3 py-2 rounded-md ${
                                isActive(link.href)
                                    ? "text-brand-primary bg-purple-50"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}


                    <div>
                        <button
                            onClick={() => setMoreOpen(!moreOpen)}
                            className="w-full flex justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                        >
                            More
                            <FiChevronDown className={`transition ${moreOpen ? "rotate-180" : ""}`} />
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ${
                                moreOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            {moreLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => {
                                        setMenuOpen(false)
                                        setMoreOpen(false)
                                    }}
                                    className="block px-5 py-2 text-sm text-gray-600 hover:bg-purple-50 hover:text-brand-primary"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>


                    <div className="mt-3 pt-3 border-t border-gray-100">
                        {user ? (
                            <div className="flex flex-col gap-1">
                                <Link
                                    href="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-50"
                                >
                                    {dbUser?.avatarUrl ? (
                                        <Image src={dbUser.avatarUrl} alt="" width={30} height={30} className="rounded-full border border-brand-primary" />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full border border-brand-primary flex items-center justify-center">
                                            <span className="text-xs text-brand-primary font-semibold">
                                                {dbUser?.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium">{dbUser?.name}</p>
                                        <p className="text-xs text-gray-400">View Profile</p>
                                    </div>
                                </Link>

                                <Link href="/billing" onClick={() => setMenuOpen(false)} className="px-3 py-2 text-sm hover:bg-purple-50 rounded-md">
                                    Billing
                                </Link>

                                <button onClick={handleLogout} className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md text-left">
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-center text-sm px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-center text-sm px-4 py-2 rounded-md border border-brand-primary text-brand-primary hover:bg-purple-50 font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}