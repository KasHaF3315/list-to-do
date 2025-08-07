import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isYesterday, isPast } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  if (isToday(date)) {
    return 'Today'
  } else if (isTomorrow(date)) {
    return 'Tomorrow'
  } else if (isYesterday(date)) {
    return 'Yesterday'
  } else {
    return format(date, 'MMM dd, yyyy')
  }
}

export function formatDateTime(date: Date): string {
  return format(date, 'MMM dd, yyyy HH:mm')
}

export function isOverdue(date: Date): boolean {
  return isPast(date) && !isToday(date)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  let score = 0
  
  if (password.length >= 8) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[@$!%*?&]/.test(password)) score++
  
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  
  return {
    score,
    label: labels[score] || 'Very Weak',
    color: colors[score] || 'bg-red-500'
  }
}
