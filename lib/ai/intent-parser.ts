import { AIIntent } from '../types'

const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY || ''
const HF_API_URL = 'https://api-inference.huggingface.co/models'

// Fallback intent classification using rule-based patterns
function fallbackIntentClassifier(input: string): AIIntent {
  const lowerInput = input.toLowerCase()

  // Create goal
  if (lowerInput.match(/(add|create|new|set).*goal|goal.*(add|create)/)) {
    const deadlineMatch = lowerInput.match(/in (\d+) (day|days|week|weeks|month|months)/)
    const titleMatch = lowerInput.match(/goal.*?:?\s*(.+?)(?:in |deadline|$)/i)
    
    return {
      intent: 'create_goal',
      entities: {
        title: titleMatch ? titleMatch[1].trim() : '',
        deadline: deadlineMatch ? `${deadlineMatch[1]} ${deadlineMatch[2]}` : '',
      },
      confidence: 0.7,
      requires_confirmation: true,
      confirmation_message: `I'll create a goal: "${titleMatch?.[1] || 'Untitled Goal'}"${deadlineMatch ? ` with deadline in ${deadlineMatch[1]} ${deadlineMatch[2]}` : ''}. Should I save it?`,
    }
  }

  // Add task
  if (lowerInput.match(/(add|create|new).*task|task.*(add|create)/)) {
    const titleMatch = lowerInput.match(/task.*?:?\s*(.+?)(?:today|tomorrow|$)/i)
    
    return {
      intent: 'create_task',
      entities: {
        title: titleMatch ? titleMatch[1].trim() : '',
      },
      confidence: 0.7,
      requires_confirmation: true,
      confirmation_message: `I'll add a task: "${titleMatch?.[1] || 'Untitled Task'}". Should I save it?`,
    }
  }

  // Add expense
  if (lowerInput.match(/(spent|spend|cost|expense).*\d+|i.*\d+.*(on|for)/)) {
    const amountMatch = lowerInput.match(/(\d+(?:\.\d{2})?)/)
    const categoryMatch = lowerInput.match(/(?:on|for)\s+(\w+)/)
    const categories = ['food', 'transportation', 'shopping', 'bills', 'entertainment', 'health', 'education', 'travel']
    const matchedCategory = categories.find(cat => lowerInput.includes(cat))
    
    return {
      intent: 'add_expense',
      entities: {
        amount: amountMatch ? parseFloat(amountMatch[1]) : 0,
        category: matchedCategory || categoryMatch?.[1] || 'Other',
      },
      confidence: 0.7,
      requires_confirmation: true,
      confirmation_message: `I'll add an expense of $${amountMatch?.[1] || 0}${matchedCategory ? ` for ${matchedCategory}` : ''}. Should I save it?`,
    }
  }

  // Show progress
  if (lowerInput.match(/(show|display|my|progress|stats|statistics)/)) {
    const timeMatch = lowerInput.match(/(today|this week|this month|this year)/)
    
    return {
      intent: 'show_progress',
      entities: {
        time_range: timeMatch ? timeMatch[1] : 'all',
      },
      confidence: 0.8,
      requires_confirmation: false,
    }
  }

  // Complete task
  if (lowerInput.match(/(complete|done|finish).*task|task.*(complete|done)/)) {
    return {
      intent: 'complete_task',
      entities: {},
      confidence: 0.6,
      requires_confirmation: false,
    }
  }

  return {
    intent: 'get_guidance',
    entities: {},
    confidence: 0.5,
    requires_confirmation: false,
  }
}

// Extract date from natural language
export function parseDeadline(deadlineText: string): Date {
  const lower = deadlineText.toLowerCase()
  const now = new Date()
  
  // "in X days/weeks/months"
  const daysMatch = lower.match(/in (\d+) (day|days)/)
  if (daysMatch) {
    const days = parseInt(daysMatch[1])
    const date = new Date(now)
    date.setDate(date.getDate() + days)
    return date
  }
  
  const weeksMatch = lower.match(/in (\d+) (week|weeks)/)
  if (weeksMatch) {
    const weeks = parseInt(weeksMatch[1])
    const date = new Date(now)
    date.setDate(date.getDate() + (weeks * 7))
    return date
  }
  
  const monthsMatch = lower.match(/in (\d+) (month|months)/)
  if (monthsMatch) {
    const months = parseInt(monthsMatch[1])
    const date = new Date(now)
    date.setMonth(date.getMonth() + months)
    return date
  }
  
  // Default to 7 days if no match
  const date = new Date(now)
  date.setDate(date.getDate() + 7)
  return date
}

// Normalize category name
export function normalizeCategory(category: string): string {
  const lower = category.toLowerCase()
  const mapping: Record<string, string> = {
    'food': 'Food & Dining',
    'dining': 'Food & Dining',
    'restaurant': 'Food & Dining',
    'transport': 'Transportation',
    'transportation': 'Transportation',
    'uber': 'Transportation',
    'taxi': 'Transportation',
    'shop': 'Shopping',
    'shopping': 'Shopping',
    'bill': 'Bills & Utilities',
    'bills': 'Bills & Utilities',
    'utility': 'Bills & Utilities',
    'utilities': 'Bills & Utilities',
    'entertainment': 'Entertainment',
    'movie': 'Entertainment',
    'health': 'Health & Fitness',
    'fitness': 'Health & Fitness',
    'gym': 'Health & Fitness',
    'education': 'Education',
    'school': 'Education',
    'travel': 'Travel',
  }
  
  for (const [key, value] of Object.entries(mapping)) {
    if (lower.includes(key)) {
      return value
    }
  }
  
  return 'Other'
}

// Classify intent using Hugging Face API (with fallback)
export async function classifyIntent(input: string): Promise<AIIntent> {
  if (!HF_API_KEY) {
    return fallbackIntentClassifier(input)
  }

  try {
    const intents = [
      'create_goal',
      'update_goal',
      'delete_goal',
      'create_task',
      'complete_task',
      'add_expense',
      'show_progress',
      'show_stats',
      'get_guidance',
    ]

    const response = await fetch(`${HF_API_URL}/facebook/bart-large-mnli`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: input,
        parameters: {
          candidate_labels: intents,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Extract top intent
    const labels = data.labels || []
    const scores = data.scores || []
    const topIndex = scores.indexOf(Math.max(...scores))
    const intent = labels[topIndex] || 'get_guidance'
    const confidence = scores[topIndex] || 0.5

    // Use fallback for entity extraction (Hugging Face NER is more complex)
    const fallbackResult = fallbackIntentClassifier(input)
    
    return {
      intent,
      entities: fallbackResult.entities,
      confidence,
      requires_confirmation: ['create_goal', 'add_expense', 'create_task'].includes(intent),
      confirmation_message: fallbackResult.confirmation_message,
    }
  } catch (error) {
    console.error('AI classification error:', error)
    return fallbackIntentClassifier(input)
  }
}

// Generate response using Hugging Face API
export async function generateResponse(prompt: string): Promise<string> {
  if (!HF_API_KEY) {
    return "I'm here to help you manage your goals and tasks. How can I assist you today?"
  }

  try {
    const response = await fetch(`${HF_API_URL}/google/flan-t5-base`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 150,
          temperature: 0.7,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`)
    }

    const data = await response.json()
    return data[0]?.generated_text || "I understand. How can I help you?"
  } catch (error) {
    console.error('AI generation error:', error)
    return "I'm here to help you manage your goals and tasks. How can I assist you today?"
  }
}
