'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth'
import Cookies from 'js-cookie'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'

interface DbUser {
    id:           string
    email:        string
    name:         string
    avatarUrl:    string | null
    role:         'USER' | 'ADMIN'
    status:       'ACTIVE' | 'SUSPENDED'
    createdAt:    string
    updatedAt:    string | null
    subscription: {
        id:          string
        plan:        'FREE' | 'PRO' | 'ULTIMATE'
        urlLimit:    number
        urlsCreated: number
        purchasedAt: string
        lastResetAt: string
    } | null
}

interface AuthContextType {
    user:           User | null
    dbUser:         DbUser | null
    loading:        boolean
    login:          (email: string, password: string) => Promise<void>
    register:       (email: string, password: string, name: string) => Promise<void>
    googleLogin:    () => Promise<void>
    logout:         () => Promise<void>
    forgotPassword: (email: string) => Promise<void>
    refreshDbUser:  () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user,    setUser]    = useState<User | null>(null)
    const [dbUser,  setDbUser]  = useState<DbUser | null>(null)
    const [loading, setLoading] = useState(true)
    const skipSync              = useRef(false)

    const fetchDbUser = async (firebaseUser: User): Promise<DbUser | null> => {
        try {
            const token = await firebaseUser.getIdToken()
            Cookies.set('token', token, { expires: 7 })
            const res      = await api.get('/users/me')
            const userData = res.data.data as DbUser
            Cookies.set('role', userData.role, { expires: 7 })
            return userData
        } catch (err: unknown) {
            const error = err as { response?: { status?: number } }
            if (error?.response?.status === 404) return null
            console.error('fetchDbUser error', err)
            return null
        }
    }

    const refreshDbUser = async () => {
        if (!user) return
        const userData = await fetchDbUser(user)
        if (userData) setDbUser(userData)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (skipSync.current) {
                setLoading(false)
                return
            }
            setUser(firebaseUser)
            if (firebaseUser) {
                const userData = await fetchDbUser(firebaseUser)
                if (userData) setDbUser(userData)
            } else {
                setDbUser(null)
                Cookies.remove('token')
                Cookies.remove('role')
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const register = async (email: string, password: string, name: string) => {
        skipSync.current = true
        try {
            await api.post('/auth/register', { email, password, name })

            const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
            const token = await firebaseUser.getIdToken()
            Cookies.set('token', token, { expires: 7 })

            const userData = await fetchDbUser(firebaseUser)
            if (userData) {
                setDbUser(userData)
                Cookies.set('role', userData.role, { expires: 7 })
            }

            setUser(firebaseUser)
        } catch (err: unknown) {
            const error = err as {
                response?: { data?: { message?: string } }
                message?:  string
            }
            const message = error?.response?.data?.message ?? error?.message
            if (message === 'Email already exists') throw new Error('Email already in use')
            throw new Error(message ?? 'Registration failed')
        } finally {
            skipSync.current = false
        }
    }

    const login = async (email: string, password: string) => {
        skipSync.current = true
        try {
            const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password)
            const token = await firebaseUser.getIdToken()
            Cookies.set('token', token, { expires: 7 })

            const userData = await fetchDbUser(firebaseUser)
            if (!userData) throw new Error('User not found')
            if (userData.status === 'SUSPENDED') throw new Error('Account suspended')

            setUser(firebaseUser)
            setDbUser(userData)
        } catch (err: unknown) {
            const error = err as { code?: string, message?: string }
            if (
                error?.code === 'auth/invalid-credential' ||
                error?.code === 'auth/wrong-password'     ||
                error?.code === 'auth/user-not-found'
            ) {
                throw new Error('Invalid email or password')
            }
            throw new Error(error?.message ?? 'Login failed')
        } finally {
            skipSync.current = false
        }
    }

    const googleLogin = async () => {
        skipSync.current = true
        try {
            const provider               = new GoogleAuthProvider()
            const { user: firebaseUser } = await signInWithPopup(auth, provider)
            const token                  = await firebaseUser.getIdToken()
            Cookies.set('token', token, { expires: 7 })

            await api.post('/auth/google', {
                email:     firebaseUser.email,
                name:      firebaseUser.displayName,
                avatarUrl: firebaseUser.photoURL,
            })
            const userData = await fetchDbUser(firebaseUser)
            if (userData) {
                setDbUser(userData)
                Cookies.set('role', userData.role, { expires: 7 })
            }

            setUser(firebaseUser)
        } catch (err: unknown) {
            const error = err as { code?: string, message?: string }
            if (error?.code === 'auth/popup-closed-by-user') return
            throw new Error(error?.message ?? 'Google login failed')
        } finally {
            skipSync.current = false
        }
    }

    const logout = async () => {
        await signOut(auth)
        Cookies.remove('token')
        Cookies.remove('role')
        setUser(null)
        setDbUser(null)
    }

    const forgotPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email)
    }

    return (
        <AuthContext.Provider value={{
            user,
            dbUser,
            loading,
            login,
            register,
            googleLogin,
            logout,
            forgotPassword,
            refreshDbUser,
        }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)