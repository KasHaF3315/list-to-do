'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Plus, Calendar, Tag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { todoSchema, TodoFormData } from '@/lib/validations'
import { useTodoStore } from '@/store/todoStore'
import { Todo } from '@/types'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'

interface TodoFormProps {
  isOpen: boolean
  onClose: () => void
  editTodo?: Todo | null
}

const TodoForm = ({ isOpen, onClose, editTodo }: TodoFormProps) => {
  const { addTodo, updateTodo } = useTodoStore()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      priority: 'medium',
      tags: [],
    }
  })

  useEffect(() => {
    if (editTodo) {
      setValue('title', editTodo.title)
      setValue('description', editTodo.description || '')
      setValue('priority', editTodo.priority)
      setValue('category', editTodo.category)
      setValue('dueDate', editTodo.dueDate ? new Date(editTodo.dueDate) : undefined)
      setTags(editTodo.tags)
    } else {
      reset()
      setTags([])
    }
  }, [editTodo, setValue, reset])

  const onSubmit = (data: TodoFormData) => {
    const userId = 'current-user-id'

    const todoData = {
      ...data,
      tags,
      completed: editTodo?.completed || false,
      userId,
    }

    if (editTodo) {
      updateTodo(editTodo.id, todoData)
      toast.success('Todo updated successfully!')
    } else {
      addTodo(todoData)
      toast.success('Todo created successfully!')
    }

    handleClose()
  }

  const handleClose = () => {
    reset()
    setTags([])
    setTagInput('')
    onClose()
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md my-8"
      >
        <Card className="space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
              {editTodo ? 'Edit Todo' : 'Create New Todo'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1 h-8 w-8"
            >
              <X size={16} />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              {...register('title')}
              label="Title"
              placeholder="What needs to be done?"
              error={errors.title?.message}
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                placeholder="Add a description (optional)"
                rows={3}
                className="flex w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 dark:placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-error-600 dark:text-error-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="flex h-10 w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <Input
                {...register('category')}
                label="Category"
                placeholder="e.g., Work, Personal"
                error={errors.category?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Due Date and Time
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  {...register('dueDate', {
                    valueAsDate: true,
                  })}
                  type="datetime-local"
                  className="datetime-input flex h-12 md:h-10 w-full rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 pl-10 pr-12 py-2 text-base md:text-sm text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400"
                  >
                    <Tag size={10} className="mr-1" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-primary-600"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a tag"
                  className="flex-1 h-10 rounded-md border border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-500 dark:placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  className="h-10 w-10 p-0 flex items-center justify-center shrink-0"
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
              >
                {editTodo ? 'Update Todo' : 'Create Todo'}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default TodoForm
