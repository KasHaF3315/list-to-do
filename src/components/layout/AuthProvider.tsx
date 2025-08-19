'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'

interface AuthProviderProps {
    children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const { initializeAuth, isAuthenticated, isLoading, setLoading } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Initialize authentication on mount
        initializeAuth()
        // Fallback: if loading hasn’t resolved (e.g., tunnel quirks), clear after 2s
        const t = setTimeout(() => {
            if (useAuthStore.getState().isLoading) {
                setLoading(false)
            }
        }, 2000)
        return () => clearTimeout(t)
    }, [initializeAuth, setLoading])

    useEffect(() => {
        // Handle authentication-based routing
        if (!isLoading) {
            const publicRoutes = ['/auth', '/']
            const isPublicRoute = publicRoutes.includes(pathname || '')

            if (!isAuthenticated && !isPublicRoute) {
                router.push('/auth')
            } else if (isAuthenticated && pathname === '/auth') {
                router.push('/dashboard')
            }
        }
    }, [isAuthenticated, isLoading, pathname, router])

    // Always render children to avoid tunnel-induced stuck loading screens

    return <>{children}</>
}
