'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth')
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    return <>{children}</>
}
