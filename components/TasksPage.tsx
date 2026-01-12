'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { Task, Goal } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import TaskItem from '@/components/TaskItem'
import TaskForm from '@/components/TaskForm'
import useSWRMultiple from '@/lib/hooks/useSWRMultiple'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function TasksPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<'all' | 'today' | 'completed' | 'pending' | 'in_progress'>('today')
  
  const today = new Date().toISOString().split('T')[0]
  const { data: tasksResponse } = useSWR<{ tasks: Task[] }>('/api/tasks', fetcher)
  const { data: goalsResponse } = useSWR<{ goals: Goal[] }>('/api/goals', fetcher)
  
  const tasks = tasksResponse?.tasks || []
  const goals = goalsResponse?.goals || []

  const todayTasks = tasks.filter(t => t.due_date === today)
  const completedToday = todayTasks.filter(t => t.completed).length
  const totalToday = todayTasks.length

  let filteredTasks: Task[] = []
  if (filter === 'today') {
    filteredTasks = todayTasks
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(t => t.status === 'completed')
  } else if (filter === 'pending') {
    filteredTasks = tasks.filter(t => t.status === 'pending')
  } else if (filter === 'in_progress') {
    filteredTasks = tasks.filter(t => t.status === 'in_progress')
  } else {
    filteredTasks = tasks
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(null)
    mutate('/api/tasks')
  }

  const handleToggleComplete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
      })

      if (!response.ok) throw new Error('Failed to toggle task')

      mutate('/api/tasks')
    } catch (error) {
      alert('Failed to update task')
    }
  }

  const handleStartTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/start`, {
        method: 'PATCH',
      })

      if (!response.ok) throw new Error('Failed to start task')

      mutate('/api/tasks')
    } catch (error) {
      alert('Failed to start task')
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
      })

      if (!response.ok) throw new Error('Failed to complete task')

      mutate('/api/tasks')
    } catch (error) {
      alert('Failed to complete task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Tasks</h2>
          <p className="text-gray-600 mt-1">
            {completedToday} of {totalToday} tasks completed today
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          + Add Task
        </button>
      </div>

      {/* Today's Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Today's Progress</h3>
          <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(today)}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            {completedToday} / {totalToday} completed
          </span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {totalToday > 0 ? ((completedToday / totalToday) * 100).toFixed(0) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
          <div
            className="bg-green-600 h-3 rounded-full transition-all"
            style={{
              width: `${totalToday > 0 ? (completedToday / totalToday) * 100 : 0}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['all', 'today', 'pending', 'in_progress', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center dark:bg-gray-800">
          <p className="text-gray-500 text-lg mb-4 dark:text-gray-400">No tasks found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300"
          >
            Create your first task →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              goals={goals}
              onToggleComplete={() => handleToggleComplete(task.id)}
              onStartTask={() => handleStartTask(task.id)}
              onCompleteTask={() => handleCompleteTask(task.id)}
              onEdit={() => handleEdit(task)}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          goals={goals}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  )
}
