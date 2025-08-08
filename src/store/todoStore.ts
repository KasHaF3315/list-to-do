import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { Todo, TodoFilter, TodoSort } from '@/types'
import { generateId } from '@/lib/utils'
import { api } from '@/lib/api'
import { DEFAULT_VALUES } from '@/config'

export interface TodoStore {
  todos: Todo[]
  filter: TodoFilter
  sort: TodoSort
  searchQuery: string
  selectedCategory: string
  isLoading: boolean
  error: string | null

  fetchTodos: () => Promise<void>
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  setFilter: (filter: TodoFilter) => void
  setSort: (sort: TodoSort) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  clearCompleted: () => Promise<void>

  // Computed properties
  filteredTodos: () => Todo[]
  sortedAndFilteredTodos: () => Todo[]
  completedCount: () => number
  activeCount: () => number
  categories: () => string[]
}

export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      (set, get) => ({
        todos: [],
        filter: 'all',
        sort: 'created',
        searchQuery: '',
        selectedCategory: '',
        isLoading: false,
        error: null,

        fetchTodos: async () => {
          set({ isLoading: true, error: null })
          try {
            const todos = await api.todos.getAll()
            set({ todos, isLoading: false })
          } catch (error) {
            console.error('Error fetching todos:', error)
            set({ 
              error: error instanceof Error ? error.message : 'Failed to fetch todos', 
              isLoading: false 
            })
          }
        },

        addTodo: async (todoData) => {
          set({ isLoading: true, error: null })
          try {
            // Add default userId if not provided
            if (!todoData.userId) {
              todoData.userId = DEFAULT_VALUES.defaultUserId
            }
            
            const newTodo = await api.todos.create(todoData)
            set((state) => ({
              todos: [newTodo, ...state.todos],
              isLoading: false
            }))
          } catch (error) {
            console.error('Error adding todo:', error)
            set({ 
              error: error instanceof Error ? error.message : 'Failed to add todo', 
              isLoading: false 
            })
            // Fallback to local creation if API fails
            const newTodo: Todo = {
              ...todoData,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
            }
            set((state) => ({
              todos: [newTodo, ...state.todos],
            }))
          }
        },

        updateTodo: async (id, updates) => {
          set({ isLoading: true, error: null })
          try {
            const updatedTodo = await api.todos.update(id, updates)
            set((state) => ({
              todos: state.todos.map((todo) =>
                todo.id === id ? updatedTodo : todo
              ),
              isLoading: false
            }))
          } catch (error) {
            console.error('Error updating todo:', error)
            set({ 
              error: error instanceof Error ? error.message : 'Failed to update todo', 
              isLoading: false 
            })
            // Fallback to local update if API fails
            set((state) => ({
              todos: state.todos.map((todo) =>
                todo.id === id
                  ? { ...todo, ...updates, updatedAt: new Date() }
                  : todo
              ),
            }))
          }
        },

        deleteTodo: async (id) => {
          set({ isLoading: true, error: null })
          try {
            await api.todos.delete(id)
            set((state) => ({
              todos: state.todos.filter((todo) => todo.id !== id),
              isLoading: false
            }))
          } catch (error) {
            console.error('Error deleting todo:', error)
            set({ 
              error: error instanceof Error ? error.message : 'Failed to delete todo', 
              isLoading: false 
            })
            // Fallback to local deletion if API fails
            set((state) => ({
              todos: state.todos.filter((todo) => todo.id !== id),
            }))
          }
        },

        toggleTodo: async (id) => {
          const todo = get().todos.find((t) => t.id === id)
          if (!todo) return
          
          set({ isLoading: true, error: null })
          try {
            const updatedTodo = await api.todos.update(id, { completed: !todo.completed })
            set((state) => ({
              todos: state.todos.map((t) =>
                t.id === id ? updatedTodo : t
              ),
              isLoading: false
            }))
          } catch (error) {
            console.error('Error toggling todo:', error)
            set({ 
              error: error instanceof Error ? error.message : 'Failed to toggle todo', 
              isLoading: false 
            })
            // Fallback to local toggle if API fails
            set((state) => ({
              todos: state.todos.map((t) =>
                t.id === id
                  ? { ...t, completed: !t.completed, updatedAt: new Date() }
                  : t
              ),
            }))
          }
        },

        setFilter: (filter) => set({ filter }),
        setSort: (sort) => set({ sort }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSelectedCategory: (category) => set({ selectedCategory: category }),

        clearCompleted: async () => {
          const completedTodos = get().todos.filter((todo) => todo.completed)
          set({ isLoading: true, error: null })
          
          try {
            // Delete each completed todo from the API
            await Promise.all(
              completedTodos.map((todo) => api.todos.delete(todo.id))
            )
            
            set((state) => ({
              todos: state.todos.filter((todo) => !todo.completed),
              isLoading: false
            }))
          } catch (error) {
            console.error('Error clearing completed todos:', error)
            set({ 
              error: error instanceof Error ? error.message : 'Failed to clear completed todos', 
              isLoading: false 
            })
            // Fallback to local clearing if API fails
            set((state) => ({
              todos: state.todos.filter((todo) => !todo.completed),
            }))
          }
        },

        getFilteredTodos: () => {
          const { todos, filter, searchQuery, selectedCategory, sort } = get()
          
          let filtered = todos

          // Filter by completion status
          if (filter === 'active') {
            filtered = filtered.filter((todo) => !todo.completed)
          } else if (filter === 'completed') {
            filtered = filtered.filter((todo) => todo.completed)
          }

          // Filter by search query
          if (searchQuery) {
            filtered = filtered.filter((todo) =>
              todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            )
          }

          // Filter by category
          if (selectedCategory) {
            filtered = filtered.filter((todo) => todo.category === selectedCategory)
          }

          // Sort todos
          filtered.sort((a, b) => {
            switch (sort) {
              case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                return priorityOrder[b.priority] - priorityOrder[a.priority]
              case 'dueDate':
                if (!a.dueDate && !b.dueDate) return 0
                if (!a.dueDate) return 1
                if (!b.dueDate) return -1
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              case 'updated':
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              case 'created':
              default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
          })

          return filtered
        },

        getStats: () => {
          const { todos } = get()
          const total = todos.length
          const completed = todos.filter((todo) => todo.completed).length
          const active = total - completed
          const overdue = todos.filter((todo) => 
            todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
          ).length

          return { total, completed, active, overdue }
        },

        getCategories: () => {
          const { todos } = get()
          const categories = Array.from(new Set(todos.map((todo) => todo.category)))
          return categories.filter(Boolean)
        },

        // Computed properties
        filteredTodos: () => {
          const { todos, filter, searchQuery, selectedCategory, sort } = get()
          
          let filtered = todos

          // Filter by completion status
          if (filter === 'active') {
            filtered = filtered.filter((todo) => !todo.completed)
          } else if (filter === 'completed') {
            filtered = filtered.filter((todo) => todo.completed)
          }

          // Filter by search query
          if (searchQuery) {
            filtered = filtered.filter((todo) =>
              todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              todo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              todo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            )
          }

          // Filter by category
          if (selectedCategory) {
            filtered = filtered.filter((todo) => todo.category === selectedCategory)
          }

          // Sort todos
          if (sort === 'created') {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          } else if (sort === 'updated') {
            filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          } else if (sort === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
          } else if (sort === 'dueDate') {
            filtered.sort((a, b) => {
              if (!a.dueDate && !b.dueDate) return 0
              if (!a.dueDate) return 1
              if (!b.dueDate) return -1
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            })
          }

          return filtered
        },

        sortedAndFilteredTodos: () => {
          return get().filteredTodos()
        },

        completedCount: () => {
          const { todos } = get()
          return todos.filter((todo) => todo.completed).length
        },

        activeCount: () => {
          const { todos } = get()
          return todos.filter((todo) => !todo.completed).length
        },

        categories: () => {
          const { todos } = get()
          const categories = Array.from(new Set(todos.map((todo) => todo.category)))
          return categories.filter(Boolean)
        },
      }),
      {
        name: 'todo-storage',
        partialize: (state) => ({
          todos: state.todos,
          filter: state.filter,
          sort: state.sort,
        }),
      }
    ),
    { name: 'todo-store' }
  )
)
