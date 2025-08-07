'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTodoStore } from '@/store/todoStore'
import { Todo } from '@/types'
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'

const TodoList = () => {
  const { getFilteredTodos } = useTodoStore()
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const todos = getFilteredTodos()

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditTodo(null)
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
