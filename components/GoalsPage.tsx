'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { Goal } from '@/lib/types'
import { calculateDaysRemaining, calculateDaysRemainingInYear, getPriorityBgColor } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import GoalCard from '@/components/GoalCard'
import GoalForm from '@/components/GoalForm'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')
  
  const { data: response, error, isLoading } = useSWR<{ goals: Goal[] }>('/api/goals', fetcher)
  const goals = response?.goals || []
  const daysRemaining = calculateDaysRemainingInYear()

  const filteredGoals = filter === 'all' 
    ? goals 
    : goals.filter(g => g.status === filter)

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingGoal(null)
    mutate('/api/goals')
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading goals: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Goals</h2>
          <p className="text-gray-600 mt-1">
            {daysRemaining} days remaining in {new Date().getFullYear()}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          + Add Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Goals</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">{goals.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {goals.filter(g => g.status === 'pending' || g.status === 'in_progress').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {goals.filter(g => g.status === 'completed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            {goals.length > 0 
              ? ((goals.filter(g => g.status === 'completed').length / goals.length) * 100).toFixed(0)
              : 0}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'in_progress', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Goals List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center dark:bg-gray-800">
          <p className="text-gray-500 text-lg mb-4 dark:text-gray-400">No goals found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary-600 hover:text-primary-700 font-medium dark:text-primary-400 dark:hover:text-primary-300"
          >
            Create your first goal →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Goal Form Modal */}
      {showForm && (
        <GoalForm
          goal={editingGoal}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}
    </div>
  )
}
