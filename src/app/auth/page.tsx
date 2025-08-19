'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'

type AuthView = 'login' | 'signup'

export default function AuthPage() {
  const { isAuthenticated, login } = useAuthStore()
  const { setTheme } = useThemeStore()
  const router = useRouter()
  const [authView, setAuthView] = useState<AuthView>('login')

  // Initialize theme on mount
  useEffect(() => {
    setTheme('system')
  }, [setTheme])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleGuestAccess = async () => {
    try {
      // Create a guest user with a proper JWT-like token
      const guestUser = {
        id: 'guest-' + Date.now(),
        email: 'guest@todoapp.com',
        name: 'Guest User',
        createdAt: new Date(),
      }

      // Create a backend-friendly guest token that middleware recognizes
      const guestToken = `guest-${Date.now()}`

      // Login the guest user
      login(guestUser, guestToken)

      // Store guest token in localStorage for API calls
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', guestToken)
        // Also set cookie for middleware (optional)
        document.cookie = `auth-token=${guestToken};path=/;SameSite=Strict`
      }

      // Show success message
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success('Welcome as Guest User!')
      })

    } catch (error) {
      console.error('Guest access error:', error)
      import('react-hot-toast').then(({ default: toast }) => {
        toast.error('Failed to access as guest. Please try again.')
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <AnimatePresence mode="wait">
          {authView === 'login' ? (
            <LoginForm
              key="login"
              onSwitchToSignup={() => setAuthView('signup')}
              onGuestAccess={handleGuestAccess}
            />
          ) : (
            <SignupForm
              key="signup"
              onSwitchToLogin={() => setAuthView('login')}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-200 dark:bg-secondary-700 rounded-full opacity-20 blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary-300 dark:bg-primary-700 rounded-full opacity-10 blur-lg" />
    </div>
  )
}
