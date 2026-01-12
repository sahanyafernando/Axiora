import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const dueDate = searchParams.get('due_date')
    const goalId = searchParams.get('goal_id')
    const completed = searchParams.get('completed')

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (dueDate) {
      query = query.eq('due_date', dueDate)
    }

    if (goalId) {
      query = query.eq('goal_id', goalId)
    }

    if (completed !== null) {
      query = query.eq('completed', completed === 'true')
    }

    const { data: tasks, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ tasks })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, due_date, goal_id, priority = 'medium', status = 'pending' } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const taskData: any = {
      user_id: user.id,
      title,
      description,
      due_date: due_date || new Date().toISOString().split('T')[0],
      priority,
      status,
      completed: false,
    }

    if (goal_id) {
      taskData.goal_id = goal_id
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ task })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
