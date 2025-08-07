import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { Todo, TodoFilter, TodoSort, TodoStats } from '@/types'
import { generateId } from '@/lib/utils'

interface TodoStore {
  todos: Todo[]
  filter: TodoFilter
  sort: TodoSort
  searchQuery: string
  selectedCategory: string
  
  // Actions
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  setFilter: (filter: TodoFilter) => void
  setSort: (sort: TodoSort) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string) => void
  clearCompleted: () => void
  
  // Getters
  getFilteredTodos: () => Todo[]
  getStats: () => TodoStats
  getCategories: () => string[]
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

        addTodo: (todoData) => {
          const newTodo: Todo = {
            ...todoData,
            id: generateId(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          set((state) => ({
            todos: [newTodo, ...state.todos],
          }))
        },

        updateTodo: (id, updates) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? { ...todo, ...updates, updatedAt: new Date() }
                : todo
            ),
          }))
        },

        deleteTodo: (id) => {
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }))
        },

        toggleTodo: (id) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
                : todo
            ),
          }))
        },

        setFilter: (filter) => set({ filter }),
        setSort: (sort) => set({ sort }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSelectedCategory: (category) => set({ selectedCategory: category }),

        clearCompleted: () => {
          set((state) => ({
            todos: state.todos.filter((todo) => !todo.completed),
          }))
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
