'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { DashboardStats } from '@/lib/types'
import { formatCurrency, calculateDaysRemaining, calculateDaysRemainingInYear } from '@/lib/utils'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to fetch data' }))
    throw new Error(error.error || `Failed to fetch: ${response.statusText}`)
  }
  return response.json()
}

export default function Dashboard() {
  const { data: stats, error, mutate } = useSWR<DashboardStats>('/api/dashboard', fetcher)
  const [daysRemaining, setDaysRemaining] = useState(0)

  useEffect(() => {
    setDaysRemaining(calculateDaysRemainingInYear())
  }, [])

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error loading dashboard: {error.message}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // Defensive check for stats structure
  if (!stats.expenses || !stats.expenses.category_breakdown) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        Error: Invalid dashboard data structure
      </div>
    )
  }

  const categoryColors = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316']

  const categoryChartData = Object.entries(stats.expenses.category_breakdown)
    .map(([category, amount], index) => ({
      name: category,
      value: amount,
      color: categoryColors[index % categoryColors.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">{daysRemaining}</span> days remaining in {new Date().getFullYear()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Goals Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Goals</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold">{stats.goals.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active:</span>
              <span className="font-bold text-primary-600">{stats.goals.active}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-bold text-green-600">{stats.goals.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rate:</span>
              <span className="font-bold">{stats.goals.completion_rate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Avg Progress</span>
              <span>{stats.goals.average_progress.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${stats.goals.average_progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Tasks</h3>
            <span className="text-2xl">✓</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Today:</span>
              <span className="font-bold">
                {stats.tasks.today_completed}/{stats.tasks.today_total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weekly Rate:</span>
              <span className="font-bold">{stats.tasks.weekly_completion_rate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Streak:</span>
              <span className="font-bold text-orange-600">{stats.tasks.streak_days} days 🔥</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Today's Progress</span>
              <span>
                {stats.tasks.today_total > 0
                  ? ((stats.tasks.today_completed / stats.tasks.today_total) * 100).toFixed(0)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{
                  width: `${
                    stats.tasks.today_total > 0
                      ? (stats.tasks.today_completed / stats.tasks.today_total) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Expenses Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Expenses</h3>
            <span className="text-2xl">💰</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly:</span>
              <span className="font-bold">{formatCurrency(stats.expenses.monthly_total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Yearly:</span>
              <span className="font-bold">{formatCurrency(stats.expenses.yearly_total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Avg:</span>
              <span className="font-bold">{formatCurrency(stats.expenses.average_daily)}</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Overview</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Goals Progress</span>
                <span>{stats.goals.average_progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${stats.goals.average_progress}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Task Completion</span>
                <span>{stats.tasks.weekly_completion_rate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${stats.tasks.weekly_completion_rate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Category Chart */}
        {categoryChartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Expense Categories</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Active Goals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Active Goals</h3>
          <div className="space-y-4">
            {stats.active_goals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active goals yet</p>
            ) : (
              stats.active_goals.map((goal) => {
                const daysLeft = calculateDaysRemaining(goal.deadline)
                return (
                  <div key={goal.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                      <span
                        className={`px-2 py-1 rounded text-xs ${getPriorityColor(goal.priority)}`}
                      >
                        {goal.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{daysLeft} days remaining</span>
                      <span>{goal.progress_percentage}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${goal.progress_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800'
    case 'high':
      return 'bg-orange-100 text-orange-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
