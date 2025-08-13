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
    localStorage.removeItem('token')

  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700 px-4 sm:px-6 py-3 sm:py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm sm:text-base">T</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-secondary-900 dark:text-white whitespace-nowrap">
                TodoApp
              </h1>
              {stats.total > 0 && (
                <p className="text-xs text-secondary-500 dark:text-secondary-400 hidden sm:block">
                  {stats.active} active, {stats.completed} completed
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <Button
            onClick={onCreateTodo}
            className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base"
            size="sm"
          >
            <Plus size={16} className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">New</span>
            <span className="hidden sm:inline">Todo</span>
          </Button>

          <ThemeToggle />

          <div className="flex items-center space-x-1 sm:space-x-2 pl-2 sm:pl-4 border-l border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={14} className="sm:w-4 sm:h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="hidden md:block min-w-0">
                <p className="text-sm font-medium text-secondary-900 dark:text-white truncate max-w-[120px]">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate max-w-[120px]">
                  {user?.email || 'guest@todoapp.com'}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="p-2 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
              title="Logout"
            >
              <LogOut size={14} className="sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile stats bar */}
      {stats.total > 0 && (
        <div className="sm:hidden mt-2 pt-2 border-t border-secondary-200 dark:border-secondary-700">
          <div className="flex justify-center space-x-4 text-xs text-secondary-500 dark:text-secondary-400">
            <span>{stats.active} active</span>
            <span>•</span>
            <span>{stats.completed} completed</span>
            {stats.overdue > 0 && (
              <>
                <span>•</span>
                <span className="text-red-500">{stats.overdue} overdue</span>
              </>
            )}
          </div>
        </div>
      )}
    </motion.header>
  )
}

export default Header
