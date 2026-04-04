import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff, User, Bot, Sparkles, Volume2, VolumeX } from 'lucide-react'
import { format } from 'date-fns'
import { useAppContext } from '../context/AppContext'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const Chatbot = () => {
  const { addTask, addExpense } = useAppContext()
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('axiora_chat_history')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }))
      } catch (e) {
        return [{ id: 1, text: "Hello! I'm Axiora AI. I can help you manage your goals, expenses, and schedule. How can I assist you today?", sender: 'bot', timestamp: new Date() }]
      }
    }
    return [{ id: 1, text: "Hello! I'm Axiora AI. I can help you manage your goals, expenses, and schedule. How can I assist you today?", sender: 'bot', timestamp: new Date() }]
  })

  useEffect(() => {
    localStorage.setItem('axiora_chat_history', JSON.stringify(messages))
  }, [messages])

  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Speech Recognition setup
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).WebkitSpeechRecognition || (window as any).speechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
        handleSend(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      setInput('')
      recognitionRef.current?.start()
      setIsListening(true)
    }
  }

  const handleSend = (textOverride?: string) => {
    const messageText = textOverride || input
    if (!messageText.trim()) return

    const newUserMsg: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking and responding
    setTimeout(async () => {
      const botResponse = await getBotResponse(messageText)
      const newBotMsg: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newBotMsg])
      setIsTyping(false)
      if (isSpeaking) speak(botResponse)
    }, 1500)
  }

  const getBotResponse = async (text: string) => {
    const lower = text.toLowerCase()
    
    // Check for adding task
    if (lower.includes('add task') || lower.includes('remind me to')) {
      const taskName = lower.replace('add task', '').replace('remind me to', '').trim()
      if (taskName) {
        await addTask({
          title: taskName.charAt(0).toUpperCase() + taskName.slice(1),
          category: 'Daily needs',
          date: new Date(),
          status: 'Pending'
        })
        return `I've added the task "${taskName}" to your to-do list for today.`
      }
    }

    // Check for adding expense
    if (lower.includes('spent') || lower.includes('earned')) {
      const type = lower.includes('earned') ? 'Earn' : 'Spent'
      const amountMatch = lower.match(/\d+/)
      const amount = amountMatch ? parseInt(amountMatch[0]) : 0
      
      if (amount > 0) {
        await addExpense({
          type,
          amount,
          category: 'Other with reason',
          description: text
        })
        return `I've recorded that you ${type === 'Earn' ? 'earned' : 'spent'} LKR ${amount.toLocaleString()}.`
      }
    }

    if (lower.includes('expense') || lower.includes('spent') || lower.includes('earn')) 
      return "I can help you track that! You can say things like 'spent 500 on lunch' or 'earned 1000'."
    if (lower.includes('goal')) 
      return "Setting goals is great! You can manage your weekly and monthly targets in the Goals section."
    if (lower.includes('todo') || lower.includes('task')) 
      return "You can add tasks by saying 'add task [name]'."
    if (lower.includes('hello') || lower.includes('hi')) 
      return "Hi there! I'm ready to help you manage your day. What's on your mind?"
    
    return "I understand. I'm here to help you stay organized with Axiora. Would you like to check your dashboard?"
  }

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("Speech synthesis error:", error)
        setIsSpeaking(false)
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-[calc(100vh-8rem)] flex flex-col glass-card p-0 overflow-hidden"
    >
      <header className="p-6 border-b border-black/5 dark:border-white/10 flex justify-between items-center bg-black/5 dark:bg-white/5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none">Axiora AI</h2>
            <p className="text-slate-500 dark:text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Smart Assistant</p>
          </div>
        </div>
        <button 
          onClick={() => setIsSpeaking(!isSpeaking)}
          className={`p-3 rounded-xl transition-all ${isSpeaking ? 'bg-pink-500/20 text-pink-500' : 'bg-black/5 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10'}`}
        >
          {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>

      <section className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                msg.sender === 'user' ? 'bg-blue-600' : 'bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10'
              }`}>
                {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-blue-600 dark:text-white" />}
              </div>
              <div className={`p-4 rounded-3xl shadow-xl ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white rounded-bl-none border border-black/5 dark:border-white/10 backdrop-blur-md'
              }`}>
                <p className="text-sm md:text-base leading-relaxed font-medium">{msg.text}</p>
                <p className={`text-[9px] mt-2 font-bold uppercase tracking-wider ${
                  msg.sender === 'user' ? 'text-white/40' : 'text-slate-400 dark:text-white/20'
                }`}>
                  {format(msg.timestamp, 'HH:mm')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-4 rounded-3xl rounded-tl-none flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40 animate-bounce" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40 animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white/40 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </section>

      <footer className="p-6 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleListening}
            className={`p-4 rounded-2xl transition-all shadow-lg flex-shrink-0 ${
              isListening 
                ? 'bg-red-500 text-white ring-4 ring-red-500/20 scale-110' 
                : 'bg-black/5 dark:bg-white/5 text-slate-400 dark:text-white/40 hover:bg-black/10 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white border border-black/5 dark:border-white/10'
            }`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask me anything..."}
              className="w-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner font-medium"
            />
          </div>

          <button 
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:scale-100 flex-shrink-0"
          >
            <Send size={24} />
          </button>
        </div>
      </footer>
    </motion.div>
  )
}

export default Chatbot

