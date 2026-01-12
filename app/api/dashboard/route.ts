import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get goals stats
    const { data: allGoals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)

    if (goalsError) {
      return NextResponse.json({ error: goalsError.message }, { status: 400 })
    }

    const totalGoals = allGoals?.length || 0
    const completedGoals = allGoals?.filter(g => g.status === 'completed').length || 0
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
    const averageProgress = totalGoals > 0 
      ? (allGoals?.reduce((sum, g) => sum + (g.progress_percentage || 0), 0) || 0) / totalGoals 
      : 0

    // Get tasks stats
    const today = new Date().toISOString().split('T')[0]
    const { data: todayTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('due_date', today)

    if (tasksError) {
      return NextResponse.json({ error: tasksError.message }, { status: 400 })
    }

    const todayTotal = todayTasks?.length || 0
    const todayCompleted = todayTasks?.filter(t => t.completed).length || 0

    // Get weekly tasks (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const { data: weeklyTasks, error: weeklyError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('due_date', sevenDaysAgo.toISOString().split('T')[0])

    const weeklyTotal = weeklyTasks?.length || 0
    const weeklyCompleted = weeklyTasks?.filter(t => t.completed).length || 0
    const weeklyCompletionRate = weeklyTotal > 0 ? (weeklyCompleted / weeklyTotal) * 100 : 0

    // Calculate streak (simplified - consecutive days with at least one completed task)
    let streakDays = 0
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(todayDate)
      checkDate.setDate(checkDate.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      const dayTasks = weeklyTasks?.filter(t => t.due_date === dateStr && t.completed) || []
      if (dayTasks.length > 0) {
        streakDays++
      } else if (i > 0) {
        break // Streak broken
      }
    }

    // Get expenses stats
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]

    const { data: monthlyExpenses, error: monthlyError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startOfMonth)

    const { data: yearlyExpenses, error: yearlyError } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startOfYear)

    if (monthlyError || yearlyError) {
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 400 })
    }

    const monthlyTotal = monthlyExpenses?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0
    const yearlyTotal = yearlyExpenses?.reduce((sum, e) => sum + parseFloat(e.amount), 0) || 0

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {}
    yearlyExpenses?.forEach(expense => {
      const category = expense.category
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + parseFloat(expense.amount)
    })

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dayOfMonth = now.getDate()
    const averageDaily = dayOfMonth > 0 ? monthlyTotal / dayOfMonth : 0

    // Get active goals and upcoming deadlines
    const activeGoals = allGoals?.filter(g => g.status === 'pending' || g.status === 'in_progress') || []
    const upcomingDeadlines = activeGoals
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5)

    const stats: DashboardStats = {
      goals: {
        total: totalGoals,
        active: activeGoals.length,
        completed: completedGoals,
        completion_rate: completionRate,
        average_progress: averageProgress,
      },
      tasks: {
        today_completed: todayCompleted,
        today_total: todayTotal,
        weekly_completion_rate: weeklyCompletionRate,
        streak_days: streakDays,
      },
      expenses: {
        monthly_total: monthlyTotal,
        yearly_total: yearlyTotal,
        category_breakdown: categoryBreakdown,
        average_daily: averageDaily,
      },
      active_goals: activeGoals.slice(0, 5),
      upcoming_deadlines: upcomingDeadlines,
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
