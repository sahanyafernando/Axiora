import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current task
    const { data: currentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('completed, status')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !currentTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const newCompletedStatus = !currentTask.completed
    const newStatus = newCompletedStatus ? 'completed' : 'pending'

    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        completed: newCompletedStatus,
        status: newStatus,
        completed_at: newCompletedStatus ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .eq('user_id', user.id)
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
