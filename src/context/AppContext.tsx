import React, { createContext, useContext, useState, useEffect } from 'react'

interface Expense {
  id: number
  type: 'Earn' | 'Spent'
  amount: number
  category: string
  description: string
}

interface Task {
  id: number
  title: string
  category: string
  date: Date
  status: 'Pending' | 'Completed'
}

interface Goal {
  id: number
  title: string
  type: 'Weekly' | 'Monthly'
  status: 'Pending' | 'Completed'
}

interface AppContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: number, expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: number) => void
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (id: number, task: Omit<Task, 'id'>) => void
  deleteTask: (id: number) => void
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'status'>) => void
  updateGoal: (id: number, goal: Partial<Goal>) => void
  deleteGoal: (id: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('axiora_expenses')
    return saved ? JSON.parse(saved) : []
  })

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('axiora_tasks')
    if (saved) {
      return JSON.parse(saved).map((t: any) => ({ ...t, date: new Date(t.date) }))
    }
    return []
  })

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('axiora_goals')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('axiora_expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('axiora_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem('axiora_goals', JSON.stringify(goals))
  }, [goals])

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now() }])
  }

  const updateExpense = (id: number, expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...expense, id } : e))
  }

  const deleteExpense = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const addTask = (task: Omit<Task, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }])
  }

  const updateTask = (id: number, task: Omit<Task, 'id'>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...task, id } : t))
  }

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const addGoal = (goal: Omit<Goal, 'id' | 'status'>) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now(), status: 'Pending' }])
  }

  const updateGoal = (id: number, goal: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...goal } : g))
  }

  const deleteGoal = (id: number) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  return (
    <AppContext.Provider value={{ 
      expenses, addExpense, updateExpense, deleteExpense, 
      tasks, addTask, updateTask, deleteTask,
      goals, addGoal, updateGoal, deleteGoal
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within an AppProvider')
  return context
}
