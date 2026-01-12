import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d)
}

export function calculateDaysRemaining(deadline: string | Date): number {
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  const diff = deadlineDate.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function calculateDaysRemainingInYear(): number {
  const now = new Date()
  const endOfYear = new Date(now.getFullYear(), 11, 31) // December 31
  endOfYear.setHours(23, 59, 59, 999)
  const diff = endOfYear.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-500'
    case 'high':
      return 'bg-orange-500'
    case 'medium':
      return 'bg-yellow-500'
    case 'low':
      return 'bg-green-500'
    default:
      return 'bg-gray-500'
  }
}

export function getPriorityBgColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-500 text-white dark:bg-red-900 dark:text-red-100'
    case 'high':
      return 'bg-orange-500 text-white dark:bg-orange-900 dark:text-orange-100'
    case 'medium':
      return 'bg-yellow-500 text-white dark:bg-yellow-900 dark:text-yellow-100'
    case 'low':
      return 'bg-green-500 text-white dark:bg-green-900 dark:text-green-100'
    default:
      return 'bg-gray-500 text-white dark:bg-gray-900 dark:text-gray-100'
  }
}
