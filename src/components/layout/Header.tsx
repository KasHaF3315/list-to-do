'use client'

import { motion } from 'framer-motion'
import { Plus, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useTodoStore } from '@/store/todoStore'
import Button from '../ui/Button'
import ThemeToggle from '../ui/ThemeToggle'
import toast from 'react-hot-toast'

interface HeaderProps {
  onCreateTodo: () => void
}

const Header = ({ onCreateTodo }: HeaderProps) => {
  const { user, logout } = useAuthStore()
  const { getStats } = useTodoStore()
  const stats = getStats()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-secondary-900 dark:text-white">
                TodoApp
              </h1>
              {stats.total > 0 && (
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {stats.active} active, {stats.completed} completed
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={onCreateTodo}
            className="flex items-center space-x-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Todo</span>
          </Button>

          <ThemeToggle />

          <div className="flex items-center space-x-2 pl-4 border-l border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {user?.email || 'guest@todoapp.com'}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2"
              title="Logout"
            >
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
