'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Circle, AlertTriangle, Calendar } from 'lucide-react'
import { useTodoStore } from '@/store/todoStore'
import Card from '../ui/Card'

const Statistics = () => {
  const { getStats } = useTodoStore()
  const stats = getStats()

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.bgColor} mb-3`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div className="text-2xl font-bold text-secondary-900 dark:text-white mb-1">
                {item.value}
              </div>
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                {item.label}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Progress Card */}
      {stats.total > 0 && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Progress Overview
              </h3>
              <span className="text-2xl font-bold text-primary-600">
                {completionRate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>

            <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400">
              <span>{stats.completed} completed</span>
              <span>{stats.active} remaining</span>
            </div>

            {/* Motivational Message */}
            <div className="text-center pt-2">
              {completionRate === 100 ? (
                <p className="text-green-600 dark:text-green-400 font-medium">
                  🎉 Congratulations! All tasks completed!
                </p>
              ) : completionRate >= 75 ? (
                <p className="text-blue-600 dark:text-blue-400 font-medium">
                  🚀 Great progress! You're almost there!
                </p>
              ) : completionRate >= 50 ? (
                <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                  💪 Keep going! You're halfway done!
                </p>
              ) : completionRate > 0 ? (
                <p className="text-orange-600 dark:text-orange-400 font-medium">
                  🌟 Good start! Keep up the momentum!
                </p>
              ) : (
                <p className="text-secondary-600 dark:text-secondary-400">
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
