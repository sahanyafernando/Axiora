'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { AIIntent, AIResponse } from '@/lib/types'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [pendingAction, setPendingAction] = useState<AIIntent | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const router = useRouter()
  const { user, addGoal, addTask, addExpense, toggleTaskComplete } = useAppStore()

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ''
          let interimTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript.trim()) {
            setInput(finalTranscript.trim())
            handleSubmit(finalTranscript.trim())
            setIsListening(false)
          } else if (interimTranscript) {
            setInput(interimTranscript)
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          let errorMessage = 'Sorry, I had trouble understanding.'
          if (event.error === 'not-allowed') {
            errorMessage = 'Microphone access denied. Please allow microphone access and try again.'
          } else if (event.error === 'no-speech') {
            errorMessage = 'No speech detected. Please try speaking again.'
          } else if (event.error === 'network') {
            errorMessage = 'Network error. Please check your connection and try again.'
          }
          addMessage('assistant', errorMessage)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    // Initial greeting
    if (messages.length === 0) {
      addMessage('assistant', 'Hello! I\'m your AI assistant. I can help you manage goals, tasks, and expenses. Try saying "Add a goal to finish this project in 7 days" or type your request.')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { role, content, timestamp: new Date() }])
    if (role === 'assistant') {
      speakText(content)
    }
  }

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel()

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 1.0
    utterance.pitch = 1.0

    // Try to find a natural-sounding voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes('Google') ||
        v.name.includes('Microsoft') ||
        v.name.includes('Samantha') ||
        v.lang.startsWith('en')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    if (!recognitionRef.current) {
      addMessage('assistant', 'Voice recognition is not available in your browser. Please use Chrome, Edge, or Safari.')
      return
    }

    try {
      setIsListening(true)
      setInput('')
      recognitionRef.current.start()
      addMessage('assistant', 'Listening... Speak now.')
    } catch (error) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
      addMessage('assistant', 'Could not start voice recognition. Please check your microphone permissions and try again.')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const handleParseIntent = async (userInput: string): Promise<AIIntent> => {
    try {
      const response = await fetch('/api/ai/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userInput }),
      })

      if (!response.ok) {
        throw new Error('Failed to parse intent')
      }

      return await response.json()
    } catch (error) {
      console.error('Error parsing intent:', error)
      throw error
    }
  }

  const handleExecuteAction = async (intent: AIIntent): Promise<AIResponse> => {
    try {
      const response = await fetch('/api/ai/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: intent.intent,
          entities: intent.entities,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to execute action')
      }

      return await response.json()
    } catch (error) {
      console.error('Error executing action:', error)
      throw error
    }
  }

  const handleSubmit = async (userInput?: string) => {
    const inputText = userInput || input.trim()
    if (!inputText) return

    setIsProcessing(true)
    stopListening()
    stopSpeaking()

    // Add user message
    addMessage('user', inputText)
    setInput('')

    try {
      // Parse intent
      const intent = await handleParseIntent(inputText)

      // If confirmation is required, show confirmation message
      if (intent.requires_confirmation && intent.confirmation_message) {
        setPendingAction(intent)
        addMessage('assistant', intent.confirmation_message)
        setIsProcessing(false)
        return
      }

      // Execute action directly
      if (intent.intent === 'show_progress' || intent.intent === 'show_stats') {
        // Navigate to dashboard or show stats
        router.push('/')
        addMessage('assistant', 'Showing your progress dashboard...')
      } else if (intent.intent === 'get_guidance') {
        // Provide general guidance
        const guidanceMessage = await getGuidanceResponse(inputText)
        addMessage('assistant', guidanceMessage)
      } else {
        // Execute action
        const result = await handleExecuteAction(intent)
        
        // Update local state
        if (result.success && result.result) {
          if (intent.intent === 'create_goal') {
            addGoal(result.result)
          } else if (intent.intent === 'create_task') {
            addTask(result.result)
          } else if (intent.intent === 'add_expense') {
            addExpense(result.result)
          } else if (intent.intent === 'complete_task' && intent.entities.task_id) {
            toggleTaskComplete(intent.entities.task_id)
          }
        }

        addMessage('assistant', result.message || 'Action completed successfully!')
      }
    } catch (error: any) {
      console.error('Error processing request:', error)
      addMessage('assistant', `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please try again.`)
    } finally {
      setIsProcessing(false)
      setPendingAction(null)
    }
  }

  const confirmAction = async () => {
    if (!pendingAction) return

    setIsProcessing(true)
    stopSpeaking()

    try {
      const result = await handleExecuteAction(pendingAction)
      
      // Update local state
      if (result.success && result.result) {
        if (pendingAction.intent === 'create_goal') {
          addGoal(result.result)
        } else if (pendingAction.intent === 'create_task') {
          addTask(result.result)
        } else if (pendingAction.intent === 'add_expense') {
          addExpense(result.result)
        }
      }

      addMessage('assistant', result.message || 'Action confirmed and completed!')
    } catch (error: any) {
      addMessage('assistant', `Sorry, I encountered an error: ${error.message || 'Unknown error'}.`)
    } finally {
      setIsProcessing(false)
      setPendingAction(null)
    }
  }

  const cancelAction = () => {
    setPendingAction(null)
    addMessage('assistant', 'Action cancelled.')
  }

  const getGuidanceResponse = async (input: string): Promise<string> => {
    // Simple rule-based guidance (can be enhanced with AI)
    const lower = input.toLowerCase()
    
    if (lower.includes('improve') || lower.includes('better') || lower.includes('productivity')) {
      return 'To improve productivity, try breaking large goals into smaller tasks, set realistic deadlines, and review your progress daily. Focus on completing high-priority tasks first!'
    }
    
    if (lower.includes('goal') || lower.includes('plan')) {
      return 'When setting goals, make them specific, measurable, achievable, relevant, and time-bound (SMART). Break them into tasks and track your progress regularly.'
    }
    
    if (lower.includes('task') || lower.includes('todo')) {
      return 'Try organizing tasks by priority and due date. Complete high-priority tasks first, and don\'t forget to mark tasks complete when done!'
    }
    
    if (lower.includes('expense') || lower.includes('spend') || lower.includes('budget')) {
      return 'Track all your expenses regularly and review your spending patterns monthly. This helps you identify areas where you can save money.'
    }

    return 'I\'m here to help you manage your goals, tasks, and expenses. Feel free to ask me to add items, show your progress, or provide guidance on productivity!'
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!user) return null

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all z-50 flex items-center justify-center ${
          isListening ? 'animate-pulse ring-4 ring-primary-300' : ''
        }`}
        aria-label="Open AI Assistant"
      >
        {isListening ? (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clipRule="evenodd"
            />
          </svg>
        ) : isSpeaking ? (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.234 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.234l4.149-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                stopListening()
                stopSpeaking()
              }}
              className="hover:bg-primary-700 rounded p-1"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {pendingAction && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-2">
                <p className="text-sm text-yellow-800 font-medium">Confirm Action</p>
                <div className="flex space-x-2">
                  <button
                    onClick={confirmAction}
                    disabled={isProcessing}
                    className="flex-1 bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={cancelAction}
                    disabled={isProcessing}
                    className="flex-1 bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-400 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use voice..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white dark:text-white dark:bg-gray-700 dark:border-gray-600"
                disabled={isProcessing || isListening}
              />
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isProcessing}
                className={`p-2 rounded-lg ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50`}
                aria-label={isListening ? 'Stop listening' : 'Start voice input'}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || isProcessing || isListening}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
