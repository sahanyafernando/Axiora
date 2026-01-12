'use client'

import { useState } from 'react'
import { Task, Goal, TaskStatus } from '@/lib/types'
import { formatDate, getPriorityBgColor } from '@/lib/utils'
import { mutate } from 'swr'

interface TaskItemProps {
  task: Task
  goals: Goal[]
  onToggleComplete: () => void
  onStartTask: () => void
  onCompleteTask: () => void
  onEdit: () => void
}

export default function TaskItem({ task, goals, onToggleComplete, onStartTask, onCompleteTask, onEdit }: TaskItemProps) {
  const [deleting, setDeleting] = useState(false)
  const linkedGoal = goals.find(g => g.id === task.goal_id)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')

      mutate('/api/tasks')
    } catch (error) {
      alert('Failed to delete task')
    } finally {
      setDeleting(false)
    }
  }

  const isToday = task.due_date === new Date().toISOString().split('T')[0]
  const isPast = new Date(task.due_date) < new Date() && !task.completed

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow dark:bg-gray-800 ${
      isPast ? 'border-l-4 border-red-500' : ''
    }`}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggleComplete}
          className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-semibold text-gray-800 dark:text-white ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
              {linkedGoal && (
                <span className="inline-block mt-2 px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs dark:bg-primary-900 dark:text-primary-300">
                  🎯 {linkedGoal.title}
                </span>
              )}
            </div>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${getPriorityBgColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              task.status === 'completed' ? 'bg-green-500 text-white dark:bg-green-900 dark:text-green-100' :
              task.status === 'in_progress' ? 'bg-blue-500 text-white dark:bg-blue-900 dark:text-blue-100' :
              'bg-gray-500 text-white dark:bg-gray-900 dark:text-gray-100'
            }`}>
              {task.status === 'in_progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
              <span className={isToday ? 'text-primary-600 dark:text-primary-400 font-medium' : isPast ? 'text-red-600 dark:text-red-400' : ''}>
                📅 {formatDate(task.due_date)}
              </span>
              {task.completed_at && (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Completed {formatDate(task.completed_at)}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {task.status === 'pending' && (
                <button
                  onClick={onStartTask}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium"
                >
                  Start Task
                </button>
              )}
              {task.status === 'in_progress' && (
                <button
                  onClick={onCompleteTask}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors font-medium"
                >
                  Complete Task
                </button>
              )}
              <button
                onClick={onEdit}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
