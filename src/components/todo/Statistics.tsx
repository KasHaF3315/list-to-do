'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle, AlertTriangle, Calendar } from 'lucide-react'
import { useTodoStore } from '@/store/todoStore'
import Card from '../ui/Card'

const Statistics = () => {
  const { completedCount, activeCount, todos, isLoading } = useTodoStore()
  
  // Calculate statistics
  const total = todos.length
  const completed = completedCount()
  const active = activeCount()
  const overdue = todos.filter(todo => todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date()).length
  
  const stats = { total, completed, active, overdue }

  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      label: 'Active Tasks',
      value: stats.active,
      icon: Circle,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
    },
  ]

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
            ))}
          </div>
          <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2"></div>
          <div className="h-8 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Stats Grid - Responsive layout */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="min-w-0 px-3 sm:px-4 py-4 sm:py-5 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg ${item.bgColor} flex-shrink-0`}>
                  <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base sm:text-lg font-bold text-secondary-900 dark:text-white">
                    {item.value}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-secondary-400 leading-tight">
                    {item.label}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Card */}
      {stats.total > 0 && (
        <Card>
          <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <h3 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white">
                Progress Overview
              </h3>
              <span className="text-xl sm:text-2xl font-bold text-primary-600 self-center sm:self-auto">
                {completionRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3 sm:h-4">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 sm:h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">
              <span>{stats.completed} completed</span>
              <span>{stats.active} remaining</span>
            </div>

            {/* Motivational Message */}
            <div className="text-center pt-2">
              {completionRate === 100 ? (
                <p className="text-green-600 dark:text-green-400 font-medium text-sm sm:text-base">
                  🎉 Congratulations! All tasks completed!
                </p>
              ) : completionRate >= 75 ? (
                <p className="text-blue-600 dark:text-blue-400 font-medium text-sm sm:text-base">
                  🚀 Great progress! You&apos;re almost there!
                </p>
              ) : completionRate >= 50 ? (
                <p className="text-yellow-600 dark:text-yellow-400 font-medium text-sm sm:text-base">
                  💪 Keep going! You&apos;re halfway done!
                </p>
              ) : completionRate > 0 ? (
                <p className="text-orange-600 dark:text-orange-400 font-medium text-sm sm:text-base">
                  🌟 Good start! Keep up the momentum!
                </p>
              ) : (
                <p className="text-secondary-600 dark:text-secondary-400 text-sm sm:text-base">
                  📝 Ready to tackle your tasks?
                </p>
              )}
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  )
}

export default Statistics
