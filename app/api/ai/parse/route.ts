import { NextRequest, NextResponse } from 'next/server'
import { classifyIntent } from '@/lib/ai/intent-parser'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input, context } = body

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 })
    }

    const result = await classifyIntent(input)

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
