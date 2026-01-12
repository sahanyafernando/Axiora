'use client'

import { useState } from 'react'
import { Goal } from '@/lib/types'
import { calculateDaysRemaining, formatDate, getPriorityBgColor } from '@/lib/utils'
import { mutate } from 'swr'

interface GoalCardProps {
  goal: Goal
  onEdit: (goal: Goal) => void
}

export default function GoalCard({ goal, onEdit }: GoalCardProps) {
  const [deleting, setDeleting] = useState(false)
  const daysRemaining = calculateDaysRemaining(goal.deadline)
  const isOverdue = daysRemaining < 0 && goal.status !== 'completed'

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete goal')

      mutate('/api/goals')
    } catch (error) {
      alert('Failed to delete goal')
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update goal')

      mutate('/api/goals')
    } catch (error) {
      alert('Failed to update goal status')
    }
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow dark:bg-gray-800 ${
      isOverdue ? 'border-2 border-red-500' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{goal.title}</h3>
          {goal.description && (
            <p className="text-gray-600 text-sm mb-2 dark:text-gray-400">{goal.description}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs ${getPriorityBgColor(goal.priority)}`}>
          {goal.priority}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-semibold text-gray-800 dark:text-white">{goal.progress_percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            className={`h-2 rounded-full transition-all ${
              goal.status === 'completed' ? 'bg-green-600' : 'bg-primary-600'
            }`}
            style={{ width: `${goal.progress_percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Deadline:</span>
        <span className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
          {formatDate(goal.deadline)}
        </span>
      </div>

      {/* Days Remaining */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Days Remaining:</span>
        <span className={`font-semibold ${isOverdue ? 'text-red-600 dark:text-red-400' : daysRemaining <= 3 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
          {isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days`}
        </span>
      </div>

      {/* Status */}
      <div className="mb-4">
        <select
          value={goal.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(goal)}
          className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
