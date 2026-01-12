import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseDeadline, normalizeCategory } from '@/lib/ai/intent-parser'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { intent, entities } = body

    if (!intent) {
      return NextResponse.json({ error: 'Intent is required' }, { status: 400 })
    }

    let result: any
    let message = ''

    switch (intent) {
      case 'create_goal': {
        if (!entities.title) {
          return NextResponse.json({ 
            success: false, 
            message: 'Goal title is required' 
          }, { status: 400 })
        }

        const deadline = entities.deadline 
          ? parseDeadline(entities.deadline).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Default 7 days

        const { data: goal, error } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            title: entities.title,
            description: entities.description || null,
            deadline,
            priority: entities.priority || 'medium',
            status: 'pending',
            progress_percentage: 0,
          })
          .select()
          .single()

        if (error) {
          return NextResponse.json({ success: false, message: error.message }, { status: 400 })
        }

        result = goal
        message = `Goal "${entities.title}" created successfully!`
        break
      }

      case 'create_task': {
        if (!entities.title) {
          return NextResponse.json({ 
            success: false, 
            message: 'Task title is required' 
          }, { status: 400 })
        }

        const { data: task, error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title: entities.title,
            description: entities.description || null,
            due_date: entities.due_date || new Date().toISOString().split('T')[0],
            goal_id: entities.goal_id || null,
            priority: entities.priority || 'medium',
            completed: false,
          })
          .select()
          .single()

        if (error) {
          return NextResponse.json({ success: false, message: error.message }, { status: 400 })
        }

        result = task
        message = `Task "${entities.title}" created successfully!`
        break
      }

      case 'add_expense': {
        if (!entities.amount || !entities.category) {
          return NextResponse.json({ 
            success: false, 
            message: 'Amount and category are required' 
          }, { status: 400 })
        }

        const category = normalizeCategory(entities.category)

        const { data: expense, error } = await supabase
          .from('expenses')
          .insert({
            user_id: user.id,
            amount: parseFloat(entities.amount),
            category,
            description: entities.description || null,
            date: entities.date || new Date().toISOString().split('T')[0],
          })
          .select()
          .single()

        if (error) {
          return NextResponse.json({ success: false, message: error.message }, { status: 400 })
        }

        result = expense
        message = `Expense of $${entities.amount} added to ${category}!`
        break
      }

      case 'complete_task': {
        if (!entities.task_id) {
          return NextResponse.json({ 
            success: false, 
            message: 'Task ID is required' 
          }, { status: 400 })
        }

        const { data: task, error } = await supabase
          .from('tasks')
          .update({ 
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq('id', entities.task_id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          return NextResponse.json({ success: false, message: error.message }, { status: 400 })
        }

        result = task
        message = `Task marked as complete!`
        break
      }

      default:
        return NextResponse.json({ 
          success: false, 
          message: `Intent "${intent}" not yet implemented` 
        }, { status: 400 })
    }

    return NextResponse.json({ success: true, result, message })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
