'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useRouter, usePathname } from 'next/navigation'

interface AuthProviderProps {
    children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const { initializeAuth, isAuthenticated, isLoading } = useAuthStore()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Initialize authentication on mount
        initializeAuth()
    }, [initializeAuth])

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

    // Show loading state while initializing
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
