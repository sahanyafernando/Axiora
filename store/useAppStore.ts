import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Goal, Task, Expense } from '@/lib/types'

interface AppState {
  user: any | null
  goals: Goal[]
  tasks: Task[]
  expenses: Expense[]
  selectedDate: Date
  theme: 'light' | 'dark'
  
  // Actions
  setUser: (user: any | null) => void
  setGoals: (goals: Goal[]) => void
  setTasks: (tasks: Task[]) => void
  setExpenses: (expenses: Expense[]) => void
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  toggleTaskComplete: (id: string) => void
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, updates: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  setSelectedDate: (date: Date) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      goals: [],
      tasks: [],
      expenses: [],
      selectedDate: new Date(),
      theme: 'light',
      
      setUser: (user) => set({ user }),
      setGoals: (goals) => set({ goals }),
      setTasks: (tasks) => set({ tasks }),
      setExpenses: (expenses) => set({ expenses }),
      
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
      })),
      
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),
      toggleTaskComplete: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? { ...t, completed: !t.completed, completed_at: !t.completed ? new Date().toISOString() : null }
            : t
        ),
      })),
      
      addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
      updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      })),
      
      setSelectedDate: (date) => set({ selectedDate: date }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    }),
    {
      name: 'axiora-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
)
