import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
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
  lastSync: Date | null

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
  clearAllTodos: () => void
  syncWithBackend: () => Promise<void>

  // Computed & helper methods
  filteredTodos: () => Todo[]
  sortedAndFilteredTodos: () => Todo[]
  completedCount: () => number
  activeCount: () => number
  categories: () => string[]
  getFilteredTodos: () => Todo[]
  getStats: () => { total: number; completed: number; active: number; overdue: number }
  getCategories: () => string[]
}

// Get current user ID for storage isolation
const getCurrentUserId = (): string => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId || 'anonymous';
      } catch {
        return 'anonymous';
      }
    }
  }
  return 'anonymous';
};

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
        lastSync: null,

        fetchTodos: async () => {
          set({ isLoading: true, error: null })
          try {
            const todos = await api.todos.getAll()
            set({
              todos,
              isLoading: false,
              lastSync: new Date(),
              error: null
            })
            console.log('Todos fetched successfully:', todos.length)
          } catch (error) {
            console.error('Error fetching todos:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch todos',
              isLoading: false
            })
            // Fallback to local storage if backend is unavailable
            console.log('Falling back to local storage')
          }
        },

        addTodo: async (todoData) => {
          set({ isLoading: true, error: null })
          try {
            if (!todoData.userId) {
              todoData.userId = DEFAULT_VALUES.defaultUserId
            }
            const newTodo = await api.todos.create(todoData)
            set((state) => ({
              todos: [newTodo, ...state.todos],
              isLoading: false,
              error: null
            }))
            console.log('Todo added successfully:', newTodo.title)
          } catch (error) {
            console.error('Error adding todo:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to add todo',
              isLoading: false
            })
            // Fallback: add to local state
            const newTodo: Todo = {
              ...todoData,
              id: generateId(),
              createdAt: new Date(),
              updatedAt: new Date(),
              completed: false
            }
            set((state) => ({
              todos: [newTodo, ...state.todos],
              isLoading: false
            }))
            console.log('Todo added to local storage as fallback')
          }
        },

        updateTodo: async (id, updates) => {
          set({ isLoading: true, error: null })
          try {
            const updatedTodo = await api.todos.update(id, updates)
            set((state) => ({
              todos: state.todos.map(todo =>
                todo.id === id ? updatedTodo : todo
              ),
              isLoading: false,
              error: null
            }))
            console.log('Todo updated successfully:', updatedTodo.title)
          } catch (error) {
            console.error('Error updating todo:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to update todo',
              isLoading: false
            })
            // Fallback: update local state
            set((state) => ({
              todos: state.todos.map(todo =>
                todo.id === id
                  ? { ...todo, ...updates, updatedAt: new Date() }
                  : todo
              ),
              isLoading: false
            }))
            console.log('Todo updated in local storage as fallback')
          }
        },

        deleteTodo: async (id) => {
          set({ isLoading: true, error: null })
          try {
            await api.todos.delete(id)
            set((state) => ({
              todos: state.todos.filter(todo => todo.id !== id),
              isLoading: false,
              error: null
            }))
            console.log('Todo deleted successfully')
          } catch (error) {
            console.error('Error deleting todo:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to delete todo',
              isLoading: false
            })
            // Fallback: remove from local state
            set((state) => ({
              todos: state.todos.filter(todo => todo.id !== id),
              isLoading: false
            }))
            console.log('Todo removed from local storage as fallback')
          }
        },

        toggleTodo: async (id) => {
          const todo = get().todos.find(t => t.id === id)
          if (!todo) return

          const updates = { completed: !todo.completed }
          await get().updateTodo(id, updates)
        },

        clearCompleted: async () => {
          const completedTodos = get().todos.filter(todo => todo.completed)
          set({ isLoading: true, error: null })

          try {
            // Delete all completed todos from backend
            await Promise.all(
              completedTodos.map(todo => api.todos.delete(todo.id))
            )

            set((state) => ({
              todos: state.todos.filter(todo => !todo.completed),
              isLoading: false,
              error: null
            }))
            console.log('Completed todos cleared successfully')
          } catch (error) {
            console.error('Error clearing completed todos:', error)
            set({
              error: error instanceof Error ? error.message : 'Failed to clear completed todos',
              isLoading: false
            })
            // Fallback: clear from local state
            set((state) => ({
              todos: state.todos.filter(todo => !todo.completed),
              isLoading: false
            }))
            console.log('Completed todos cleared from local storage as fallback')
          }
        },

        syncWithBackend: async () => {
          console.log('Syncing with backend...')
          await get().fetchTodos()
        },

        setFilter: (filter) => set({ filter }),
        setSort: (sort) => set({ sort }),
        setSearchQuery: (query) => set({ searchQuery: query }),
        setSelectedCategory: (category) => set({ selectedCategory: category }),
        clearAllTodos: () => set({ todos: [], error: null }),

        // Computed methods
        filteredTodos: () => {
          const { todos, filter, searchQuery, selectedCategory } = get()
          let filtered = todos

          // Apply search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(todo =>
              todo.title.toLowerCase().includes(query) ||
              (todo.description && todo.description.toLowerCase().includes(query)) ||
              todo.tags.some(tag => tag.toLowerCase().includes(query))
            )
          }

          // Apply category filter
          if (selectedCategory) {
            filtered = filtered.filter(todo => todo.category === selectedCategory)
          }

          // Apply completion filter
          switch (filter) {
            case 'active':
              filtered = filtered.filter(todo => !todo.completed)
              break
            case 'completed':
              filtered = filtered.filter(todo => todo.completed)
              break
            default:
              break
          }

          return filtered
        },

        sortedAndFilteredTodos: () => {
          const filtered = get().filteredTodos()
          const { sort } = get()

          return [...filtered].sort((a, b) => {
            switch (sort) {
              case 'created':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              case 'updated':
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              case 'dueDate':
                if (!a.dueDate && !b.dueDate) return 0
                if (!a.dueDate) return 1
                if (!b.dueDate) return -1
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 }
                return priorityOrder[b.priority] - priorityOrder[a.priority]
              default:
                return 0
            }
          })
        },

        completedCount: () => get().todos.filter(todo => todo.completed).length,
        activeCount: () => get().todos.filter(todo => !todo.completed).length,
        categories: () => Array.from(new Set(get().todos.map(todo => todo.category))),
        getFilteredTodos: () => get().sortedAndFilteredTodos(),
        getCategories: () => get().categories(),

        getStats: () => {
          const todos = get().todos
          const now = new Date()
          return {
            total: todos.length,
            completed: todos.filter(todo => todo.completed).length,
            active: todos.filter(todo => !todo.completed).length,
            overdue: todos.filter(todo =>
              !todo.completed &&
              todo.dueDate &&
              new Date(todo.dueDate) < now
            ).length
          }
        },
      }),
      {
        name: `todo-storage-${getCurrentUserId()}`,
        storage: typeof window !== 'undefined'
          ? createJSONStorage(() => localStorage)
          : undefined,
        partialize: (state) => ({
          todos: state.todos,
          filter: state.filter,
          sort: state.sort,
          searchQuery: state.searchQuery,
          selectedCategory: state.selectedCategory,
          lastSync: state.lastSync
        })
      }
    )
  )
)
