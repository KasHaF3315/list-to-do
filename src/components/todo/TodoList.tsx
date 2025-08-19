'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTodoStore } from '@/store/todoStore'
import { Todo } from '@/types'
import TodoItem from './TodoItem'
import TodoForm from './Page'
import Loading from '../ui/Loading'

const TodoList = () => {
  const { sortedAndFilteredTodos, fetchTodos, isLoading, error } = useTodoStore()
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const todos = sortedAndFilteredTodos()

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditTodo(null)
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center py-12"
      >
        <Loading size="lg" text="Loading todos..." />
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-error-500 dark:text-error-400">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            Error loading todos
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400">
            {error}
          </p>
        </div>
      </motion.div>
    )
  }

  if (todos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-secondary-400 dark:text-secondary-500">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            No todos found
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400">
            Get started by creating your first todo item.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onEdit={handleEdit}
            />
          ))}
        </AnimatePresence>
      </div>

      <TodoForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTodo={editTodo}
      />
    </>
  )
}

export default TodoList
