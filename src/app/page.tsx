'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import Header from '@/components/layout/Header'
import FilterBar from '@/components/todo/FilterBar'
import TodoList from '@/components/todo/TodoList'
import TodoForm from '@/components/todo/TodoForm'
import Statistics from '@/components/todo/Statistics'

type AuthView = 'login' | 'signup'

export default function Home() {
  const { isAuthenticated, login } = useAuthStore()
  const { setTheme } = useThemeStore()
  const [authView, setAuthView] = useState<AuthView>('login')
  const [showTodoForm, setShowTodoForm] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setTheme('system')
  }, [setTheme])

  const handleGuestAccess = () => {
    const guestUser = {
      id: 'guest',
      email: 'guest@todoapp.com',
      name: 'Guest User',
      createdAt: new Date(),
    }
    login(guestUser, 'guest-token')
  }

  if (!isAuthenticated) {
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

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Header onCreateTodo={() => setShowTodoForm(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FilterBar />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TodoList />
            </motion.div>
          </div>

          {/* Sidebar - Shows at top on mobile */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-8"
            >
              <Statistics />
            </motion.div>
          </div>
        </div>
      </main>

      <TodoForm
        isOpen={showTodoForm}
        onClose={() => setShowTodoForm(false)}
      />
    </div>
  )
}
