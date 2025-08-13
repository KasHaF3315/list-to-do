'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import FilterBar from '@/components/todo/FilterBar'
import TodoList from '@/components/todo/TodoList'
import TodoForm from '@/components/todo/Page'
import Statistics from '@/components/todo/Statistics'

export default function DashboardPage() {
  const [showTodoForm, setShowTodoForm] = useState(false)

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
