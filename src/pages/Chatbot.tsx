import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mic, MicOff, User, Bot, Sparkles } from 'lucide-react'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Axiora AI. How can I help you today?", sender: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { id: messages.length + 1, text: input, sender: 'user' }])
    setInput('')
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: prev.length + 1, 
        text: "I'm processing your request. How else can I assist with your daily management?", 
        sender: 'bot' 
      }])
    }, 1000)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-[calc(100vh-8rem)] flex flex-col"
    >
      <header className="flex justify-between items-center bg-white/10 backdrop-blur-md p-6 rounded-t-3xl border-x border-t border-white/20 shadow-xl">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <Sparkles className="mr-3 text-pink-500" size={32} /> AI Chatbot
        </h2>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white/60 text-sm">Online</span>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/5 backdrop-blur-md border-x border-white/10 shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl flex items-start space-x-3 shadow-lg ${
              msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none border border-white/10'
            }`}>
              <div className="flex-shrink-0 mt-1">
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </section>

      <footer className="p-6 bg-white/10 backdrop-blur-md rounded-b-3xl border-x border-b border-white/20 shadow-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsListening(!isListening)}
            className={`p-4 rounded-full transition-all shadow-lg ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
          />
          <button 
            onClick={handleSend}
            className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <Send size={24} />
          </button>
        </div>
      </footer>
    </motion.div>
  )
}

export default Chatbot
