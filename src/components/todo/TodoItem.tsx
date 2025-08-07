'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Edit, Trash2, Calendar, Tag, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Todo } from '@/types'
import { useTodoStore } from '@/store/todoStore'
import { cn, isOverdue } from '@/lib/utils'
import Button from '../ui/Button'
import Card from '../ui/Card'

interface TodoItemProps {
  todo: Todo
  onEdit: (todo: Todo) => void
}

const TodoItem = ({ todo, onEdit }: TodoItemProps) => {
  const { toggleTodo, deleteTodo } = useTodoStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    deleteTodo(todo.id)
  }

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const isTaskOverdue = todo.dueDate && isOverdue(new Date(todo.dueDate))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group',
        isDeleting && 'opacity-50 pointer-events-none'
      )}
    >
      <Card hover className={cn(
        'transition-all duration-200',
        todo.completed && 'opacity-75',
        isTaskOverdue && !todo.completed && 'border-error-300 dark:border-error-600'
      )}>
        <div className="flex items-start space-x-4">
          <button
            onClick={() => toggleTodo(todo.id)}
            className={cn(
              'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
              todo.completed
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-secondary-300 dark:border-secondary-600 hover:border-primary-500'
            )}
          >
            {todo.completed && <Check size={12} />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={cn(
                  'font-medium text-secondary-900 dark:text-white',
                  todo.completed && 'line-through text-secondary-500'
                )}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={cn(
                    'mt-1 text-sm text-secondary-600 dark:text-secondary-400',
                    todo.completed && 'line-through'
                  )}>
                    {todo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(todo)}
                  className="p-1 h-8 w-8"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="p-1 h-8 w-8 text-error-600 hover:text-error-700"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-2 mt-3">
              <span className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                priorityColors[todo.priority]
              )}>
                {todo.priority}
              </span>

              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200">
                {todo.category}
              </span>

              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </span>
              ))}

              {todo.dueDate && (
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  isTaskOverdue && !todo.completed
                    ? 'bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-400'
                    : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-700 dark:text-secondary-200'
                )}>
                  <Calendar size={10} className="mr-1" />
                  {format(new Date(todo.dueDate), 'MMM dd')}
                  {isTaskOverdue && !todo.completed && (
                    <AlertCircle size={10} className="ml-1" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default TodoItem
