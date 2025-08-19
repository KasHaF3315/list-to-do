export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  tags: string[]
  dueDate?: Date
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  tags?: string[];
  dueDate?: Date;
}

export interface User {
  id: string
  email: string
  password?: string
  name: string
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type TodoFilter = 'all' | 'active' | 'completed'
export type TodoSort = 'created' | 'updated' | 'priority' | 'dueDate'

export interface TodoStats {
  total: number
  completed: number
  active: number
  overdue: number
}
