export type Priority = 'low' | 'medium' | 'high' | 'critical'
export type TaskPriority = 'low' | 'medium' | 'high'
export type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'archived'
export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string | null
  deadline: string
  priority: Priority
  status: GoalStatus
  progress_percentage: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  user_id: string
  goal_id?: string | null
  title: string
  description?: string | null
  completed: boolean
  status: TaskStatus
  due_date: string
  priority: TaskPriority
  created_at: string
  updated_at: string
  completed_at?: string | null
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  category: string
  description?: string | null
  date: string
  created_at: string
  updated_at: string
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Health & Fitness'
  | 'Education'
  | 'Travel'
  | 'Other'

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Health & Fitness',
  'Education',
  'Travel',
  'Other',
]

export interface DashboardStats {
  goals: {
    total: number
    active: number
    completed: number
    completion_rate: number
    average_progress: number
  }
  tasks: {
    today_completed: number
    today_total: number
    weekly_completion_rate: number
    streak_days: number
  }
  expenses: {
    monthly_total: number
    yearly_total: number
    category_breakdown: Record<string, number>
    average_daily: number
  }
  active_goals: Goal[]
  upcoming_deadlines: Goal[]
}

export interface AIIntent {
  intent: string
  entities: Record<string, any>
  confidence: number
  requires_confirmation: boolean
  confirmation_message?: string
}

export interface AIResponse {
  success: boolean
  result?: any
  message: string
}
