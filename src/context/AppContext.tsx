import React, { createContext, useContext, useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

interface Expense {
  _id?: string
  id: string
  type: 'Earn' | 'Spent'
  amount: number
  category: string
  description: string
}

interface Task {
  _id?: string
  id: string
  title: string
  category: string
  date: Date
  status: 'Pending' | 'Completed'
}

interface Goal {
  _id?: string
  id: string
  title: string
  type: 'Weekly' | 'Monthly'
  status: 'Pending' | 'Completed'
}

interface AppContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id' | '_id'>) => Promise<void>
  updateExpense: (id: string, expense: Omit<Expense, 'id' | '_id'>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | '_id'>) => Promise<void>
  updateTask: (id: string, task: Omit<Task, 'id' | '_id'>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'status' | '_id'>) => Promise<void>
  updateGoal: (id: string, goal: Partial<Goal>) => Promise<void>
  deleteGoal: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])

  const fetchData = async () => {
    try {
      const [tasksRes, expensesRes, goalsRes] = await Promise.all([
        fetch(`${API_URL}/tasks`),
        fetch(`${API_URL}/expenses`),
        fetch(`${API_URL}/goals`)
      ])
      
      const tasksData = await tasksRes.json()
      const expensesData = await expensesRes.json()
      const goalsData = await goalsRes.json()

      setTasks(tasksData.map((t: any) => ({ ...t, id: t._id, date: new Date(t.date) })))
      setExpenses(expensesData.map((e: any) => ({ ...e, id: e._id })))
      setGoals(goalsData.map((g: any) => ({ ...g, id: g._id })))
    } catch (error) {
      console.error('Error fetching data:', error)
      // Fallback to localStorage if API fails (for offline/dev)
      const savedTasks = localStorage.getItem('axiora_tasks')
      const savedExpenses = localStorage.getItem('axiora_expenses')
      const savedGoals = localStorage.getItem('axiora_goals')
      
      if (savedTasks) setTasks(JSON.parse(savedTasks).map((t: any) => ({ ...t, date: new Date(t.date) })))
      if (savedExpenses) setExpenses(JSON.parse(savedExpenses))
      if (savedGoals) setGoals(JSON.parse(savedGoals))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Sync to localStorage as backup
  useEffect(() => {
    if (expenses.length > 0) localStorage.setItem('axiora_expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('axiora_tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (goals.length > 0) localStorage.setItem('axiora_goals', JSON.stringify(goals))
  }, [goals])

  const addExpense = async (expense: Omit<Expense, 'id' | '_id'>) => {
    const res = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    })
    const data = await res.json()
    setExpenses(prev => [{ ...data, id: data._id }, ...prev])
  }

  const updateExpense = async (id: string, expense: Omit<Expense, 'id' | '_id'>) => {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    })
    const data = await res.json()
    setExpenses(prev => prev.map(e => e._id === id ? { ...data, id: data._id } : e))
  }

  const deleteExpense = async (id: string) => {
    await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' })
    setExpenses(prev => prev.filter(e => e._id !== id))
  }

  const addTask = async (task: Omit<Task, 'id' | '_id'>) => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks(prev => [{ ...data, id: data._id, date: new Date(data.date) }, ...prev])
  }

  const updateTask = async (id: string, task: Omit<Task, 'id' | '_id'>) => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks(prev => prev.map(t => t._id === id ? { ...data, id: data._id, date: new Date(data.date) } : t))
  }

  const deleteTask = async (id: string) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  const addGoal = async (goal: Omit<Goal, 'id' | 'status' | '_id'>) => {
    const res = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    })
    const data = await res.json()
    setGoals(prev => [{ ...data, id: data._id }, ...prev])
  }

  const updateGoal = async (id: string, goal: Partial<Goal>) => {
    const res = await fetch(`${API_URL}/goals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    })
    const data = await res.json()
    setGoals(prev => prev.map(g => g._id === id ? { ...data, id: data._id } : g))
  }

  const deleteGoal = async (id: string) => {
    await fetch(`${API_URL}/goals/${id}`, { method: 'DELETE' })
    setGoals(prev => prev.filter(g => g._id !== id))
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
