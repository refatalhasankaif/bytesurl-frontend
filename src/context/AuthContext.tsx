'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
    User,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth'
import Cookies from 'js-cookie'
import { auth } from '@/lib/firebase'
import api from '@/lib/api'

interface DbUser {
    id:          string
    email:       string
    name:        string
    avatarUrl:   string | null
    role:        'USER' | 'ADMIN'
    status:      'ACTIVE' | 'SUSPENDED'
    createdAt:   string
    updatedAt:   string | null
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

    const syncUserToDB = async (firebaseUser: User) => {
        try {
            const token = await firebaseUser.getIdToken()
            Cookies.set('token', token, { expires: 7 })

            const res      = await api.get('/users/me')
            const userData = res.data.data as DbUser

            Cookies.set('role', userData.role, { expires: 7 })
            setDbUser(userData)
        } catch (err) {
            console.error('Failed to sync user', err)
        }
    }

    const refreshDbUser = async () => {
        try {
            const res      = await api.get('/users/me')
            const userData = res.data.data as DbUser
            Cookies.set('role', userData.role, { expires: 7 })
            setDbUser(userData)
        } catch (err) {
            console.error('Failed to refresh user', err)
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser)
            if (firebaseUser) {
                await syncUserToDB(firebaseUser)
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
        const { user } = await createUserWithEmailAndPassword(auth, email, password)

        const token = await user.getIdToken()
        Cookies.set('token', token, { expires: 7 })

        const res      = await api.post('/auth/register', { email, name })
        const userData = res.data.data as DbUser
        Cookies.set('role', userData.role, { expires: 7 })

        await syncUserToDB(user)
        setUser(user)
    }

    const login = async (email: string, password: string) => {
        const res                     = await api.post('/auth/login', { email, password })
        const { token, user: dbUserData } = res.data.data

        Cookies.set('token', token,         { expires: 7 })
        Cookies.set('role',  dbUserData.role, { expires: 7 })
        setDbUser(dbUserData as DbUser)
    }

    const googleLogin = async () => {
        const provider = new GoogleAuthProvider()
        const { user } = await signInWithPopup(auth, provider)

        const token = await user.getIdToken()
        Cookies.set('token', token, { expires: 7 })

        const res      = await api.post('/auth/google', {
            email:     user.email,
            name:      user.displayName,
            avatarUrl: user.photoURL,
        })
        const userData = res.data.data as DbUser
        Cookies.set('role', userData.role, { expires: 7 })

        await syncUserToDB(user)
        setUser(user)
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